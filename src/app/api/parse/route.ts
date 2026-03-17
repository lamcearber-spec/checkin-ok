import { NextRequest, NextResponse } from "next/server";
import { parseAttendanceCsv } from "@/lib/attendanceParser";
import { runAiFallback } from "@/lib/aiFallback";
import { getAuthUser } from "@/lib/auth";
import { checkUsageLimit, incrementAnonUsage } from "@/lib/usage";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    // Auth & usage check
    const user = await getAuthUser(request);
    const tier = user?.tier ?? "ANONYMOUS";
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const usage = await checkUsageLimit(user?.id ?? null, tier as any, ip);
    if (!usage.allowed) {
      return NextResponse.json(
        { error: "Usage limit reached. Please upgrade your plan.", usage },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const content = await file.text();

    if (!content.trim()) {
      return NextResponse.json({ error: "File is empty" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();

    if (!fileName.endsWith(".csv") && !fileName.endsWith(".txt")) {
      return NextResponse.json(
        { error: "Only CSV files are supported for server-side parsing. Please convert XLSX to CSV first." },
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

    // Record declaration in DB
    if (user) {
      await prisma.declaration.create({
        data: {
          userId: user.id,
          fileName: file.name,
          recordCount: result.validRows?.length ?? 0,
          status: "SUCCESS",
        },
      });
    } else {
      incrementAnonUsage(ip);
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Parse error:", err);
    return NextResponse.json(
      { error: `Failed to parse file: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
