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
    # 1. Load local news first as a fallback/seed candidate
    local_news = []
    if os.path.exists(NEWS_JSON):
        try:
            with open(NEWS_JSON, 'r', encoding='utf-8') as f:
                local_news = json.load(f)
        except Exception as e:
            print(f"Error loading local news: {e}")

    if not supabase_client:
        return local_news

    try:
        # Load from Supabase
        response = supabase_client.table("news_sdn_bobong").select("*").execute()
        supabase_news = response.data
        
        # If Supabase is empty, seed from local JSON
        if not supabase_news and local_news:
            print("Supabase news table is empty. Seeding from local JSON...")
            for article in local_news:
                db_data = {
                    "id": article.get("id"),
                    "title": article.get("title"),
                    "date": article.get("date"),
                    "category": article.get("category"),
                    "image": article.get("image"),
                    "content": article.get("content")
                }
                try:
                    supabase_client.table("news_sdn_bobong").insert(db_data).execute()
                except Exception as e:
                    print(f"Failed to seed news article {article.get('id')}: {e}")
            # Re-fetch after seeding
            try:
                response = supabase_client.table("news_sdn_bobong").select("*").execute()
                supabase_news = response.data
            except Exception:
                pass

        if supabase_news:
            news_list = []
            for n in supabase_news:
                news_list.append({
                    "id": n.get("id"),
                    "title": n.get("title"),
                    "date": n.get("date"),
                    "category": n.get("category"),
                    "image": n.get("image"),
                    "content": n.get("content")
                })
            
            # Sort news newest to oldest
            def get_news_sort_key(item):
                date_str = item.get("date", "")
                try:
                    if '-' in date_str:
                        parts = date_str.split('-')
                        if len(parts) == 3:
                            if len(parts[0]) == 4:
                                return datetime(int(parts[0]), int(parts[1]), int(parts[2]))
                            else:
                                return datetime(int(parts[2]), int(parts[1]), int(parts[0]))
                    
                    months_map = {
                        "jan": 1, "feb": 2, "mar": 3, "apr": 4, "mei": 5, "jun": 6,
                        "jul": 7, "agu": 8, "sep": 9, "okt": 10, "nov": 11, "des": 12,
                        "januari": 1, "februari": 2, "maret": 3, "april": 4, "mei": 5, "juni": 6,
                        "juli": 7, "agustus": 8, "september": 9, "oktober": 10, "november": 11, "desember": 12
                    }
                    parts = date_str.lower().replace(',', '').split()
                    if len(parts) == 3:
                        day = int(parts[0])
                        month = months_map.get(parts[1], 1)
                        year = int(parts[2])
                        return datetime(year, month, day)
                except Exception:
                    pass
                
                numeric_part = re.findall(r'\d+', item.get("id", "0"))
                if numeric_part:
                    val = int(numeric_part[0])
                    if val < 100:
                        return datetime(2025, 12 - val, 1)
                    return datetime.fromtimestamp(val)
                return datetime.min

            news_list.sort(key=get_news_sort_key, reverse=True)

            # Save to local JSON cache
            try:
                with open(NEWS_JSON, 'w', encoding='utf-8') as f:
                    json.dump(news_list, f, indent=4, ensure_ascii=False)
            except Exception as e:
                print(f"Error writing news cache: {e}")
                
            return news_list

    except Exception as e:
        print(f"Error loading news from Supabase: {e}. Falling back to local cache.")
        
    return local_news

def save_news(news_list):
    # Save to local JSON first
    json_file = NEWS_JSON
    local_saved = False
    try:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(news_list, f, indent=4, ensure_ascii=False)
        local_saved = True
    except Exception as e:
        print(f"Error saving news locally: {e}")

    # Save to Supabase
    if supabase_client:
        try:
            # 1. Upsert all current news
            for article in news_list:
                db_data = {
                    "id": article.get("id"),
                    "title": article.get("title"),
                    "date": article.get("date"),
                    "category": article.get("category"),
                    "image": article.get("image"),
                    "content": article.get("content")
                }
                supabase_client.table("news_sdn_bobong").upsert(db_data).execute()

            # 2. Deletion sync: delete any news in Supabase that are not in the new local list
            local_ids = {n.get("id") for n in news_list if n.get("id")}
            try:
                response = supabase_client.table("news_sdn_bobong").select("id").execute()
                supabase_ids = {row.get("id") for row in response.data} if response.data else set()
                ids_to_delete = supabase_ids - local_ids
                for delete_id in ids_to_delete:
                    if delete_id:
                        supabase_client.table("news_sdn_bobong").delete().eq("id", delete_id).execute()
            except Exception as e:
                print(f"Error during news deletion sync on Supabase: {e}")

        except Exception as e:
            print(f"Error saving news to Supabase: {e}")
            
    return local_saved

