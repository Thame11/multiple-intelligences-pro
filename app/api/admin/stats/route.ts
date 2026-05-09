import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { intelligenceTypes, intelligences, type IntelligenceType } from "@/lib/intelligences";
import type { IntelligenceScore } from "@/lib/scoring";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const [students, results] = await Promise.all([
    prisma.student.count(),
    prisma.result.findMany({ orderBy: { createdAt: "desc" }, include: { student: true } }),
  ]);

  const distribution: Record<IntelligenceType, number> = Object.fromEntries(
    intelligenceTypes.map((key) => [key, 0])
  ) as Record<IntelligenceType, number>;

  for (const result of results) {
    const top3 = JSON.parse(result.top3Json) as IntelligenceScore[];
    const first = top3[0]?.key;
    if (first) distribution[first] += 1;
  }

  const mostCommonKey = [...intelligenceTypes].sort((a, b) => distribution[b] - distribution[a])[0];

  return NextResponse.json({
    students,
    assessments: results.length,
    mostCommon: {
      key: mostCommonKey,
      name: intelligences[mostCommonKey].name,
      count: distribution[mostCommonKey],
    },
    distribution: intelligenceTypes.map((key) => ({
      key,
      name: intelligences[key].name,
      count: distribution[key],
    })),
    latest: results.slice(0, 8).map((result) => ({
      id: result.id,
      studentName: result.student.name,
      grade: result.student.grade,
      createdAt: result.createdAt,
      top3: JSON.parse(result.top3Json),
    })),
  });
}
