from flask import Blueprint, render_template, request, redirect, url_for, flash
from datetime import datetime, timezone, timedelta
import os
import json
from database import (
    supabase_client, load_web_config, load_news, load_teachers, 
    sync_local_to_supabase, load_local_statuses, anonymize_name, 
    clean_address, format_waktu_daftar, PENDAFTARAN_JSON
)

public_bp = Blueprint('public', __name__)

@public_bp.route('/')
def home():
    news_list = load_news()
    return render_template('index.html', news_list=news_list[:3])

@public_bp.route('/profil')
def profil():
    teachers = load_teachers()
    
    # Dynamically extract Kepala Sekolah and Koordinator Tata Usaha for the organizational chart
    kepala_sekolah = next((t for t in teachers if 'kepala sekolah' in t.get('role', '').lower()), None)
    tata_usaha = next((t for t in teachers if 'tata usaha' in t.get('role', '').lower() or 'koordinator tu' in t.get('role', '').lower()), None)
    
    # Set default structures if not found
    if not kepala_sekolah:
        kepala_sekolah = {"name": "Abdul Kadir", "role": "Kepala Sekolah"}
    if not tata_usaha:
        tata_usaha = {"name": "Sitti Rahma, A.Ma.Pd.", "role": "Koordinator Tata Usaha"}
        
    return render_template('profil.html', teachers=teachers, kepala_sekolah=kepala_sekolah, tata_usaha=tata_usaha)

@public_bp.route('/akademik')
def akademik():
    return render_template('akademik.html')

@public_bp.route('/kesiswaan')
def kesiswaan():
    return render_template('kesiswaan.html')

@public_bp.route('/berita')
def berita():
    news_list = load_news()
    return render_template('berita.html', news_list=news_list)

@public_bp.route('/formulir-ppdb')
def formulir_offline():
    return render_template('formulir-ppdb.html')

@public_bp.route('/ppdb')
def ppdb_dashboard():
    sync_local_to_supabase()
    records = []
    
    # 1. Fetch from Supabase
    if supabase_client:
        try:
            # Try with status column first
            response = supabase_client.table("ppdb_sdn_bobong").select("nama_lengkap, jalur_ppdb, alamat_domisili, waktu_daftar, nik_siswa, status").order("waktu_daftar", desc=True).execute()
            if response.data:
                records = response.data
        except Exception as e:
            print(f"Supabase query with status failed, attempting without status: {e}")
            try:
                # Fallback without status column
                response = supabase_client.table("ppdb_sdn_bobong").select("nama_lengkap, jalur_ppdb, alamat_domisili, waktu_daftar, nik_siswa").order("waktu_daftar", desc=True).execute()
                if response.data:
                    records = response.data
            except Exception as e2:
                print(f"Error querying Supabase completely: {e2}")
            
    # 2. Fallback to local JSON file if empty or Supabase query failed
    if not records:
        json_file = PENDAFTARAN_JSON
        if os.path.exists(json_file):
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    local_data = json.load(f)
                    for r in local_data:
                        records.append({
                            "nama_lengkap": r.get("nama_lengkap", ""),
                            "nik_siswa": r.get("nik") or r.get("nik_siswa", ""),
                            "jalur_ppdb": r.get("jalur_ppdb", ""),
                            "alamat_domisili": r.get("alamat") or r.get("alamat_domisili", ""),
                            "waktu_daftar": r.get("waktu_daftar", ""),
                            "status": r.get("status", "Diterima Sistem")
                        })
                records.sort(key=lambda x: x.get("waktu_daftar", ""), reverse=True)
            except Exception as e:
                print(f"Error reading JSON fallback: {e}")

    # Load local statuses to overlay in case DB column is missing
    local_statuses = load_local_statuses()

    # 3. Anonymize, clean, and filter data for display
    pendaftar_list = []
    for r in records:
        nik = r.get("nik_siswa") or r.get("nik")
        status = r.get("status")
        
        # Overlay local status
        if not status or status == "Diterima Sistem":
            if nik and str(nik) in local_statuses:
                status = local_statuses[str(nik)]
        if not status:
            status = "Diterima Sistem"

        # Hide rejected registrations from public list
        if status == "Ditolak":
            continue

        pendaftar_list.append({
            "nama_lengkap": anonymize_name(r.get("nama_lengkap", "")),
            "jalur_ppdb": r.get("jalur_ppdb", "Zonasi"),
            "alamat_domisili": clean_address(r.get("alamat_domisili", "")),
            "waktu_daftar": format_waktu_daftar(r.get("waktu_daftar", "")),
            "status": status
        })

    return render_template('ppdb.html', pendaftar_list=pendaftar_list)