def load_teachers():
    # 1. Load local teachers first as a fallback/seed candidate
    local_teachers = []
    if os.path.exists(TEACHERS_JSON):
        try:
            with open(TEACHERS_JSON, 'r', encoding='utf-8') as f:
                local_teachers = json.load(f)
        except Exception as e:
            print(f"Error loading local teachers: {e}")

    if not supabase_client:
        return local_teachers

    try:
        # Load from Supabase
        response = supabase_client.table("teachers_sdn_bobong").select("*").execute()
        supabase_teachers = response.data
        
        # If Supabase is empty, seed from local JSON
        if not supabase_teachers and local_teachers:
            print("Supabase teachers table is empty. Seeding from local JSON...")
            for teacher in local_teachers:
                db_data = {
                    "id": teacher.get("id"),
                    "name": teacher.get("name"),
                    "role": teacher.get("role"),
                    "details": teacher.get("details"),
                    "status": teacher.get("status"),
                    "image": teacher.get("image")
                }
                try:
                    supabase_client.table("teachers_sdn_bobong").insert(db_data).execute()
                except Exception as e:
                    print(f"Failed to seed teacher {teacher.get('id')}: {e}")
            # Re-fetch after seeding
            try:
                response = supabase_client.table("teachers_sdn_bobong").select("*").execute()
                supabase_teachers = response.data
            except Exception:
                pass

        if supabase_teachers:
            teachers_list = []
            for t in supabase_teachers:
                teachers_list.append({
                    "id": t.get("id"),
                    "name": t.get("name"),
                    "role": t.get("role"),
                    "details": t.get("details"),
                    "status": t.get("status"),
                    "image": t.get("image")
                })
            
            # Keep order consistent (Kepala Sekolah first, then TU, or keep original order)
            def get_teacher_sort_key(item):
                role = item.get("role", "").lower()
                if "kepala sekolah" in role:
                    return 0
                if "tata usaha" in role or "tu" in role:
                    return 1
                numeric_part = re.findall(r'\d+', item.get("id", "9999"))
                if numeric_part:
                    return 10 + int(numeric_part[0])
                return 1000

            teachers_list.sort(key=get_teacher_sort_key)

            # Save to local JSON cache
            try:
                with open(TEACHERS_JSON, 'w', encoding='utf-8') as f:
                    json.dump(teachers_list, f, indent=4, ensure_ascii=False)
            except Exception as e:
                print(f"Error writing teachers cache: {e}")
                
            return teachers_list

    except Exception as e:
        print(f"Error loading teachers from Supabase: {e}. Falling back to local cache.")
        
    return local_teachers

