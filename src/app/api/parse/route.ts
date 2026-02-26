import { NextRequest, NextResponse } from 'next/server';
import { parseAttendanceCsv } from '@/lib/attendanceParser';
import { runAiFallback } from '@/lib/aiFallback';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const content = await file.text();

    if (!content.trim()) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();

    // Only CSV supported server-side (XLSX would need a library like xlsx)
    if (!fileName.endsWith('.csv') && !fileName.endsWith('.txt')) {
      return NextResponse.json(
        { error: 'Only CSV files are supported for server-side parsing. Please convert XLSX to CSV first.' },
        { status: 400 }
      );
    }

    // Stage 1: Deterministic parsing
    const result = parseAttendanceCsv(content, file.name);

    // Stage 2: AI fallback for invalid rows
    if (result.invalidRows.length > 0) {
      const aiCorrections = await runAiFallback(result.invalidRows, undefined);
      result.aiCorrections = aiCorrections;
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('Parse error:', err);
    return NextResponse.json(
      { error: `Failed to parse file: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
