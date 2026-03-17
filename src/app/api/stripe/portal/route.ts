import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  if (!user.stripeCustomerId) return NextResponse.json({ error: 'No billing account found' }, { status: 400 });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://checkin-ok.be';
  const session = await stripe.billingPortal.sessions.create({ customer: user.stripeCustomerId, return_url: `${appUrl}/settings` });
  return NextResponse.json({ url: session.url });
}
