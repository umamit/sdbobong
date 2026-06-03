import os
import re
import json
from flask import Flask, render_template, request, redirect, url_for, flash
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime, timezone, timedelta

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = os.getenv("FLASK_SECRET_KEY", "super-secret-key-sdn-bobong")

# Initialize Supabase Client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase_client = None
if SUPABASE_URL and SUPABASE_KEY and "your-project-id" not in SUPABASE_URL and "your-supabase-anon-key" not in SUPABASE_KEY:
    try:
        supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")

def anonymize_name(name):
    if not name:
        return "***"
    name = name.strip()
    # Truncate to first 2 letters + ***
    if len(name) <= 2:
        return name + "***"
    return name[:2] + "***"

def clean_address(address):
    if not address:
        return "Pulau Taliabu"
    address_lower = address.lower()
    
    # Try to find "desa [word]" or "kelurahan [word]" or "dusun [word]"
    match = re.search(r'\b(desa|kelurahan|dusun)\s+([a-zA-Z\s]+)', address_lower)
    if match:
        # Clean up and return title case
        extracted = match.group(0).strip()
        # Limit to 3 words to avoid trailing details
        words = extracted.split()
        if len(words) > 3:
            return " ".join(words[:3]).title()
        return extracted.title()
    
    # If not found, look for common village names in Taliabu Barat
    villages = ['wayo', 'bobong', 'rongi', 'kilong', 'talo', 'walo', 'kilo', 'pencado', 'limbo']
    for v in villages:
        if v in address_lower:
            return f"Desa {v.title()}"
    
    # Fallback to the first part before comma or first 3 words
    parts = address.split(',')
    if parts:
        first_part = parts[0].strip()
        words = first_part.split()
        if len(words) > 3:
            return " ".join(words[:3]) + "..."
        return first_part
    return "Pulau Taliabu"

def format_waktu_daftar(raw_waktu):
    if not raw_waktu:
        return ""
    try:
        # Expected formats: YYYY-MM-DD HH:MM:SS or ISO format
        # Strip milliseconds/timezone if any
        clean_time = raw_waktu.split('.')[0].split('+')[0]
        dt = datetime.strptime(clean_time, "%Y-%m-%d %H:%M:%S")
        months_id = {
            1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Mei", 6: "Jun",
            7: "Jul", 8: "Agu", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Des"
        }
        return f"{dt.day:02d} {months_id[dt.month]} {dt.year} {dt.hour:02d}:{dt.minute:02d} WIT"
    except Exception:
        # Return fallback slice if parsing fails
        return raw_waktu[:16]

# --- Static Page Routes ---

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/profil')
def profil():
    return render_template('profil.html')

@app.route('/akademik')
def akademik():
    return render_template('akademik.html')

@app.route('/kesiswaan')
def kesiswaan():
    return render_template('kesiswaan.html')

@app.route('/berita')
def berita():
    return render_template('berita.html')

@app.route('/formulir-ppdb')
def formulir_offline():
    return render_template('formulir-ppdb.html')

@app.route('/ppdb')
def ppdb_dashboard():
    records = []
    
    # 1. Fetch from Supabase
    if supabase_client:
        try:
            response = supabase_client.table("ppdb_sdn_bobong").select("nama_lengkap, jalur_ppdb, alamat_domisili, waktu_daftar").order("waktu_daftar", desc=True).execute()
            if response.data:
                records = response.data
        except Exception as e:
            print(f"Error querying Supabase: {e}")
            
    # 2. Fallback to local JSON file if empty or Supabase query failed
    if not records:
        json_file = "pendaftaran.json"
        if os.path.exists(json_file):
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    local_data = json.load(f)
                    for r in local_data:
                        records.append({
                            "nama_lengkap": r.get("nama_lengkap", ""),
                            "jalur_ppdb": r.get("jalur_ppdb", ""),
                            "alamat_domisili": r.get("alamat", ""),
                            "waktu_daftar": r.get("waktu_daftar", "")
                        })
                # Sort records by waktu_daftar descending
                records.sort(key=lambda x: x.get("waktu_daftar", ""), reverse=True)
            except Exception as e:
                print(f"Error reading JSON fallback: {e}")

    # 3. Anonymize and clean data for display
    pendaftar_list = []
    for r in records:
        pendaftar_list.append({
            "nama_lengkap": anonymize_name(r.get("nama_lengkap", "")),
            "jalur_ppdb": r.get("jalur_ppdb", "Zonasi"),
            "alamat_domisili": clean_address(r.get("alamat_domisili", "")),
            "waktu_daftar": format_waktu_daftar(r.get("waktu_daftar", ""))
        })

    return render_template('ppdb.html', pendaftar_list=pendaftar_list)

# --- Online Form Routes ---

@app.route('/ppdb-online', methods=['GET', 'POST'])
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

        # Validation checks
        if not all([nama_lengkap, nik, tempat_lahir, tanggal_lahir, jenis_kelamin, nama_ibu, no_hp, alamat, jalur_ppdb]):
            flash("Semua kolom formulir wajib diisi!", "error")
            return render_template('form_ppdb.html', form_data=request.form)

        if len(nik) != 16 or not nik.isdigit():
            flash("NIK harus terdiri dari 16 digit angka!", "error")
            return render_template('form_ppdb.html', form_data=request.form)

        data = {
            "nama_lengkap": nama_lengkap,
            "nik": nik,
            "tempat_lahir": tempat_lahir,
            "tanggal_lahir": tanggal_lahir,
            "jenis_kelamin": jenis_kelamin,
            "nama_ibu": nama_ibu,
            "no_hp": no_hp,
            "alamat": alamat,
            "jalur_ppdb": jalur_ppdb,
            "waktu_daftar": waktu_sekarang
        }

        # Database insertion / Fallback to local storage
        if not supabase_client:
            # Fallback to local JSON storage for development/testing
            json_file = "pendaftaran.json"
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
                print("Data disimpan secara lokal di pendaftaran.json (Supabase belum terkonfigurasi)")
                return redirect(url_for('ppdb_sukses'))
            except Exception as e:
                flash(f"Gagal menyimpan data secara lokal: {str(e)}", "error")
                return render_template('form_ppdb.html', form_data=request.form)

        # Map to actual Supabase database columns
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
            "waktu_daftar": waktu_sekarang
        }

        try:
            response = supabase_client.table("ppdb_sdn_bobong").insert(supabase_data).execute()
            
            # Check if execution inserted data successfully
            if response.data:
                return redirect(url_for('ppdb_sukses'))
            else:
                flash("Terjadi kesalahan saat menyimpan data. Silakan coba kembali.", "error")
        except Exception as e:
            print(f"Database insertion failed: {e}")
            flash(f"Gagal menyimpan data ke server: {str(e)}", "error")

        return render_template('form_ppdb.html', form_data=request.form)

    # GET request
    return render_template('form_ppdb.html', form_data={})

@app.route('/ppdb-online/sukses')
def ppdb_sukses():
    return render_template('sukses_ppdb.html')

if __name__ == '__main__':
    # Run locally on port 5001 (port 5000 is often used by AirPlay on macOS)
    port = int(os.getenv("PORT", 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
