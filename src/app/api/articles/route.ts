import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    let q = 'SELECT * FROM articles WHERE status = $1';
    const params: unknown[] = ['published'];
    let idx = 2;
    if (search) { q += ` AND (title ILIKE $${idx} OR excerpt ILIKE $${idx})`; params.push(`%${search}%`); idx++; }
    if (category) { q += ` AND category = $${idx}`; params.push(category); idx++; }
    q += ' ORDER BY created_at DESC';
    const result = await pool.query(q, params);
    return NextResponse.json(result.rows);
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
