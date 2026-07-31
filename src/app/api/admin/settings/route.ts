import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const SETTINGS_FILE = join(process.cwd(), 'data', 'settings.json');

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

async function ensureDir() {
  const { mkdir } = await import('fs/promises');
  await mkdir(join(process.cwd(), 'data'), { recursive: true });
}

export async function GET() {
  try {
    const data = await readFile(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(data);
    // Merge with defaults so all keys are always present
    return NextResponse.json({ ...DEFAULT_SETTINGS, ...parsed });
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
    // Sanitize: strip HTML tags and trim whitespace from string values
    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = typeof value === 'string' ? stripHtml(value) : String(value);
    }
    await ensureDir();
    await writeFile(SETTINGS_FILE, JSON.stringify(sanitized, null, 2));
    return NextResponse.json({ message: 'Pengaturan disimpan' });
  } catch (err) {
    console.error('Settings save error:', err);
    return NextResponse.json({ error: 'Gagal menyimpan' }, { status: 500 });
  }
}
