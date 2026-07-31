import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const SETTINGS_FILE = join(process.cwd(), 'data', 'settings.json');

async function ensureDir() {
  const { mkdir } = await import('fs/promises');
  await mkdir(join(process.cwd(), 'data'), { recursive: true });
}

export async function GET() {
  try {
    const data = await readFile(SETTINGS_FILE, 'utf-8');
    return NextResponse.json(JSON.parse(data));
  } catch {
    return NextResponse.json({
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
    });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    await ensureDir();
    await writeFile(SETTINGS_FILE, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: 'Pengaturan disimpan' });
  } catch (err) { return NextResponse.json({ error: 'Gagal menyimpan' }, { status: 500 }); }
}
