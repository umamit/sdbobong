# Auth.md - Agentic Registration Policy (SD Negeri Bobong)

This service supports agentic registration. Agents should follow this guide to authenticate.

## 1. Discover
To begin, fetch the Protected Resource Metadata (PRM) to understand the service requirements:
- **Discovery Path:** `/.well-known/oauth-protected-resource`
- **Authorization Server:** `https://www.sdnegeribobong.sch.id`
- **OIDC Metadata:** `/.well-known/openid-configuration`
- **API Catalog:** `/.well-known/api-catalog`

## 2. Register
Submit your chosen identity assertion to the registration endpoint.
- **Registration URI (Public PPDB):** `POST /api/ppdb`
- **Identity Types Supported:** `anonymous`
- **Action:** Submit student registration payload without credentials (public open access).
- **Administrative CMS access:** Dynamic Client Registration is disabled. No public agent registration is supported for admin dashboard.

## 3. Claim
User claim session for administrators:
- **Endpoint:** `POST /api/auth`
- **Process:** Secure credential validation via Supabase Auth database.

## 4. Exchange
Token exchange uses secure HttpOnly Cookie:
- **Grant Type:** `urn:ietf:params:oauth:grant-type:jwt-bearer` (Internal mapping only)
- **Result:** Issuance of secure `admin_session_token` or `teacher_session_token` cookies.

## 5. Revocation
Invalidate credentials and end sessions:
- **Endpoint:** `POST /api/auth?logout=true`
- **Process:** Automated deletion of session cookies.

---

*(Versi Bahasa Indonesia)*

Selamat datang, AI Agent. Dokumen ini menjelaskan kebijakan otentikasi dan akses API pada website resmi SD Negeri Bobong. Layanan pendaftaran siswa baru (PPDB Online) terbuka untuk umum tanpa memerlukan pendaftaran kunci API (Client Registration). AI Agent dapat langsung mengakses endpoint registrasi publik `POST /api/ppdb` dengan format payload sesuai berkas [SKILL.md](/agent-skills/ppdb-online/SKILL.md).
