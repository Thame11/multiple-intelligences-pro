import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { intelligenceTypes, intelligences, type IntelligenceType } from "@/lib/intelligences";
import type { IntelligenceScore } from "@/lib/scoring";

export const runtime = "nodejs";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  const results = await prisma.result.findMany({
    include: { student: true },
    orderBy: { createdAt: "desc" },
  });

  const rows = results.map((result, index) => {
    const top3 = JSON.parse(result.top3Json) as IntelligenceScore[];
    const scores = JSON.parse(result.scoresJson) as IntelligenceScore[];
    const scoreMap = Object.fromEntries(scores.map((s) => [s.key, s.percentage])) as Record<IntelligenceType, number>;

    return {
      "م": index + 1,
      "اسم الطالب": result.student.name,
      "رقم الهوية": result.student.nationalId ?? "",
      "الصف": result.student.grade ?? "",
      "المدرسة": result.student.school ?? "",
      "الذكاء الأول": top3[0]?.name ?? "",
      "نسبة الذكاء الأول": top3[0]?.percentage ? `${top3[0].percentage}%` : "",
      "الذكاء الثاني": top3[1]?.name ?? "",
      "نسبة الذكاء الثاني": top3[1]?.percentage ? `${top3[1].percentage}%` : "",
      "الذكاء الثالث": top3[2]?.name ?? "",
      "نسبة الذكاء الثالث": top3[2]?.percentage ? `${top3[2].percentage}%` : "",
      ...Object.fromEntries(
        intelligenceTypes.map((key) => [`${intelligences[key].name} %`, `${scoreMap[key] ?? 0}%`])
      ),
      "تاريخ الاختبار": result.createdAt.toLocaleString("ar-SA"),
    };
  });

  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(rows);
  sheet["!cols"] = [
    { wch: 6 }, { wch: 26 }, { wch: 16 }, { wch: 14 }, { wch: 22 },
    { wch: 22 }, { wch: 18 }, { wch: 22 }, { wch: 18 }, { wch: 22 }, { wch: 18 },
    ...intelligenceTypes.map(() => ({ wch: 20 })),
    { wch: 24 },
  ];
  XLSX.utils.book_append_sheet(workbook, sheet, "نتائج الطلاب");

  const summaryRows = intelligenceTypes.map((key) => ({
    "الذكاء": intelligences[key].name,
    "عدد ظهوره كأعلى ذكاء": rows.filter((r) => r["الذكاء الأول"] === intelligences[key].name).length,
  }));
  const summarySheet = XLSX.utils.json_to_sheet(summaryRows);
  summarySheet["!cols"] = [{ wch: 28 }, { wch: 24 }];
  XLSX.utils.book_append_sheet(workbook, summarySheet, "ملخص");

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  const fileName = `multiple-intelligences-${new Date().toISOString().slice(0, 10)}.xlsx`;

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
