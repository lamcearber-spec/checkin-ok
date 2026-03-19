import { NextRequest, NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const declaration = await prisma.declaration.findFirst({
    where: { id: params.id, userId: user.id },
  });

  if (!declaration) {
    return NextResponse.json({ error: 'Declaration not found' }, { status: 404 });
  }

  if (!declaration.xmlData) {
    return NextResponse.json({ error: 'No XML data available for this declaration' }, { status: 404 });
  }

  const baseName = declaration.fileName.replace(/\.[^.]+$/, '');

  return new NextResponse(declaration.xmlData, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Content-Disposition': `attachment; filename="${baseName}-nsso.xml"`,
    },
  });
}
