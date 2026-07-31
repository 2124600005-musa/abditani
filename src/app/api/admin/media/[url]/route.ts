import { NextRequest, NextResponse } from 'next/server';
import { del } from '@vercel/blob';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ url: string }> }
) {
  try {
    const { url } = await params;
    const decodedUrl = decodeURIComponent(url);
    await del(decodedUrl);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Media delete error:', err);
    return NextResponse.json({ error: 'Gagal menghapus media' }, { status: 500 });
  }
}
