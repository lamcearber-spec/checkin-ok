import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
export async function POST(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const { priceId } = await request.json();
  if (!priceId) return NextResponse.json({ error: 'Price ID required' }, { status: 400 });
  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({ email: user.email, metadata: { userId: user.id } });
    stripeCustomerId = customer.id;
    await prisma.user.update({ where: { id: user.id }, data: { stripeCustomerId } });
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://checkin-ok.be';
  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId, mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancel`,
    metadata: { userId: user.id },
  });
  return NextResponse.json({ url: session.url });
}
