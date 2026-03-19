import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Retention policy: delete declaration records older than 90 days
// This endpoint should be called by a cron job (e.g. daily via external scheduler)
const RETENTION_DAYS = 90;

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);

  const result = await prisma.declaration.deleteMany({
    where: {
      createdAt: {
        lt: cutoff,
      },
    },
  });

  return NextResponse.json({
    deleted: result.count,
    cutoff: cutoff.toISOString(),
    retentionDays: RETENTION_DAYS,
  });
}
