import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, createToken } from '@/lib/auth';
import { serialize } from 'cookie';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/rateLimit';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`register:${ip}`, 3)) {
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }
    const { email, password, name, companyName, locale } = await request.json();
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    const passwordHash = await hashPassword(password);
    const verifyToken = crypto.randomBytes(32).toString('hex');
    const user = await prisma.user.create({
      data: { email: email.toLowerCase(), passwordHash, name: name || null, companyName: companyName || null, locale: locale || 'en', verifyToken },
    });
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://checkin-ok.be';
    sendEmail(user.email, 'Welcome to Checkin OK',
      `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0a1628;">Welcome to Checkin OK!</h2>
        <p>Your account has been created successfully.</p>
        <p>You can now automate your Belgian NSSO attendance declarations for Checkinatwork and CIAO compliance.</p>
        <p style="margin: 24px 0;"><a href="${appUrl}" style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Start Declaring</a></p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="color: #999; font-size: 12px;">Checkin OK — Belgian NSSO compliance made simple</p>
      </div>`
    ).catch((err) => console.error('[email] Welcome email failed:', err));
    const token = createToken(user.id);
    const cookie = serialize('auth-token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60 });
    const response = NextResponse.json({ user: { id: user.id, email: user.email, name: user.name, tier: user.tier } });
    response.headers.set('Set-Cookie', cookie);
    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
