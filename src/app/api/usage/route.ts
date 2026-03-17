import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { checkUsageLimit } from '@/lib/usage';
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const tier = user?.tier || 'ANONYMOUS';
  const usage = await checkUsageLimit(user?.id || null, tier as any, ip);
  return NextResponse.json({
    tier, used: tier === 'ANONYMOUS' || tier === 'FREE' ? usage.daily : usage.monthly,
    limit: tier === 'ANONYMOUS' || tier === 'FREE' ? usage.dailyLimit : usage.monthlyLimit,
    period: tier === 'ANONYMOUS' || tier === 'FREE' ? 'day' : 'month',
    daily: usage.daily, monthly: usage.monthly, dailyLimit: usage.dailyLimit, monthlyLimit: usage.monthlyLimit,
  });
}
