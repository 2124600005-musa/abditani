import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import slugify from 'slugify';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM commodities ORDER BY name');
    return NextResponse.json(result.rows);
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.name) return NextResponse.json({ error: 'Nama wajib' }, { status: 400 });
    if (!data.slug) data.slug = slugify(data.name, { lower: true, strict: true });
    const result = await pool.query('INSERT INTO commodities (name,slug,icon,price,previous_price,unit,region,change_pct) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id', [data.name, data.slug, data.icon, data.price || 0, data.previous_price || 0, data.unit || 'kg', data.region || 'Nasional', data.change_pct || 0]);
    return NextResponse.json({ id: result.rows[0].id }, { status: 201 });
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
