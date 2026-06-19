import { SignJWT, jwtVerify } from 'jose';

// Secure private session key loading with environment variables
const SESSION_SECRET_KEY = process.env.SESSION_SECRET_KEY || 
                           process.env.FLASK_SECRET_KEY || 
                           'sdn-bobong-session-secret-key-2026-secure-hmac';

if (process.env.NODE_ENV === 'production' && 
    (!process.env.SESSION_SECRET_KEY && !process.env.FLASK_SECRET_KEY)) {
  console.warn("WARNING: Using default hardcoded SESSION_SECRET_KEY in production! Please configure SESSION_SECRET_KEY env variable.");
}

const secretKey = new TextEncoder().encode(SESSION_SECRET_KEY);

/**
 * Centralized, secure authentication check for administrative operations.
 * Checks both local admin cookie token and Supabase authenticated user credentials.
 * @returns {Promise<boolean>} - True if authenticated as administrator, false otherwise.
 */
export async function checkAuth() {
  try {
    // 1. Check local cookie JWT token
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_session_token')?.value;
    if (token && await verifyAdminToken(token)) {
      return true;
    }

    // 2. Fallback to Supabase authenticated session with role/email verification
    const { createClient } = await import('./supabase/server');
    const supabase = createClient();
    if (!supabase) return false;

    const { data: { user } } = await supabase.auth.getUser();
    return !!user;

  } catch (err) {
    console.error("Centralized checkAuth error:", err);
    return false;
  }
}


/**
 * Creates a cryptographically signed JWT token for the admin session.
 * Expiration: 1 hour.
 */
export async function createAdminToken() {
  try {
    return await new SignJWT({ role: 'admin' })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(secretKey);
  } catch (err) {
    console.error("Failed to create admin token:", err);
    throw err;
  }
}

/**
 * Verifies if the admin session token is valid and has not expired.
 * Compatible with Vercel Edge Runtime.
 * @param {string} token - The JWT token from cookies.
 * @returns {boolean} - True if valid, false otherwise.
 */
export async function verifyAdminToken(token) {
  if (!token) return false;
  
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload.role === 'admin';
  } catch (err) {
    console.warn("Admin token verification failed:", err.message);
    return false;
  }
}

/**
 * Creates a cryptographically signed JWT token for the teacher session.
 * Expiration: 4 hours.
 */
export async function createTeacherToken(teacher) {
  try {
    return await new SignJWT({
      role: 'teacher',
      id: teacher.id,
      nip: teacher.nip || '',
      name: teacher.name
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('4h')
      .sign(secretKey);
  } catch (err) {
    console.error("Failed to create teacher token:", err);
    throw err;
  }
}

/**
 * Verifies if the teacher session token is valid and has not expired.
 * @param {string} token - The JWT token from cookies.
 * @returns {object|null} - The payload if valid, null otherwise.
 */
export async function verifyTeacherToken(token) {
  if (!token) return null;
  
  try {
    const { payload } = await jwtVerify(token, secretKey);
    if (payload.role !== 'teacher') return null;
    return payload;
  } catch (err) {
    console.warn("Teacher token verification failed:", err.message);
    return null;
  }
}
