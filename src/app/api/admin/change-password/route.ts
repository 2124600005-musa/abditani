import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { hashPassword, verifyPassword, verifyToken } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const admin = await verifyToken(token);
    if (!admin) return NextResponse.json({ error: 'Token invalid' }, { status: 401 });

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Password lama dan baru wajib diisi' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password baru minimal 6 karakter' }, { status: 400 });
    }

    // Get current password hash
    const result = await pool.query('SELECT password FROM admins WHERE id = $1', [admin.id]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Admin tidak ditemukan' }, { status: 404 });
    }

    // Verify current password
    const valid = await verifyPassword(currentPassword, result.rows[0].password);
    if (!valid) {
      return NextResponse.json({ error: 'Password lama salah' }, { status: 401 });
    }

    // Hash new password and update
    const newHash = await hashPassword(newPassword);
    await pool.query('UPDATE admins SET password = $1 WHERE id = $2', [newHash, admin.id]);

    console.log(`[AUTH] Password updated for ${admin.email} at ${new Date().toISOString()}`);
    return NextResponse.json({ message: 'Password berhasil diubah' });
  } catch (err) {
    console.error('[AUTH] Password update error:', err);
    return NextResponse.json({ error: 'Gagal mengubah password' }, { status: 500 });
  }
}
