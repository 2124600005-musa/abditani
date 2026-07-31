import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM commodities ORDER BY name');
    return NextResponse.json(result.rows);
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
