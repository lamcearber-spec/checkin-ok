import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const subscription = await prisma.subscription.findUnique({ where: { userId: user.id }, select: { status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true } });
  return NextResponse.json({ user, subscription });
}
