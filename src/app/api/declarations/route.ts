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
    prisma.declaration.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        fileName: true,
        format: true,
        recordCount: true,
        status: true,
        createdAt: true,
        xmlData: false,
      },
    }),
    prisma.declaration.count({ where: { userId: user.id } }),
  ]);

  // Check which declarations have XML data available
  const ids = declarations.map(d => d.id);
  const withXml = await prisma.declaration.findMany({
    where: { id: { in: ids }, xmlData: { not: null } },
    select: { id: true },
  });
  const xmlSet = new Set(withXml.map(d => d.id));

  const enriched = declarations.map(d => ({
    ...d,
    hasXml: xmlSet.has(d.id),
  }));

  return NextResponse.json({ declarations: enriched, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}
