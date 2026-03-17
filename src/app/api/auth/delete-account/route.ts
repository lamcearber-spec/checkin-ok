import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser, verifyPassword } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { serialize } from 'cookie';
export async function POST(request: NextRequest) {
  try {
    const user = await getAuthUser(request);
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    const { password } = await request.json();
    if (!password) return NextResponse.json({ error: 'Password required for account deletion' }, { status: 400 });
    const fullUser = await prisma.user.findUnique({ where: { id: user.id } });
    if (!fullUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    const valid = await verifyPassword(password, fullUser.passwordHash);
    if (!valid) return NextResponse.json({ error: 'Password is incorrect' }, { status: 401 });
    if (user.stripeCustomerId) {
      try {
        const subscriptions = await stripe.subscriptions.list({ customer: user.stripeCustomerId, status: 'active' });
        for (const sub of subscriptions.data) await stripe.subscriptions.cancel(sub.id);
      } catch (e) { console.error('Failed to cancel Stripe subscription:', e); }
    }
    await prisma.declaration.deleteMany({ where: { userId: user.id } });
    await prisma.subscription.deleteMany({ where: { userId: user.id } });
    await prisma.user.delete({ where: { id: user.id } });
    const cookie = serialize('auth-token', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 });
    const response = NextResponse.json({ success: true });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