def save_teachers(teachers):
    # Save to local JSON first
    json_file = TEACHERS_JSON
    local_saved = False
    try:
        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump(teachers, f, indent=4, ensure_ascii=False)
        local_saved = True
    except Exception as e:
        print(f"Error saving teachers locally: {e}")

    # Save to Supabase
    if supabase_client:
        try:
            # 1. Upsert all current teachers
            for teacher in teachers:
                db_data = {
                    "id": teacher.get("id"),
                    "name": teacher.get("name"),
                    "role": teacher.get("role"),
                    "details": teacher.get("details"),
                    "status": teacher.get("status"),
                    "image": teacher.get("image")
                }
                supabase_client.table("teachers_sdn_bobong").upsert(db_data).execute()

            # 2. Deletion sync: delete any teachers in Supabase that are not in the new local list
            local_ids = {t.get("id") for t in teachers if t.get("id")}
            try:
                response = supabase_client.table("teachers_sdn_bobong").select("id").execute()
                supabase_ids = {row.get("id") for row in response.data} if response.data else set()
                ids_to_delete = supabase_ids - local_ids
                for delete_id in ids_to_delete:
                    if delete_id:
                        supabase_client.table("teachers_sdn_bobong").delete().eq("id", delete_id).execute()
            except Exception as e:
                print(f"Error during teachers deletion sync on Supabase: {e}")

        except Exception as e:
            print(f"Error saving teachers to Supabase: {e}")
            
    return local_saved


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
    local_records = []
    
    # 1. Read local records
    if os.path.exists(json_file):
        try:
            with open(json_file, 'r', encoding='utf-8') as f:
                local_records = json.load(f)
        except Exception as e:
            print(f"Error reading local file: {e}")
            
    # Normalize local records into a dictionary indexed by NIK
    local_by_nik = {}
    for r in local_records:
        nik = str(r.get("nik") or r.get("nik_siswa") or "").strip()
        if nik:
            local_by_nik[nik] = r

    try:
        # 2. Fetch all records from Supabase
        response = supabase_client.table("ppdb_sdn_bobong").select("*").execute()
        supabase_records = response.data or []
        
        supabase_by_nik = {}
        for r in supabase_records:
            nik = str(r.get("nik_siswa") or r.get("nik") or "").strip()
            if nik:
                supabase_by_nik[nik] = r

        # 3. Perform two-way synchronization
        synced_to_supabase_count = 0
        
        # A. Sync from Local to Supabase (Insert missing local records to Supabase)
        for nik, local_r in local_by_nik.items():
            if nik not in supabase_by_nik:
                # Sync new local record to Supabase
                supabase_data = {
                    "nama_lengkap": local_r.get("nama_lengkap", ""),
                    "nik_siswa": nik,
                    "tempat_lahir": local_r.get("tempat_lahir", ""),
                    "tanggal_lahir": local_r.get("tanggal_lahir", ""),
                    "jenis_kelamin": local_r.get("jenis_kelamin", ""),
                    "nama_ibu_kandung": local_r.get("nama_ibu") or local_r.get("nama_ibu_kandung", ""),
                    "alamat_domisili": local_r.get("alamat") or local_r.get("alamat_domisili", ""),
                    "nomor_hp_orangtua": local_r.get("no_hp") or local_r.get("nomor_hp_orangtua", ""),
                    "jalur_ppdb": local_r.get("jalur_ppdb", "Zonasi"),
                    "waktu_daftar": local_r.get("waktu_daftar", datetime.now().strftime("%Y-%m-%d %H:%M:%S")),
                    "status": local_r.get("status", "Diterima Sistem")
                }
                try:
                    supabase_client.table("ppdb_sdn_bobong").insert(supabase_data).execute()
                    synced_to_supabase_count += 1
                except Exception as e:
                    # Retry without status column in case of schema discrepancy
                    if "status" in supabase_data:
                        del supabase_data["status"]
                    try:
                        supabase_client.table("ppdb_sdn_bobong").insert(supabase_data).execute()
                        synced_to_supabase_count += 1
                    except Exception as e2:
                        print(f"Failed syncing local record NIK {nik} to Supabase: {e2}")
            else:
                # Resolve status discrepancies
                supabase_r = supabase_by_nik[nik]
                local_status = local_r.get("status")
                supabase_status = supabase_r.get("status")
                
                if local_status != supabase_status:
                    # If local has been updated by admin to a terminal status, update Supabase
                    if local_status in ["Terverifikasi", "Ditolak"] and supabase_status not in ["Terverifikasi", "Ditolak"]:
                        try:
                            supabase_client.table("ppdb_sdn_bobong").update({"status": local_status}).eq("nik_siswa", nik).execute()
                        except Exception as e:
                            print(f"Error updating status in Supabase for NIK {nik}: {e}")
                    # If Supabase has been updated, propagate to local
                    elif supabase_status in ["Terverifikasi", "Ditolak"] and local_status not in ["Terverifikasi", "Ditolak"]:
                        local_r["status"] = supabase_status

        # B. Sync from Supabase to Local (Pull missing Supabase records or updates down to Local)
        for nik, supabase_r in supabase_by_nik.items():
            local_format = {
                "id": str(supabase_r.get("id")),
                "nama_lengkap": supabase_r.get("nama_lengkap", ""),
                "nik": nik,
                "tempat_lahir": supabase_r.get("tempat_lahir", ""),
                "tanggal_lahir": supabase_r.get("tanggal_lahir", ""),
                "jenis_kelamin": supabase_r.get("jenis_kelamin", ""),
                "nama_ibu": supabase_r.get("nama_ibu_kandung", ""),
                "no_hp": supabase_r.get("nomor_hp_orangtua", ""),
                "alamat": supabase_r.get("alamat_domisili", ""),
                "jalur_ppdb": supabase_r.get("jalur_ppdb", "Zonasi"),
                "waktu_daftar": supabase_r.get("waktu_daftar", ""),
                "status": supabase_r.get("status", "Diterima Sistem")
            }
            # Normalize waktu_daftar format to strip timezone offset
            if local_format["waktu_daftar"] and 'T' in local_format["waktu_daftar"]:
                try:
                    clean_time = local_format["waktu_daftar"].replace('T', ' ').split('+')[0].split('.')[0]
                    local_format["waktu_daftar"] = clean_time
                except Exception:
                    pass
            
            if nik in local_by_nik:
                # Merge local data with Supabase data, preserving admin-updated terminal status
                existing_local = local_by_nik[nik]
                if existing_local.get("status") in ["Terverifikasi", "Ditolak"]:
                    local_format["status"] = existing_local["status"]
                local_by_nik[nik] = local_format
            else:
                local_by_nik[nik] = local_format

        # Write merged records back to local JSON
        merged_records = list(local_by_nik.values())
        merged_records.sort(key=lambda x: x.get("waktu_daftar") or "", reverse=True)
        
        try:
            with open(json_file, 'w', encoding='utf-8') as f:
                json.dump(merged_records, f, indent=4, ensure_ascii=False)
            if synced_to_supabase_count > 0:
                print(f"Sync: {synced_to_supabase_count} local records uploaded to Supabase.")
        except Exception as e:
            print(f"Error saving merged records locally: {e}")

    except Exception as e:
        print(f"Error during Supabase sync check: {e}")
