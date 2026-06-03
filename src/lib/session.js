import { SignJWT, jwtVerify } from 'jose';

const SECRET_KEY = process.env.FLASK_SECRET_KEY || 'f3a5e8c1b9d7a2f0e4b6c8d0a2f4b6c8';
const key = new TextEncoder().encode(SECRET_KEY);

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(key);
}

export async function decrypt(input) {
  if (!input) return null;
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
