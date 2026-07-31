import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM news WHERE status = $1 ORDER BY published_at DESC', ['published']);
    return NextResponse.json(result.rows);
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
