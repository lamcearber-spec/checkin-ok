import { NextRequest, NextResponse } from "next/server";
import { generateNssoXml } from "@/lib/xmlGenerator";
import { attendanceRecordSchema } from "@/schema/attendanceSchema";
import { z } from "zod";
import { getAuthUser } from "@/lib/auth";
import { checkUsageLimit } from "@/lib/usage";
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

    const body = await request.json();
    const { records } = body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return NextResponse.json({ error: "No records provided" }, { status: 400 });
    }

    // Validate records
    const parsed = z.array(attendanceRecordSchema).safeParse(records);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid record data", details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { xml, errors } = generateNssoXml(parsed.data);

    if (!xml && errors.length > 0) {
      return NextResponse.json(
        { error: "All records failed XSD validation", validationErrors: errors },
        { status: 422 }
      );
    }

    // Save XML to the user's most recent declaration
    if (user && xml) {
      const latestDeclaration = await prisma.declaration.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
      });
      if (latestDeclaration) {
        await prisma.declaration.update({
          where: { id: latestDeclaration.id },
          data: { xmlData: xml },
        });
      }
    }

    // Return XML as downloadable file
    return new NextResponse(xml, {
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Content-Disposition": "attachment; filename=\"nsso-declarations.xml\"",
      },
    });
  } catch (err) {
    console.error("XML generation error:", err);
    return NextResponse.json(
      { error: `XML generation failed: ${err instanceof Error ? err.message : "Unknown error"}` },
      { status: 500 }
    );
  }
}
