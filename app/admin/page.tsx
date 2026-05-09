import Link from "next/link";
import { Award, BarChart3, Download, Table2, Users } from "lucide-react";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { intelligenceTypes, intelligences, type IntelligenceType } from "@/lib/intelligences";
import type { IntelligenceScore } from "@/lib/scoring";
import { AdminNav } from "@/components/AdminNav";
import { StatCard } from "@/components/StatCard";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [studentCount, results] = await Promise.all([
    prisma.student.count(),
    prisma.result.findMany({ include: { student: true }, orderBy: { createdAt: "desc" } }),
  ]);

  const distribution: Record<IntelligenceType, number> = Object.fromEntries(
    intelligenceTypes.map((key) => [key, 0])
  ) as Record<IntelligenceType, number>;

  for (const result of results) {
    const top3 = JSON.parse(result.top3Json) as IntelligenceScore[];
    const first = top3[0]?.key;
    if (first) distribution[first] += 1;
  }

  const mostCommonKey = intelligenceTypes.reduce((best, key) => (distribution[key] > distribution[best] ? key : best), intelligenceTypes[0]);
  const latest = results.slice(0, 6);

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <section className="mx-auto grid max-w-6xl gap-7">
        <AdminNav />

        <section className="grid gap-5 md:grid-cols-3">
          <StatCard title="عدد الطلاب" value={studentCount} note="إجمالي الطلاب المسجلين" Icon={Users} />
          <StatCard title="عدد الاختبارات" value={results.length} note="كل نتيجة محفوظة" Icon={Table2} />
          <StatCard title="الأكثر انتشارًا" value={intelligences[mostCommonKey].shortName} note={`${distribution[mostCommonKey]} طالب`} Icon={Award} />
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="card-glass rounded-[2rem] p-6 md:p-8">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-brand-700">آخر النتائج</p>
                <h2 className="text-2xl font-black text-ink">أحدث الطلاب المختبرين</h2>
              </div>
              <Link href="/admin/results" className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-brand-700 shadow-sm">عرض الكل</Link>
            </div>

            <div className="grid gap-3">
              {latest.length === 0 ? (
                <p className="rounded-3xl bg-white p-5 text-sm font-bold text-slate-500">لا توجد نتائج حتى الآن.</p>
              ) : latest.map((result) => {
                const top3 = JSON.parse(result.top3Json) as IntelligenceScore[];
                return (
                  <Link key={result.id} href={`/results/${result.id}`} className="grid gap-3 rounded-3xl bg-white p-4 shadow-sm transition hover:translate-y-[-2px] md:grid-cols-[1fr_auto] md:items-center">
                    <div>
                      <p className="font-black text-ink">{result.student.name}</p>
                      <p className="mt-1 text-sm font-bold text-slate-500">{result.student.grade ?? "بدون صف"} • {result.createdAt.toLocaleDateString("ar-SA")}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {top3.map((item) => (
                        <span key={item.key} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-black text-brand-700">{item.shortName} {item.percentage}%</span>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <aside className="grid gap-6">
            <div className="card-glass rounded-[2rem] p-6 md:p-8">
              <div className="mb-5 flex items-center gap-3">
                <BarChart3 className="h-6 w-6 text-brand-700" />
                <h2 className="text-2xl font-black text-ink">توزيع الذكاءات</h2>
              </div>
              <div className="grid gap-3">
                {intelligenceTypes.map((key) => {
                  const max = Math.max(...Object.values(distribution), 1);
                  const percentage = Math.round((distribution[key] / max) * 100);
                  return (
                    <div key={key} className="rounded-3xl bg-white p-4">
                      <div className="mb-2 flex justify-between text-sm font-bold"><span>{intelligences[key].name}</span><span>{distribution[key]}</span></div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-700" style={{ width: `${percentage}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>

            <a href="/api/admin/export" className="inline-flex items-center justify-center gap-2 rounded-[1.5rem] bg-ink px-6 py-5 text-lg font-black text-white shadow-soft transition hover:bg-brand-900">
              <Download className="h-5 w-5" /> تصدير Excel
            </a>
          </aside>
        </section>
      </section>
    </main>
  );
}
