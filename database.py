import os
import re
import json
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# Protected local data directory configuration
DATA_DIR = 'data'
os.makedirs(DATA_DIR, exist_ok=True)

WEBSITE_CONFIG_JSON = os.path.join(DATA_DIR, "website_config.json")
NEWS_JSON = os.path.join(DATA_DIR, "news.json")
TEACHERS_JSON = os.path.join(DATA_DIR, "teachers.json")
PENDAFTARAN_JSON = os.path.join(DATA_DIR, "pendaftaran.json")

# Initialize Supabase Client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase_client = None
if SUPABASE_URL and SUPABASE_KEY and "your-project-id" not in SUPABASE_URL and "your-supabase-anon-key" not in SUPABASE_KEY:
    try:
        supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")

# --- Data Loading and Saving Helpers ---

def load_web_config():
    json_file = WEBSITE_CONFIG_JSON
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
    json_file = NEWS_JSON
    if os.path.exists(json_file):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading news: {e}")
    return []

def load_teachers():
    json_file = TEACHERS_JSON
    if os.path.exists(json_file):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Error loading teachers: {e}")
    return []

def save_teachers(teachers):
    json_file = TEACHERS_JSON
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
    json_file = PENDAFTARAN_JSON
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
        
    json_file = PENDAFTARAN_JSON
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
