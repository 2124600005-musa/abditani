import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query('UPDATE contact_messages SET status = $1 WHERE id = $2', ['read', id]);
    return NextResponse.json({ message: 'OK' });
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await pool.query('DELETE FROM contact_messages WHERE id = $1', [id]);
    return NextResponse.json({ message: 'OK' });
  } catch (err) { return NextResponse.json({ error: 'Gagal' }, { status: 500 }); }
}
