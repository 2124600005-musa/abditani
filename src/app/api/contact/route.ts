import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

function sanitize(str: string | null): string {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Nama, email, dan pesan wajib diisi' }, { status: 400 });
    }
    await pool.query('INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)', [sanitize(name), sanitize(email), sanitize(phone), sanitize(subject), sanitize(message)]);
    return NextResponse.json({ message: 'Pesan berhasil dikirim' }, { status: 201 });
  } catch (err) { return NextResponse.json({ error: 'Gagal mengirim' }, { status: 500 }); }
}
