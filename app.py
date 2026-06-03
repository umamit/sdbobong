import os
import re
import json
import csv
import io
from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, flash, session, make_response
from werkzeug.utils import secure_filename
from werkzeug.exceptions import RequestEntityTooLarge
from dotenv import load_dotenv
from supabase import create_client, Client
from datetime import datetime, timezone, timedelta

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = os.getenv("FLASK_SECRET_KEY", "super-secret-key-sdn-bobong")
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024  # Limit size to 1MB

@app.errorhandler(RequestEntityTooLarge)
def handle_large_file(e):
    flash("Ukuran file terlalu besar! Maksimal ukuran file adalah 1MB.", "error")
    return redirect(url_for('admin_dashboard') + '?tab=teachers')

# Upload configurations
UPLOAD_FOLDER = 'images/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
ALLOWED_EXTENSIONS = {'png'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def handle_photo_upload(file_obj):
    if not file_obj or file_obj.filename == '':
        return "NO_FILE"
        
    if allowed_file(file_obj.filename):
        filename = secure_filename(file_obj.filename)
        # Generate a unique prefix to avoid caching and collision issues
        unique_prefix = str(int(datetime.now().timestamp()))
        unique_filename = f"{unique_prefix}_{filename}"
        
        # 1. Try to upload to Supabase Storage
        if supabase_client:
            try:
                # Seek to start
                file_obj.seek(0)
                file_bytes = file_obj.read()
                
                # Upload using Python SDK
                supabase_client.storage.from_('teachers').upload(
                    path=unique_filename,
                    file=file_bytes,
                    file_options={"content-type": file_obj.content_type}
                )
                # Get public URL
                public_url = supabase_client.storage.from_('teachers').get_public_url(unique_filename)
                print(f"File uploaded to Supabase Storage: {public_url}")
                return public_url
            except Exception as e:
                print(f"Supabase Storage upload failed: {e}. Falling back to local file upload.")
        
        # 2. Local Fallback
        file_obj.seek(0)
        local_path = os.path.join(UPLOAD_FOLDER, unique_filename)
        file_obj.save(local_path)
        # Return path relative to webroot
        return f"/images/uploads/{unique_filename}"
        
    return "INVALID_TYPE"

# Initialize Supabase Client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase_client = None
if SUPABASE_URL and SUPABASE_KEY and "your-project-id" not in SUPABASE_URL and "your-supabase-anon-key" not in SUPABASE_KEY:
    try:
        supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")

# --- Helper Functions & CMS Utilities ---

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('admin_logged_in'):
            flash("Anda harus login terlebih dahulu!", "error")
            return redirect(url_for('admin_login'))
        return f(*args, **kwargs)
    return decorated_function

def load_web_config():
    json_file = "website_config.json"
    if os.path.exists(json_file):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading web config: {e}")
    # Default config if not exists
    return {
        "marquee_announcements": [
            "📢 PENGUMUMAN: Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Telah Dibuka! Silakan daftar online pada portal PPDB.",
            "📅 INFO: Jadwal Pembagian Rapor Semester Genap dilaksanakan pada 20 Juni 2026.",
            "🌟 PRESTASI: Selamat kepada Tim Pramuka SD Negeri Bobong meraih Juara Harapan 1 Lomba Tingkat Kabupaten!"
        ],
        "stats": {
            "siswa_aktif": 205,
            "guru_staf": 14,
            "ruang_kelas": 9,
            "akreditasi": "B"
        }
    }

def load_news():
    json_file = "news.json"
    if os.path.exists(json_file):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading news: {e}")
    return []

def load_teachers():
    json_file = "teachers.json"
    if os.path.exists(json_file):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading teachers: {e}")
    return []

def save_teachers(teachers):
    json_file = "teachers.json"
    try:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(teachers, f, indent=4, ensure_ascii=False)
        return True
    except Exception as e:
        print(f"Error saving teachers: {e}")
        return False

def anonymize_name(name):
    if not name:
        return "***"
    name = name.strip()
    if len(name) <= 2:
        return name + "***"
    return name[:2] + "***"

def clean_address(address):
    if not address:
        return "Pulau Taliabu"
    address_lower = address.lower()
    
    match = re.search(r'\b(desa|kelurahan|dusun)\s+([a-zA-Z\s]+)', address_lower)
    if match:
        extracted = match.group(0).strip()
        words = extracted.split()
        if len(words) > 3:
            return " ".join(words[:3]).title()
        return extracted.title()
    
    villages = ['wayo', 'bobong', 'rongi', 'kilong', 'talo', 'walo', 'kilo', 'pencado', 'limbo']
    for v in villages:
        if v in address_lower:
            return f"Desa {v.title()}"
    
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
        clean_time = raw_waktu.split('.')[0].split('+')[0]
        dt = datetime.strptime(clean_time, "%Y-%m-%d %H:%M:%S")
        months_id = {
            1: "Jan", 2: "Feb", 3: "Mar", 4: "Apr", 5: "Mei", 6: "Jun",
            7: "Jul", 8: "Agu", 9: "Sep", 10: "Okt", 11: "Nov", 12: "Des"
        }
        return f"{dt.day:02d} {months_id[dt.month]} {dt.year} {dt.hour:02d}:{dt.minute:02d} WIT"
    except Exception:
        return raw_waktu[:16]

def load_local_statuses():
    local_statuses = {}
    json_file = "pendaftaran.json"
    if os.path.exists(json_file):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                local_data = json.load(f)
                for ld in local_data:
                    nik = ld.get("nik") or ld.get("nik_siswa")
                    if nik:
                        local_statuses[str(nik)] = ld.get("status", "Diterima Sistem")
        except Exception as e:
            print(f"Error loading local statuses: {e}")
    return local_statuses

def sync_local_to_supabase():
    if not supabase_client:
        return
        
    json_file = "pendaftaran.json"
    if not os.path.exists(json_file):
        return
        
    try:
        # 1. Fetch existing NIKs from Supabase to prevent duplicates
        response = supabase_client.table("ppdb_sdn_bobong").select("nik_siswa").execute()
        db_niks = set()
        if response.data:
            for row in response.data:
                nik = row.get("nik_siswa")
                if nik:
                    db_niks.add(str(nik).strip())
                    
        # 2. Read local records
        with open(json_file, 'r', encoding='utf-8') as f:
            local_data = json.load(f)
            
        # 3. Find records that are not in Supabase and insert them
        synced_count = 0
        for r in local_data:
            nik = str(r.get("nik", r.get("nik_siswa", ""))).strip()
            if nik and nik not in db_niks:
                # Sync this record to Supabase
                supabase_data = {
                    "nama_lengkap": r.get("nama_lengkap", ""),
                    "nik_siswa": nik,
                    "tempat_lahir": r.get("tempat_lahir", ""),
                    "tanggal_lahir": r.get("tanggal_lahir", ""),
                    "jenis_kelamin": r.get("jenis_kelamin", ""),
                    "nama_ibu_kandung": r.get("nama_ibu") or r.get("nama_ibu_kandung", ""),
                    "alamat_domisili": r.get("alamat") or r.get("alamat_domisili", ""),
                    "nomor_hp_orangtua": r.get("no_hp") or r.get("nomor_hp_orangtua", ""),
                    "jalur_ppdb": r.get("jalur_ppdb", "Zonasi"),
                    "waktu_daftar": r.get("waktu_daftar", datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
                    "status": r.get("status", "Diterima Sistem")
                }
                try:
                    # Write to DB
                    supabase_client.table("ppdb_sdn_bobong").insert(supabase_data).execute()
                    synced_count += 1
                    db_niks.add(nik)
                except Exception as e:
                    print(f"Failed syncing local record NIK {nik} to Supabase: {e}")
                    if "status" in supabase_data:
                        del supabase_data["status"]
                    try:
                        supabase_client.table("ppdb_sdn_bobong").insert(supabase_data).execute()
                        synced_count += 1
                        db_niks.add(nik)
                    except Exception as e2:
                        print(f"Failed syncing local record NIK {nik} to Supabase completely: {e2}")
                        
        if synced_count > 0:
            print(f"Berhasil mensinkronisasi {synced_count} data pendaftaran dari lokal ke Supabase.")
    except Exception as e:
        print(f"Error in sync_local_to_supabase: {e}")

# --- Global Context Processor ---

@app.context_processor
def inject_global_data():
    config = load_web_config()
    return {
        "global_announcements": config.get("marquee_announcements", []),
        "global_stats": config.get("stats", {})
    }

# --- Public Page Routes ---

@app.route('/')
def home():
    news_list = load_news()
    return render_template('index.html', news_list=news_list[:3])

@app.route('/profil')
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

@app.route('/akademik')
def akademik():
    return render_template('akademik.html')

@app.route('/kesiswaan')
def kesiswaan():
    return render_template('kesiswaan.html')

@app.route('/berita')
def berita():
    news_list = load_news()
    return render_template('berita.html', news_list=news_list)

@app.route('/formulir-ppdb')
def formulir_offline():
    return render_template('formulir-ppdb.html')

@app.route('/ppdb')
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
        json_file = "pendaftaran.json"
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
                    return redirect(url_for('ppdb_sukses'))
            except Exception as e:
                print(f"Supabase write failed, attempting without status column: {e}")
                if "status" in supabase_data:
                    del supabase_data["status"]
                try:
                    response = supabase_client.table("ppdb_sdn_bobong").insert(supabase_data).execute()
                    if response.data:
                        return redirect(url_for('ppdb_sukses'))
                except Exception as e2:
                    print(f"Supabase complete failure: {e2}")

        # If Supabase not initialized or both writes failed but local JSON succeeded, redirect to success
        return redirect(url_for('ppdb_sukses'))

    # GET request
    return render_template('form_ppdb.html', form_data={})

@app.route('/ppdb-online/sukses')
def ppdb_sukses():
    return render_template('sukses_ppdb.html')

# --- Admin Panel Authentication Routes ---

@app.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if session.get('admin_logged_in'):
        return redirect(url_for('admin_dashboard'))
        
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '').strip()
        
        env_user = os.getenv("ADMIN_USERNAME", "admin")
        env_pass = os.getenv("ADMIN_PASSWORD", "sdnbobong2026")
        
        if username == env_user and password == env_pass:
            session['admin_logged_in'] = True
            flash("Selamat datang kembali, Administrator!", "success")
            return redirect(url_for('admin_dashboard'))
        else:
            flash("Username atau password salah!", "error")
            
    return render_template('admin_login.html')

@app.route('/admin/logout', methods=['POST'])
def admin_logout():
    session.pop('admin_logged_in', None)
    flash("Anda telah berhasil logout.", "success")
    return redirect(url_for('admin_login'))

# --- Admin Dashboard & CRUD Operations ---

@app.route('/admin/dashboard')
@login_required
def admin_dashboard():
    sync_local_to_supabase()
    records = []
    db_status = False
    
    # 1. Fetch PPDB records
    if supabase_client:
        try:
            response = supabase_client.table("ppdb_sdn_bobong").select("*").order("waktu_daftar", desc=True).execute()
            db_status = True
            if response.data:
                records = response.data
        except Exception as e:
            print(f"Error querying Supabase for admin dashboard: {e}")
            
    if not records:
        json_file = "pendaftaran.json"
        if os.path.exists(json_file):
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    local_data = json.load(f)
                    for idx, r in enumerate(local_data):
                        record_id = r.get("id") or r.get("nik") or str(idx + 1)
                        records.append({
                            "id": record_id,
                            "nama_lengkap": r.get("nama_lengkap", ""),
                            "nik_siswa": r.get("nik") or r.get("nik_siswa", ""),
                            "tempat_lahir": r.get("tempat_lahir", ""),
                            "tanggal_lahir": r.get("tanggal_lahir", ""),
                            "jenis_kelamin": r.get("jenis_kelamin", ""),
                            "nama_ibu_kandung": r.get("nama_ibu") or r.get("nama_ibu_kandung", ""),
                            "nomor_hp_orangtua": r.get("no_hp") or r.get("nomor_hp_orangtua", ""),
                            "alamat_domisili": r.get("alamat") or r.get("alamat_domisili", ""),
                            "jalur_ppdb": r.get("jalur_ppdb", ""),
                            "waktu_daftar": r.get("waktu_daftar", ""),
                            "status": r.get("status", "Diterima Sistem")
                        })
                records.sort(key=lambda x: x.get("waktu_daftar", ""), reverse=True)
            except Exception as e:
                print(f"Error reading JSON fallback: {e}")

    # Overlay local status in case Supabase schema does not support status column
    local_statuses = load_local_statuses()
    for r in records:
        # Generate string id
        r_id = r.get("id") or r.get("nik_siswa") or r.get("nik")
        r["id"] = r_id
        
        # Status overlay
        nik = r.get("nik_siswa") or r.get("nik")
        status = r.get("status")
        if not status or status == "Diterima Sistem":
            if nik and str(nik) in local_statuses:
                status = local_statuses[str(nik)]
        if not status:
            status = "Diterima Sistem"
        r["status"] = status
        
    config = load_web_config()
    news_list = load_news()
    teachers = load_teachers()
    
    return render_template(
        'admin_dashboard.html',
        pendaftar_records=records,
        config=config,
        news_list=news_list,
        teachers=teachers,
        db_status=db_status
    )

@app.route('/admin/ppdb/status/<record_id>', methods=['POST'])
@login_required
def admin_ppdb_status(record_id):
    new_status = request.form.get('status', '').strip()
    updated_ok = False
    
    # 1. Update local JSON backup first
    json_file = "pendaftaran.json"
    if os.path.exists(json_file):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                records = json.load(f)
            
            found = False
            for idx, r in enumerate(records):
                r_id = r.get("id") or r.get("nik") or r.get("nik_siswa") or str(idx + 1)
                if str(r_id) == str(record_id) or str(r.get("nik")) == str(record_id) or str(r.get("nik_siswa")) == str(record_id):
                    r["status"] = new_status
                    found = True
                    break
            
            if found:
                with open(json_file, 'w', encoding='utf-8') as f:
                    json.dump(records, f, indent=4, ensure_ascii=False)
                updated_ok = True
        except Exception as e:
            print(f"Error updating JSON status: {e}")

    # 2. Update Supabase
    if supabase_client:
        try:
            # We try updating by id or NIK
            response = supabase_client.table("ppdb_sdn_bobong").update({"status": new_status}).eq("id", record_id).execute()
            if not response.data:
                # try by NIK if ID mismatch
                response = supabase_client.table("ppdb_sdn_bobong").update({"status": new_status}).eq("nik_siswa", record_id).execute()
            if response.data:
                updated_ok = True
        except Exception as e:
            print(f"Error updating status in Supabase (possibly missing column): {e}")

    if updated_ok:
        flash(f"Status pendaftar berhasil diperbarui menjadi: {new_status}", "success")
    else:
        flash("Gagal memperbarui status pendaftaran.", "error")
        
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/ppdb/delete/<record_id>', methods=['POST'])
@login_required
def admin_ppdb_delete(record_id):
    deleted_ok = False
    
    # 1. Delete from local JSON backup
    json_file = "pendaftaran.json"
    if os.path.exists(json_file):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                records = json.load(f)
            
            new_records = []
            for idx, r in enumerate(records):
                r_id = r.get("id") or r.get("nik") or r.get("nik_siswa") or str(idx + 1)
                if str(r_id) != str(record_id) and str(r.get("nik")) != str(record_id) and str(r.get("nik_siswa")) != str(record_id):
                    new_records.append(r)
            
            if len(new_records) < len(records):
                with open(json_file, 'w', encoding='utf-8') as f:
                    json.dump(new_records, f, indent=4, ensure_ascii=False)
                deleted_ok = True
        except Exception as e:
            print(f"Error deleting from JSON: {e}")

    # 2. Delete from Supabase
    if supabase_client:
        try:
            response = supabase_client.table("ppdb_sdn_bobong").delete().eq("id", record_id).execute()
            if not response.data:
                response = supabase_client.table("ppdb_sdn_bobong").delete().eq("nik_siswa", record_id).execute()
            if response.data:
                deleted_ok = True
        except Exception as e:
            print(f"Error deleting from Supabase: {e}")

    if deleted_ok:
        flash("Data pendaftar berhasil dihapus secara permanen.", "success")
    else:
        flash("Gagal menghapus data pendaftaran.", "error")
        
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/ppdb/export')
@login_required
def admin_ppdb_export():
    records = []
    
    if supabase_client:
        try:
            response = supabase_client.table("ppdb_sdn_bobong").select("*").order("waktu_daftar", desc=True).execute()
            if response.data:
                records = response.data
        except Exception as e:
            print(f"Error exporting from Supabase: {e}")
            
    if not records:
        json_file = "pendaftaran.json"
        if os.path.exists(json_file):
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    local_data = json.load(f)
                    for idx, r in enumerate(local_data):
                        records.append({
                            "nama_lengkap": r.get("nama_lengkap", ""),
                            "nik_siswa": r.get("nik") or r.get("nik_siswa", ""),
                            "tempat_lahir": r.get("tempat_lahir", ""),
                            "tanggal_lahir": r.get("tanggal_lahir", ""),
                            "jenis_kelamin": r.get("jenis_kelamin", ""),
                            "nama_ibu_kandung": r.get("nama_ibu") or r.get("nama_ibu_kandung", ""),
                            "nomor_hp_orangtua": r.get("no_hp") or r.get("nomor_hp_orangtua", ""),
                            "alamat_domisili": r.get("alamat") or r.get("alamat_domisili", ""),
                            "jalur_ppdb": r.get("jalur_ppdb", ""),
                            "waktu_daftar": r.get("waktu_daftar", ""),
                            "status": r.get("status", "Diterima Sistem")
                        })
            except Exception as e:
                print(f"Error reading local export data: {e}")

    local_statuses = load_local_statuses()

    dest = io.StringIO()
    writer = csv.writer(dest)
    writer.writerow([
        "No", "Nama Lengkap", "NIK Siswa", "Tempat Lahir", "Tanggal Lahir",
        "Jenis Kelamin", "Nama Ibu Kandung", "Nomor HP Orang Tua", "Alamat Domisili",
        "Jalur PPDB", "Waktu Daftar", "Status"
    ])
    
    for idx, r in enumerate(records):
        nik = r.get("nik_siswa") or r.get("nik")
        status = r.get("status")
        if not status or status == "Diterima Sistem":
            if nik and str(nik) in local_statuses:
                status = local_statuses[str(nik)]
        if not status:
            status = "Diterima Sistem"
            
        writer.writerow([
            idx + 1,
            r.get("nama_lengkap", ""),
            r.get("nik_siswa") or r.get("nik", ""),
            r.get("tempat_lahir", ""),
            r.get("tanggal_lahir", ""),
            r.get("jenis_kelamin", ""),
            r.get("nama_ibu_kandung") or r.get("nama_ibu", ""),
            r.get("nomor_hp_orangtua") or r.get("no_hp", ""),
            r.get("alamat_domisili") or r.get("alamat", ""),
            r.get("jalur_ppdb", ""),
            r.get("waktu_daftar", ""),
            status
        ])
        
    response = make_response(dest.getvalue())
    response.headers["Content-Disposition"] = f"attachment; filename=ppdb_sdn_bobong_{datetime.now().strftime('%Y%m%d')}.csv"
    response.headers["Content-Type"] = "text/csv; charset=utf-8"
    return response

@app.route('/admin/config/update', methods=['POST'])
@login_required
def admin_config_update():
    action_type = request.form.get('action_type', '')
    config = load_web_config()
    
    if action_type == 'announcements':
        announcements = request.form.getlist('announcements[]')
        cleaned_ann = [a.strip() for a in announcements if a.strip()]
        config['marquee_announcements'] = cleaned_ann
        
    elif action_type == 'stats':
        config['stats'] = {
            "siswa_aktif": int(request.form.get('siswa_aktif', 0)),
            "guru_staf": int(request.form.get('guru_staf', 0)),
            "ruang_kelas": int(request.form.get('ruang_kelas', 0)),
            "akreditasi": request.form.get('akreditasi', 'B').strip().upper()
        }
        
    json_file = "website_config.json"
    try:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(config, f, indent=4, ensure_ascii=False)
        flash("Konfigurasi website berhasil disimpan.", "success")
    except Exception as e:
        print(f"Error saving config: {e}")
        flash("Gagal menyimpan konfigurasi website.", "error")
        
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/news/add', methods=['POST'])
@login_required
def admin_news_add():
    title = request.form.get('title', '').strip()
    date = request.form.get('date', '').strip()
    category = request.form.get('category', '').strip()
    image = request.form.get('image', '').strip()
    content = request.form.get('content', '').strip()
    
    if not all([title, date, category, image, content]):
        flash("Semua kolom berita wajib diisi!", "error")
        return redirect(url_for('admin_dashboard'))
        
    news_list = load_news()
    new_article = {
        "id": f"news-{int(datetime.now().timestamp())}",
        "title": title,
        "date": date,
        "category": category,
        "image": image,
        "content": content
    }
    news_list.insert(0, new_article)
    
    json_file = "news.json"
    try:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(news_list, f, indent=4, ensure_ascii=False)
        flash("Berita baru berhasil diterbitkan!", "success")
    except Exception as e:
        print(f"Error saving news: {e}")
        flash("Gagal menyimpan berita baru.", "error")
        
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/news/delete/<news_id>', methods=['POST'])
@login_required
def admin_news_delete(news_id):
    news_list = load_news()
    new_list = [n for n in news_list if n.get("id") != news_id]
    
    json_file = "news.json"
    try:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(new_list, f, indent=4, ensure_ascii=False)
        flash("Artikel berita berhasil dihapus.", "success")
    except Exception as e:
        print(f"Error deleting news: {e}")
        flash("Gagal menghapus artikel berita.", "error")
        
    return redirect(url_for('admin_dashboard'))

@app.route('/admin/teachers/add', methods=['POST'])
@login_required
def admin_teacher_add():
    name = request.form.get('name', '').strip()
    role = request.form.get('role', '').strip()
    details = request.form.get('details', '').strip()
    status = request.form.get('status', '').strip()
    image = request.form.get('image', '').strip()
    
    # Process uploaded file if any
    photo_file = request.files.get('photo')
    uploaded_url = handle_photo_upload(photo_file)
    if uploaded_url == "INVALID_TYPE":
        flash("Jenis file tidak valid! Hanya file PNG yang diperbolehkan.", "error")
        return redirect(url_for('admin_dashboard') + '?tab=teachers')
    elif uploaded_url and uploaded_url != "NO_FILE":
        image = uploaded_url
        
    if not all([name, role, status, image]):
        flash("Kolom Nama, Jabatan, Status, dan Foto wajib diisi!", "error")
        return redirect(url_for('admin_dashboard') + '?tab=teachers')
        
    teachers = load_teachers()
    new_teacher = {
        "id": f"teacher-{int(datetime.now().timestamp())}",
        "name": name,
        "role": role,
        "details": details,
        "status": status,
        "image": image
    }
    
    if 'kepala sekolah' in role.lower():
        teachers.insert(0, new_teacher)
    else:
        teachers.append(new_teacher)
        
    if save_teachers(teachers):
        flash("Data guru berhasil ditambahkan!", "success")
    else:
        flash("Gagal menyimpan data guru baru.", "error")
        
    return redirect(url_for('admin_dashboard') + '?tab=teachers')

@app.route('/admin/teachers/edit/<teacher_id>', methods=['GET', 'POST'])
@login_required
def admin_teacher_edit(teacher_id):
    teachers = load_teachers()
    teacher = next((t for t in teachers if t.get('id') == teacher_id), None)
    
    if not teacher:
        flash("Data guru tidak ditemukan.", "error")
        return redirect(url_for('admin_dashboard') + '?tab=teachers')
        
    if request.method == 'GET':
        return render_template('edit_teacher.html', teacher=teacher)
        
    name = request.form.get('name', '').strip()
    role = request.form.get('role', '').strip()
    details = request.form.get('details', '').strip()
    status = request.form.get('status', '').strip()
    image = request.form.get('image', '').strip()
    
    # Process uploaded file if any
    photo_file = request.files.get('photo')
    uploaded_url = handle_photo_upload(photo_file)
    if uploaded_url == "INVALID_TYPE":
        flash("Jenis file tidak valid! Hanya file PNG yang diperbolehkan.", "error")
        return render_template('edit_teacher.html', teacher=teacher)
    elif uploaded_url and uploaded_url != "NO_FILE":
        image = uploaded_url
        
    if not all([name, role, status, image]):
        flash("Kolom Nama, Jabatan, Status, dan Foto wajib diisi!", "error")
        return render_template('edit_teacher.html', teacher=teacher)
        
    # Update details
    teacher['name'] = name
    teacher['role'] = role
    teacher['details'] = details
    teacher['status'] = status
    teacher['image'] = image
            
    if save_teachers(teachers):
        flash("Data guru berhasil diperbarui!", "success")
    else:
        flash("Gagal menyimpan perubahan data guru.", "error")
        
    return redirect(url_for('admin_dashboard') + '?tab=teachers')

@app.route('/admin/teachers/delete/<teacher_id>', methods=['POST'])
@login_required
def admin_teacher_delete(teacher_id):
    teachers = load_teachers()
    new_teachers = [t for t in teachers if t.get('id') != teacher_id]
    
    if len(new_teachers) < len(teachers):
        if save_teachers(new_teachers):
            flash("Data guru berhasil dihapus.", "success")
        else:
            flash("Gagal menyimpan perubahan setelah penghapusan.", "error")
    else:
        flash("Data guru tidak ditemukan.", "error")
        
    return redirect(url_for('admin_dashboard') + '?tab=teachers')

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5001))
    app.run(debug=True, host='0.0.0.0', port=port)
