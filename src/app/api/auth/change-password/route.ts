import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, verifyPassword, hashPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { checkRateLimit } from '@/lib/rateLimit';
export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`change-pw:${ip}`, 5)) return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    const { currentPassword, newPassword } = await request.json();
    if (!currentPassword || !newPassword) return NextResponse.json({ error: 'Current and new password required' }, { status: 400 });
    if (newPassword.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!fullUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const valid = await verifyPassword(currentPassword, fullUser.passwordHash);
    if (!valid) return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    const newHash = await hashPassword(newPassword);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: newHash } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
