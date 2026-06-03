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
    assert "Abdul Kadir" in r.text
    assert "Fatimah" in r.text
    assert "Husnita Usman" in r.text
    print("   [PASSED] Seed teachers loaded successfully on public /profil.")

    print("3. Testing adding a new teacher with photo file upload...")
    new_teacher_data = {
        "name": "Budi Hartono, M.Pd.",
        "role": "Guru Matematika & IPA",
        "details": "Pendidik Kelas Atas",
        "status": "PPPK",
        "image": "/images/teacher_3.svg"
    }
    # Mock PNG file upload
    mock_file = ('test_photo.png', b'dummy png data', 'image/png')
    
    r = session.post(
        f"{base_url}/admin/teachers/add", 
        data=new_teacher_data, 
        files={"photo": mock_file}, 
        allow_redirects=False
    )
    assert r.status_code == 302, f"Expected 302 redirect, got {r.status_code}"
    
    # Read teachers.json directly to check
    with open("teachers.json", "r", encoding="utf-8") as f:
        teachers = json.load(f)
    added_teacher = next((t for t in teachers if t["name"] == "Budi Hartono, M.Pd."), None)
    assert added_teacher is not None, "Teacher Budi Hartono was not found in teachers.json"
    assert added_teacher["role"] == "Guru Matematika & IPA"
    assert added_teacher["status"] == "PPPK"
    
    # The image path should start with local uploads fallback if Supabase bucket isn't configured
    image_path = added_teacher["image"]
    print(f"   Saved teacher photo path: {image_path}")
    assert image_path.startswith("/images/uploads/") or image_path.startswith("http"), "Expected upload path or Supabase URL"
    
    if image_path.startswith("/images/uploads/"):
        local_filepath = image_path.lstrip("/")
        assert os.path.exists(local_filepath), f"Uploaded file does not exist at {local_filepath}"
        print("   [PASSED] Local photo upload successfully saved to folder.")
        
    print("   [PASSED] Teacher added to teachers.json successfully.")

    # Check public page
    r = requests.get(f"{base_url}/profil")
    assert "Budi Hartono, M.Pd." in r.text, "Added teacher Budi Hartono not found on public page"
    print("   [PASSED] Added teacher rendered on public /profil page.")

    # Test editing the teacher with a new photo upload
    print("4. Testing editing the teacher with a new photo upload (Dynamic Bagan Organisasi verification)...")
    teacher_id = added_teacher["id"]
    edit_teacher_data = {
        "name": "Budi Hartono Agung, M.Pd.",
        "role": "Kepala Sekolah Baru",
        "details": "Pembina Tk. II / IV-c",
        "status": "PNS",
        "image": image_path # Keep old image if no new file, but we will send a new file
    }
    mock_file_edit = ('test_photo_edit.png', b'dummy png data edit', 'image/png')
    
    r = session.post(
        f"{base_url}/admin/teachers/edit/{teacher_id}", 
        data=edit_teacher_data, 
        files={"photo": mock_file_edit},
        allow_redirects=False
    )
    assert r.status_code == 302, f"Expected 302 redirect, got {r.status_code}"

    # Read teachers.json directly to check
    with open("teachers.json", "r", encoding="utf-8") as f:
        teachers = json.load(f)
    edited_teacher = next((t for t in teachers if t["id"] == teacher_id), None)
    assert edited_teacher is not None, "Teacher not found after edit"
    assert edited_teacher["name"] == "Budi Hartono Agung, M.Pd."
    assert edited_teacher["role"] == "Kepala Sekolah Baru"
    
    edited_image_path = edited_teacher["image"]
    print(f"   Saved edited photo path: {edited_image_path}")
    assert edited_image_path != image_path, "Expected image path to change after new file upload"
    
    if edited_image_path.startswith("/images/uploads/"):
        local_filepath = edited_image_path.lstrip("/")
        assert os.path.exists(local_filepath), f"Uploaded file does not exist at {local_filepath}"
        print("   [PASSED] Local edited photo upload successfully saved to folder.")
        
    print("   [PASSED] Teacher updated in teachers.json successfully.")

    # Check if the bagan organisasi on public /profil renders the new Kepala Sekolah
    r = requests.get(f"{base_url}/profil")
    assert "Budi Hartono Agung, M.Pd." in r.text, "Edited teacher name not found on public page"
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

    # Clean up uploaded files if local
    if image_path.startswith("/images/uploads/"):
        try:
            os.remove(image_path.lstrip("/"))
            os.remove(edited_image_path.lstrip("/"))
            print("   [PASSED] Uploaded test files cleaned up from local directory.")
        except Exception as e:
            print(f"   Note: Failed to clean up local test files: {e}")

    # Check public page
    r = requests.get(f"{base_url}/profil")
    assert "Budi Hartono Agung, M.Pd." not in r.text, "Deleted teacher still visible on public page"
    print("   [PASSED] Deleted teacher no longer visible on public /profil page.")

    print("\nALL TEACHERS UPLOAD & CRUD TEST CASES PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    try:
        test_teachers_flow()
    except AssertionError as e:
        print(f"Assertion failed: {e}")
        import sys
        sys.exit(1)
