import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

// Simple in-memory rate limiter for contact form
const contactAttempts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 5; // max 5 messages per hour

function sanitize(str: string | null): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim()
    .slice(0, 2000); // Limit length
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = contactAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    contactAttempts.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const phone = typeof body.phone === 'string' ? body.phone.trim() : '';
    const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
    const message = typeof body.message === 'string' ? body.message.trim() : '';

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Nama, email, dan pesan wajib diisi' }, { status: 400 });
    }

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: 'Nama harus 2-100 karakter' }, { status: 400 });
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Format email tidak valid' }, { status: 400 });
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json({ error: 'Pesan harus 10-2000 karakter' }, { status: 400 });
    }

    // Rate limit per IP
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: 'Terlalu banyak pesan. Coba lagi dalam 1 jam.' }, { status: 429 });
    }

    await pool.query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)',
      [sanitize(name), sanitize(email), sanitize(phone), sanitize(subject), sanitize(message)]
    );

    console.log(`[CONTACT] New message from ${email} at ${new Date().toISOString()}`);
    return NextResponse.json({ message: 'Pesan berhasil dikirim' }, { status: 201 });
  } catch (err) {
    console.error('[CONTACT ERROR]', err);
    return NextResponse.json({ error: 'Gagal mengirim pesan' }, { status: 500 });
  }
}
