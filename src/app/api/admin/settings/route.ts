import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

const DEFAULT_SETTINGS: Record<string, string> = {
  site_name: 'AbdiTani',
  tagline: 'Teknologi untuk Petani, Masa Depan untuk Negeri',
  email: '',
  phone: '',
  address: '',
  facebook: '',
  instagram: '',
  twitter: '',
  seo_title: 'AbdiTani - Solusi Digital Pertanian',
  seo_description: 'Platform digital pertanian Indonesia',
  seo_keywords: 'pertanian, digital, indonesia, abditani',
};

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '').trim();
}

export async function GET() {
  try {
    const result = await pool.query('SELECT key, value FROM settings');
    const dbSettings: Record<string, string> = {};
    for (const row of result.rows) {
      dbSettings[row.key] = row.value;
    }
    return NextResponse.json({ ...DEFAULT_SETTINGS, ...dbSettings });
  } catch {
    return NextResponse.json(DEFAULT_SETTINGS);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    if (typeof data !== 'object' || data === null) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    for (const [key, value] of Object.entries(data)) {
      const sanitized = typeof value === 'string' ? stripHtml(value) : String(value);
      await pool.query(
        'INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, CURRENT_TIMESTAMP) ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP',
        [key, sanitized]
      );
    }

    return NextResponse.json({ message: 'Pengaturan disimpan' });
  } catch (err) {
    console.error('Settings save error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan' }, { status: 500 });
  }
}
