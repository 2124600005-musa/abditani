import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function sanitizeFilename(name: string): string {
  return name
    .replace(/[\/\\]/g, '')           // Remove path separators
    .replace(/\.\./g, '')                // Remove path traversal
    .replace(/[^a-zA-Z0-9.\-]/g, '-')  // Safe chars only
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
    .slice(0, 100);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: 'Tidak ada file' }, { status: 400 });
    }

    if (!type || !['products', 'articles', 'news', 'technologies', 'media'].includes(type)) {
      return NextResponse.json({ error: 'Tipe tidak valid' }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Format harus JPG, JPEG, PNG, atau WebP' }, { status: 400 });
    }

    // Validate extension
    const originalName = file.name || 'upload.jpg';
    const ext = originalName.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: 'Ekstensi file tidak diizinkan' }, { status: 400 });
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Ukuran maksimal 5MB' }, { status: 400 });
    }

    // Validate file is not empty
    if (file.size === 0) {
      return NextResponse.json({ error: 'File kosong' }, { status: 400 });
    }

    // Sanitize and generate safe filename
    const safeExt = ALLOWED_EXTENSIONS.includes(ext) ? ext : 'jpg';
    const prefix = type.slice(0, 4);
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const filename = `${prefix}-${timestamp}-${random}.${safeExt}`;

    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type,
    });

    console.log(`[UPLOAD] ${new Date().toISOString()} | type=${type} | file=${filename} | size=${file.size} | mime=${file.type}`);

    return NextResponse.json({
      path: blob.url,
      filename,
      size: file.size,
      type: file.type,
    });
  } catch (err) {
    console.error('[UPLOAD ERROR]', err);
    return NextResponse.json({ error: 'Upload gagal' }, { status: 500 });
  }
}
