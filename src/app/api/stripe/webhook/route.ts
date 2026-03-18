import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  let event: Stripe.Event;
  try { event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET); }
  catch (err) { console.error('Webhook sig failed:', err); return NextResponse.json({ error: 'Invalid signature' }, { status: 400 }); }
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        if (!userId || !session.subscription) break;
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription;
        const tier = determineTier(subscription.items.data[0]?.price?.id);
        await prisma.subscription.upsert({
          where: { userId },
          create: { userId, stripeSubscriptionId: subscription.id, stripePriceId: subscription.items.data[0]?.price?.id || '', status: subscription.status, currentPeriodEnd: new Date((subscription as any).current_period_end * 1000) },
          update: { stripeSubscriptionId: subscription.id, stripePriceId: subscription.items.data[0]?.price?.id || '', status: subscription.status, currentPeriodEnd: new Date((subscription as any).current_period_end * 1000) },
        });
        await prisma.user.update({ where: { id: userId }, data: { tier } });
        break;
      }
      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        const dbSub = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: sub.id } });
        if (!dbSub) break;
        const tier = determineTier(sub.items.data[0]?.price?.id);
        await prisma.subscription.update({ where: { stripeSubscriptionId: sub.id }, data: { stripePriceId: sub.items.data[0]?.price?.id || '', status: sub.status, currentPeriodEnd: new Date((sub as any).current_period_end * 1000), cancelAtPeriodEnd: (sub as any).cancel_at_period_end } });
        await prisma.user.update({ where: { id: dbSub.userId }, data: { tier } });
        break;
      }
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        const dbSub = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: sub.id } });
        if (!dbSub) break;
        await prisma.subscription.delete({ where: { stripeSubscriptionId: sub.id } });
        await prisma.user.update({ where: { id: dbSub.userId }, data: { tier: 'FREE' } });
        break;
      }
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.warn('Payment failed for customer:', invoice.customer);
        break;
      }
    }
  } catch (error) { console.error('Webhook error:', error); return NextResponse.json({ error: 'Webhook failed' }, { status: 500 }); }
  return NextResponse.json({ received: true });
}

function determineTier(priceId: string | undefined): 'FREE' | 'STARTER' | 'PROFESSIONAL' | 'BUSINESS' | 'ENTERPRISE' {
  if (!priceId) return 'FREE';
  const starterPrices = [process.env.STRIPE_PRICE_STARTER_MONTHLY, process.env.STRIPE_PRICE_STARTER_YEARLY];
  const proPrices = [process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY, process.env.STRIPE_PRICE_PROFESSIONAL_YEARLY];
  if (starterPrices.includes(priceId)) return 'STARTER';
  if (proPrices.includes(priceId)) return 'PROFESSIONAL';
  const businessPrices = [process.env.STRIPE_PRICE_BUSINESS_MONTHLY, process.env.STRIPE_PRICE_BUSINESS_YEARLY];
  if (businessPrices.includes(priceId)) return 'BUSINESS';
  const enterprisePrices = [process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY, process.env.STRIPE_PRICE_ENTERPRISE_YEARLY];
  if (enterprisePrices.includes(priceId)) return 'ENTERPRISE';
  return 'FREE';
}