@public_bp.route('/ppdb-online', methods=['GET', 'POST'])
def ppdb_form():
    if request.method == 'POST':
        nama_lengkap = request.form.get('nama_lengkap', '').strip()
        nik = request.form.get('nik', '').strip()
        tempat_lahir = request.form.get('tempat_lahir', '').strip()
        tanggal_lahir = request.form.get('tanggal_lahir', '').strip()
        jenis_kelamin = request.form.get('jenis_kelamin', '').strip()
        nama_ibu = request.form.get('nama_ibu', '').strip()
        no_hp = request.form.get('no_hp', '').strip()
        alamat = request.form.get('alamat', '').strip()
        jalur_ppdb = request.form.get('jalur_ppdb', '').strip()
        waktu_sekarang = datetime.now(timezone(timedelta(hours=9))).strftime("%Y-%m-%d %H:%M:%S")
        record_id = str(int(datetime.now().timestamp() * 1000))

        # Validation checks
        if not all([nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, nama_ibu, no_hp, alamat, jalur_ppdb]):
            flash("Semua kolom formulir wajib diisi!", "error")
            return render_template('form_ppdb.html', form_data=request.form)

        if len(nik) != 16 or not nik.isdigit():
            flash("NIK harus terdiri dari 16 digit angka!", "error")
            return render_template('form_ppdb.html', form_data=request.form)

        data = {
            "id": record_id,
            "nama_lengkap": nama_lengkap,
            "nik": nik,
            "tempat_lahir": tempat_lahir,
            "tanggal_lahir": tanggal_lahir,
            "jenis_kelamin": jenis_kelamin,
            "nama_ibu": nama_ibu,
            "no_hp": no_hp,
            "alamat": alamat,
            "jalur_ppdb": jalur_ppdb,
            "waktu_daftar": waktu_sekarang,
            "status": "Diterima Sistem"
        }

        # Save to local JSON first (ensuring we always have data backup)
        json_file = PENDAFTARAN_JSON
        records = []
        if os.path.exists(json_file):
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    records = json.load(f)
            except Exception as e:
                print(f"Error reading JSON: {e}")
        records.append(data)
        try:
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(records, f, indent=4, ensure_ascii=False)
            print("Data pendaftaran berhasil dicadangkan secara lokal di pendaftaran.json")
        except Exception as e:
            print(f"Gagal menyimpan data cadangan lokal: {e}")

        # Supabase write
        if supabase_client:
            supabase_data = {
                "nama_lengkap": nama_lengkap,
                "nik_siswa": nik,
                "tempat_lahir": tempat_lahir,
                "tanggal_lahir": tanggal_lahir,
                "jenis_kelamin": jenis_kelamin,
                "nama_ibu_kandung": nama_ibu,
                "alamat_domisili": alamat,
                "nomor_hp_orangtua": no_hp,
                "jalur_ppdb": jalur_ppdb,
                "waktu_daftar": waktu_sekarang,
                "status": "Diterima Sistem"
            }
            try:
                response = supabase_client.table("ppdb_sdn_bobong").insert(supabase_data).execute()
                if response.data:
                    return redirect(url_for('public.ppdb_sukses'))
            except Exception as e:
                print(f"Supabase write failed, attempting without status column: {e}")
                if "status" in supabase_data:
                    del supabase_data["status"]
                try:
                    response = supabase_client.table("ppdb_sdn_bobong").insert(supabase_data).execute()
                    if response.data:
                        return redirect(url_for('public.ppdb_sukses'))
                except Exception as e2:
                    print(f"Supabase complete failure: {e2}")

        # If Supabase not initialized or both writes failed but local JSON succeeded, redirect to success
        return redirect(url_for('public.ppdb_sukses'))

    # GET request
    return render_template('form_ppdb.html', form_data={})

@public_bp.route('/ppdb-online/sukses')
def ppdb_sukses():
    return render_template('sukses_ppdb.html')
