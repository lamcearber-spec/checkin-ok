import { NextRequest, NextResponse } from 'next/server';
import { generateNssoXml } from '@/lib/xmlGenerator';
import { attendanceRecordSchema } from '@/schema/attendanceSchema';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { records } = body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: 'No records provided' }, { status: 400 });
    }

    // Validate records
    const parsed = z.array(attendanceRecordSchema).safeParse(records);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid record data', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { xml, errors } = generateNssoXml(parsed.data);

    if (!xml && errors.length > 0) {
      return NextResponse.json(
        { error: 'All records failed XSD validation', validationErrors: errors },
        { status: 422 }
      );
    }

    // Return XML as downloadable file
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Content-Disposition': 'attachment; filename="nsso-declarations.xml"',
      },
    });
  } catch (err) {
    console.error('XML generation error:', err);
    return NextResponse.json(
      { error: `XML generation failed: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
