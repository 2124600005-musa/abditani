import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET not set in environment! Using insecure default. SET THIS IN PRODUCTION.');
}
const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret-change-me');

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export async function createToken(admin: AdminUser) {
  return new SignJWT({ id: admin.id, email: admin.email, name: admin.name, role: admin.role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret);
}

export async function verifyToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as AdminUser;
  } catch {
    return null;
  }
}
