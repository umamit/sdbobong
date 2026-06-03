import os
from flask import Flask, render_template, request, redirect, url_for, flash
from dotenv import load_dotenv
from supabase import create_client, Client

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
            "jalur_ppdb": jalur_ppdb
        }

        # Database insertion / Fallback to local storage
        if not supabase_client:
            # Fallback to local JSON storage for development/testing
            import json
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

        try:
            response = supabase_client.table("ppdb_sdn_bobong").insert(data).execute()
            
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
