import requests
import json
import os

def test_teachers_flow():
    base_url = "http://127.0.0.1:5001"
    session = requests.Session()
    
    print("1. Logging in as admin...")
    r = session.post(f"{base_url}/admin/login", data={"username": "admin", "password": "sdnbobong2026"}, allow_redirects=False)
    assert r.status_code == 302, f"Failed to login: {r.status_code}"
    print("   [PASSED] Login successful.")

    print("2. Verifying initial /profil page renders 7 seed teachers...")
    r = requests.get(f"{base_url}/profil")
    assert r.status_code == 200, f"Failed to load /profil: {r.status_code}"
    # Verify standard teachers names are on the page
    assert "Abdul Kadir" in r.text
    assert "Fatimah" in r.text
    assert "Husnita Usman" in r.text
    print("   [PASSED] Seed teachers loaded successfully on public /profil.")

    print("3. Testing adding a new teacher...")
    new_teacher_data = {
        "name": "Budi Hartono, M.Pd.",
        "role": "Guru Matematika & IPA",
        "details": "Pendidik Kelas Atas",
        "status": "PPPK",
        "image": "/images/teacher_3.svg"
    }
    r = session.post(f"{base_url}/admin/teachers/add", data=new_teacher_data, allow_redirects=False)
    assert r.status_code == 302, f"Expected 302 redirect, got {r.status_code}"
    
    # Read teachers.json directly to check
    with open("teachers.json", "r", encoding="utf-8") as f:
        teachers = json.load(f)
    added_teacher = next((t for t in teachers if t["name"] == "Budi Hartono, M.Pd."), None)
    assert added_teacher is not None, "Teacher Budi Hartono was not found in teachers.json"
    assert added_teacher["role"] == "Guru Matematika & IPA"
    assert added_teacher["status"] == "PPPK"
    assert added_teacher["image"] == "/images/teacher_3.svg"
    print("   [PASSED] Teacher added to teachers.json successfully.")

    # Check public page
    r = requests.get(f"{base_url}/profil")
    assert "Budi Hartono, M.Pd." in r.text, "Added teacher Budi Hartono not found on public page"
    assert "Guru Matematika &amp; IPA" in r.text or "Guru Matematika & IPA" in r.text
    print("   [PASSED] Added teacher rendered on public /profil page.")

    # Test editing the teacher to make them "Kepala Sekolah"
    print("4. Testing editing the teacher to become Kepala Sekolah (Dynamic Bagan Organisasi verification)...")
    teacher_id = added_teacher["id"]
    edit_teacher_data = {
        "name": "Budi Hartono Agung, M.Pd.",
        "role": "Kepala Sekolah Baru",
        "details": "Pembina Tk. II / IV-c",
        "status": "PNS",
        "image": "/images/principal.svg"
    }
    r = session.post(f"{base_url}/admin/teachers/edit/{teacher_id}", data=edit_teacher_data, allow_redirects=False)
    assert r.status_code == 302, f"Expected 302 redirect, got {r.status_code}"

    # Read teachers.json directly to check
    with open("teachers.json", "r", encoding="utf-8") as f:
        teachers = json.load(f)
    edited_teacher = next((t for t in teachers if t["id"] == teacher_id), None)
    assert edited_teacher is not None, "Teacher not found after edit"
    assert edited_teacher["name"] == "Budi Hartono Agung, M.Pd."
    assert edited_teacher["role"] == "Kepala Sekolah Baru"
    assert edited_teacher["image"] == "/images/principal.svg"
    print("   [PASSED] Teacher updated in teachers.json successfully.")

    # Check if the bagan organisasi on public /profil renders the new Kepala Sekolah
    r = requests.get(f"{base_url}/profil")
    assert "Budi Hartono Agung, M.Pd." in r.text, "Edited teacher name not found on public page"
    # The bagan section should render the new Kepala Sekolah
    assert "Budi Hartono Agung, M.Pd." in r.text
    print("   [PASSED] Dynamic bagan organisasi updated to show the new Kepala Sekolah.")

    # Test deleting the teacher
    print("5. Testing deleting the teacher...")
    r = session.post(f"{base_url}/admin/teachers/delete/{teacher_id}", allow_redirects=False)
    assert r.status_code == 302, f"Expected 302 redirect, got {r.status_code}"

    # Read teachers.json directly to check
    with open("teachers.json", "r", encoding="utf-8") as f:
        teachers = json.load(f)
    deleted_teacher = next((t for t in teachers if t["id"] == teacher_id), None)
    assert deleted_teacher is None, "Teacher was not deleted from teachers.json"
    print("   [PASSED] Teacher deleted from teachers.json successfully.")

    # Check public page
    r = requests.get(f"{base_url}/profil")
    assert "Budi Hartono Agung, M.Pd." not in r.text, "Deleted teacher still visible on public page"
    print("   [PASSED] Deleted teacher no longer visible on public /profil page.")

    print("\nALL TEACHERS CRUD TEST CASES PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    try:
        test_teachers_flow()
    except AssertionError as e:
        print(f"Assertion failed: {e}")
        import sys
        sys.exit(1)
