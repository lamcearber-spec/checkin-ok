import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import { checkRateLimit } from '@/lib/rateLimit';
import { sendEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!checkRateLimit(`forgot-password:${ip}`, 3)) return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (user) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);
      await prisma.user.update({ where: { id: user.id }, data: { resetToken, resetTokenExpiry } });
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://checkin-ok.be';
      const resetLink = `${appUrl}/auth?reset=${resetToken}`;
      await sendEmail(user.email, 'Checkin OK — Password Reset',
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0a1628;">Password Reset</h2>
          <p>You requested a password reset for your Checkin OK account.</p>
          <p>Click the link below to reset your password. This link expires in 1 hour.</p>
          <p style="margin: 24px 0;"><a href="${resetLink}" style="background: #16a34a; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Reset Password</a></p>
          <p style="color: #666; font-size: 14px;">If you did not request this, you can safely ignore this email.</p>
        </div>`);
    }
    return NextResponse.json({ message: 'If an account exists, a reset link has been sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
