import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { IntelligenceScore } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function AdminResultsPage() {
  await requireAdmin();
  const results = await prisma.result.findMany({ include: { student: true }, orderBy: { createdAt: "desc" } });

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <section className="mx-auto grid max-w-6xl gap-7">
        <AdminNav />

        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-bold text-brand-700">إدارة النتائج</p>
            <h1 className="mt-2 text-4xl font-black text-ink">سجل اختبارات الطلاب</h1>
            <p className="mt-3 text-base leading-8 text-slate-600">استعراض سريع لكل نتيجة مع إمكانية فتح التقرير أو تصدير الملف.</p>
          </div>
          <a href="/api/admin/export" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-ink px-5 py-4 text-sm font-black text-white shadow-soft">
            <Download className="h-4 w-4" /> تصدير Excel
          </a>
        </section>

        <section className="card-glass overflow-hidden rounded-[2rem] p-2 md:p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] border-separate border-spacing-y-3 text-right">
              <thead>
                <tr className="text-sm text-slate-500">
                  <th className="px-4 py-2">الطالب</th>
                  <th className="px-4 py-2">الصف</th>
                  <th className="px-4 py-2">المدرسة</th>
                  <th className="px-4 py-2">أعلى 3 ذكاءات</th>
                  <th className="px-4 py-2">التاريخ</th>
                  <th className="px-4 py-2">الإجراء</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr><td colSpan={6} className="rounded-3xl bg-white px-4 py-8 text-center text-sm font-bold text-slate-500">لا توجد نتائج حتى الآن.</td></tr>
                ) : results.map((result) => {
                  const top3 = JSON.parse(result.top3Json) as IntelligenceScore[];
                  return (
                    <tr key={result.id} className="bg-white shadow-sm">
                      <td className="rounded-r-3xl px-4 py-4">
                        <p className="font-black text-ink">{result.student.name}</p>
                        <p className="mt-1 text-xs font-bold text-slate-500">{result.student.nationalId ?? "بدون رقم هوية"}</p>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-600">{result.student.grade ?? "-"}</td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-600">{result.student.school ?? "-"}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-2">
                          {top3.map((item) => (
                            <span key={item.key} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">{item.shortName} {item.percentage}%</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm font-bold text-slate-600">{result.createdAt.toLocaleDateString("ar-SA")}</td>
                      <td className="rounded-l-3xl px-4 py-4">
                        <Link href={`/results/${result.id}`} className="inline-flex items-center gap-2 rounded-2xl bg-slate-50 px-4 py-2 text-sm font-black text-ink transition hover:bg-brand-50 hover:text-brand-700">
                          <Eye className="h-4 w-4" /> فتح
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}
