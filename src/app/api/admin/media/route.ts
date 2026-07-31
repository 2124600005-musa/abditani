import { NextRequest, NextResponse } from 'next/server';
import { list, del } from '@vercel/blob';

export async function GET() {
  try {
    const { blobs } = await list({ limit: 1000 });
    return NextResponse.json(blobs);
  } catch (err) {
    console.error('Media list error:', err);
    return NextResponse.json({ error: 'Gagal memuat media' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: 'URL wajib' }, { status: 400 });
    await del(url);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Media delete error:', err);
    return NextResponse.json({ error: 'Gagal menghapus media' }, { status: 500 });
  }
}
