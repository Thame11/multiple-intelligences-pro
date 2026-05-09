import { Award, BarChart3, Percent, Users } from "lucide-react";
import { AdminNav } from "@/components/AdminNav";
import { StatCard } from "@/components/StatCard";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { intelligenceTypes, intelligences, type IntelligenceType } from "@/lib/intelligences";
import type { IntelligenceScore } from "@/lib/scoring";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  await requireAdmin();

  const results = await prisma.result.findMany({ include: { student: true }, orderBy: { createdAt: "desc" } });
  const studentsCount = await prisma.student.count();

  const topDistribution: Record<IntelligenceType, number> = Object.fromEntries(
    intelligenceTypes.map((key) => [key, 0])
  ) as Record<IntelligenceType, number>;

  const averagePercentages = Object.fromEntries(
    intelligenceTypes.map((key) => [key, [] as number[]])
  ) as Record<IntelligenceType, number[]>;

  for (const result of results) {
    const top3 = JSON.parse(result.top3Json) as IntelligenceScore[];
    const scores = JSON.parse(result.scoresJson) as IntelligenceScore[];
    if (top3[0]) topDistribution[top3[0].key] += 1;
    for (const score of scores) averagePercentages[score.key].push(score.percentage);
  }

  const mostCommonKey = intelligenceTypes.reduce((best, key) => (topDistribution[key] > topDistribution[best] ? key : best), intelligenceTypes[0]);

  const averages = intelligenceTypes.map((key) => {
    const values = averagePercentages[key];
    const average = values.length ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
    return { key, average, name: intelligences[key].name, count: topDistribution[key] };
  }).sort((a, b) => b.average - a.average);

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <section className="mx-auto grid max-w-6xl gap-7">
        <AdminNav />

        <section>
          <p className="text-sm font-bold text-brand-700">صفحة التقارير</p>
          <h1 className="mt-2 text-4xl font-black text-ink">ملخص أداء اختبارات الذكاءات المتعددة</h1>
          <p className="mt-3 max-w-3xl text-base leading-8 text-slate-600">تعرض هذه الصفحة مؤشرات سريعة تساعد الإدارة على فهم حجم المستفيدين وأكثر أنماط الذكاء ظهورًا.</p>
        </section>

        <section className="grid gap-5 md:grid-cols-4">
          <StatCard title="عدد الطلاب" value={studentsCount} note="طالب مسجل" Icon={Users} />
          <StatCard title="عدد النتائج" value={results.length} note="اختبار مكتمل" Icon={BarChart3} />
          <StatCard title="الأكثر انتشارًا" value={intelligences[mostCommonKey].shortName} note={intelligences[mostCommonKey].name} Icon={Award} />
          <StatCard title="نسبة الإكمال" value="100%" note="للنتائج المحفوظة" Icon={Percent} />
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card-glass rounded-[2rem] p-6 md:p-8">
            <h2 className="text-2xl font-black text-ink">أكثر ذكاء انتشارًا كأعلى نتيجة</h2>
            <div className="mt-6 grid gap-3">
              {intelligenceTypes.map((key) => {
                const max = Math.max(...Object.values(topDistribution), 1);
                const width = Math.round((topDistribution[key] / max) * 100);
                return (
                  <div key={key} className="rounded-3xl bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
                      <span>{intelligences[key].icon} {intelligences[key].name}</span>
                      <span className="rounded-full bg-brand-50 px-3 py-1 text-brand-700">{topDistribution[key]}</span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-brand-700" style={{ width: `${width}%` }} /></div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-glass rounded-[2rem] p-6 md:p-8">
            <h2 className="text-2xl font-black text-ink">متوسط نسب الذكاءات</h2>
            <div className="mt-6 grid gap-3">
              {averages.map((item) => (
                <div key={item.key} className="rounded-3xl bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3 text-sm font-bold text-slate-700">
                    <span>{item.name}</span>
                    <span className="rounded-full bg-slate-50 px-3 py-1 text-ink">{item.average}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-l from-brand-700 to-brand-500" style={{ width: `${item.average}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
