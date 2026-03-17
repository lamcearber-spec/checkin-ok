import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
export async function GET(request: NextRequest) {
  const user = await getAuthUser(request);
  if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
  const skip = (page - 1) * limit;
  const [declarations, total] = await Promise.all([
    prisma.declaration.findMany({ where: { userId: user.id }, orderBy: { createdAt: 'desc' }, skip, take: limit }),
    prisma.declaration.count({ where: { userId: user.id } }),
  ]);
  return NextResponse.json({ declarations, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}
