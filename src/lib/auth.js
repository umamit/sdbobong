/**
 * Helper to convert an ArrayBuffer to a Hexadecimal string.
 */
function arrayBufferToHex(buffer) {
  return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
}

/**
 * Signs a message with a secret using HMAC-SHA256 via Web Crypto APIs.
 */
async function signHmacSha256(message, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(message);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    messageData
  );
  
  return arrayBufferToHex(signature);
}

/**
 * Creates a cryptographically signed token for the admin session.
 * The payload contains the user's role and an expiration timestamp (2 hours).
 * Signed using standard Web Cryptography APIs.
 */
export async function createAdminToken() {
  const secret = process.env.FLASK_SECRET_KEY || 'sdn-bobong-default-secret-key-2026';
  const expiry = Date.now() + 1 * 60 * 60 * 1000; // 1 hour expiration
  const payload = JSON.stringify({ role: 'admin', expiry });
  
  const signature = await signHmacSha256(payload, secret);
  return btoa(`${payload}.${signature}`);
}

/**
 * Verifies if the admin session token is valid and has not expired.
 * Compatible with Vercel Edge Runtime.
 * @param {string} token - The base64-encoded token from cookies.
 * @returns {boolean} - True if valid, false otherwise.
 */
export async function verifyAdminToken(token) {
  if (!token) return false;
  
  try {
    const secret = process.env.FLASK_SECRET_KEY || 'sdn-bobong-default-secret-key-2026';
    const raw = atob(token);
    const parts = raw.split('.');
    
    if (parts.length !== 2) return false;
    
    const [payloadStr, signature] = parts;
    
    // Recalculate signature to verify integrity
    const expectedSignature = await signHmacSha256(payloadStr, secret);
      
    if (signature !== expectedSignature) {
      console.warn("Security: Admin token signature mismatch.");
      return false;
    }
    
    // Parse payload and check expiration
    const payload = JSON.parse(payloadStr);
    if (payload.role !== 'admin') return false;
    
    if (Date.now() > payload.expiry) {
      console.warn("Security: Admin token expired.");
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Token verification error:", err);
    return false;
  }
}

/**
 * Creates a cryptographically signed token for the teacher session.
 * The payload contains the teacher's id, name, NIP, and expiration (4 hours).
 */
export async function createTeacherToken(teacher) {
  const secret = process.env.FLASK_SECRET_KEY || 'sdn-bobong-default-secret-key-2026';
  const expiry = Date.now() + 4 * 60 * 60 * 1000; // 4 hours expiration
  const payload = JSON.stringify({
    role: 'teacher',
    id: teacher.id,
    nip: teacher.nip || '',
    name: teacher.name,
    expiry
  });
  
  const signature = await signHmacSha256(payload, secret);
  return btoa(`${payload}.${signature}`);
}

/**
 * Verifies if the teacher session token is valid and has not expired.
 * @param {string} token - The base64-encoded token from cookies.
 * @returns {object|null} - The payload if valid, null otherwise.
 */
export async function verifyTeacherToken(token) {
  if (!token) return null;
  
  try {
    const secret = process.env.FLASK_SECRET_KEY || 'sdn-bobong-default-secret-key-2026';
    const raw = atob(token);
    const parts = raw.split('.');
    
    if (parts.length !== 2) return null;
    
    const [payloadStr, signature] = parts;
    const expectedSignature = await signHmacSha256(payloadStr, secret);
      
    if (signature !== expectedSignature) {
      console.warn("Security: Teacher token signature mismatch.");
      return null;
    }
    
    const payload = JSON.parse(payloadStr);
    if (payload.role !== 'teacher') return null;
    
    if (Date.now() > payload.expiry) {
      console.warn("Security: Teacher token expired.");
      return null;
    }
    
    return payload;
  } catch (err) {
    console.error("Teacher token verification error:", err);
    return null;
  }
}

