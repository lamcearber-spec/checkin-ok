import { Tier } from '@prisma/client';
import { prisma } from './prisma';

export const TIER_LIMITS: Record<string, { daily: number; monthly: number }> = {
  ANONYMOUS: { daily: 1, monthly: 999999 },
  FREE: { daily: 5, monthly: 50 },
  STARTER: { daily: 20, monthly: 200 },
  PROFESSIONAL: { daily: 999999, monthly: 999999 },
};

const anonUsage = new Map<string, { count: number; date: string }>();

export async function getDailyDeclarations(userId: string): Promise<number> {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return prisma.declaration.count({ where: { userId, createdAt: { gte: today } } });
}

export async function getMonthlyDeclarations(userId: string): Promise<number> {
  const firstOfMonth = new Date(); firstOfMonth.setDate(1); firstOfMonth.setHours(0, 0, 0, 0);
  return prisma.declaration.count({ where: { userId, createdAt: { gte: firstOfMonth } } });
}

export async function checkUsageLimit(userId: string | null, tier: Tier | 'ANONYMOUS', ip?: string) {
  const limits = TIER_LIMITS[tier] || TIER_LIMITS.FREE;
  if (!userId) {
    const key = ip || 'unknown';
    const today = new Date().toISOString().slice(0, 10);
    const entry = anonUsage.get(key);
    if (!entry || entry.date !== today) {
      anonUsage.set(key, { count: 0, date: today });
      return { allowed: true, daily: 0, monthly: 0, dailyLimit: limits.daily, monthlyLimit: limits.monthly };
    }
    return { allowed: entry.count < limits.daily, daily: entry.count, monthly: entry.count, dailyLimit: limits.daily, monthlyLimit: limits.monthly };
  }
  const daily = await getDailyDeclarations(userId);
  const monthly = await getMonthlyDeclarations(userId);
  return { allowed: daily < limits.daily && monthly < limits.monthly, daily, monthly, dailyLimit: limits.daily, monthlyLimit: limits.monthly };
}

export function incrementAnonUsage(ip: string) {
  const today = new Date().toISOString().slice(0, 10);
  const entry = anonUsage.get(ip);
  if (!entry || entry.date !== today) anonUsage.set(ip, { count: 1, date: today });
  else entry.count++;
}
