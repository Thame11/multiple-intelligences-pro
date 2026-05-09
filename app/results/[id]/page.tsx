import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Award, BarChart3, Home } from "lucide-react";
import { prisma } from "@/lib/db";
import type { IntelligenceScore } from "@/lib/scoring";
import { LogoMark } from "@/components/LogoMark";
import { ScoreBar } from "@/components/ScoreBar";
import { PrintButton } from "@/components/PrintButton";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;
  const result = await prisma.result.findUnique({ where: { id }, include: { student: true } });
  if (!result) notFound();

  const top3 = JSON.parse(result.top3Json) as IntelligenceScore[];
  const scores = JSON.parse(result.scoresJson) as IntelligenceScore[];
  const topIntelligence = top3[0];

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 print-safe">
      <section className="mx-auto max-w-6xl grid gap-8">

        {/* Header */}
        <header className="card-glass rounded-[2rem] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <LogoMark />
            <div className="flex flex-wrap gap-3 print:hidden">
              <Link href="/" className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-brand-700 shadow-sm hover:bg-brand-50">
                <Home className="h-4 w-4" /> اختبار جديد
              </Link>
              <PrintButton />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-[1.5fr_0.8fr] md:items-end">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
                <Award className="h-4 w-4" /> تقرير نتيجة الطالب
              </p>
              <h1 className="mt-4 text-4xl font-black leading-tight text-ink md:text-6xl">
                {result.student.name}
              </h1>
              <p className="mt-3 text-base leading-8 text-slate-600">
                هذه النتيجة إرشادية تساعد على فهم ميول الطالب التعليمية، ولا تُستخدم وحدها كحكم نهائي على قدراته.
              </p>
            </div>
            <div className="rounded-3xl bg-white p-5 shadow-sm">
              <p className="text-sm font-bold text-slate-500">بيانات الاختبار</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">الصف</dt>
                  <dd className="font-black text-ink">{result.student.grade ?? "غير محدد"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">المدرسة</dt>
                  <dd className="font-black text-ink">{result.student.school ?? "غير محدد"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">التاريخ</dt>
                  <dd className="font-black text-ink">{result.createdAt.toLocaleDateString("ar-SA")}</dd>
                </div>
                {result.student.nationalId && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">رقم الهوية</dt>
                    <dd className="font-black text-ink">{result.student.nationalId}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        </header>

        {/* Top Intelligence Highlight Banner */}
        {topIntelligence && (
          <section className={`rounded-[2rem] bg-gradient-to-br ${topIntelligence.colorClass} p-6 md:p-8 text-white`}>
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-bold opacity-80">الذكاء الأبرز لديك</p>
                <h2 className="mt-2 text-3xl font-black md:text-5xl">{topIntelligence.icon} {topIntelligence.name}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 opacity-90">{topIntelligence.description}</p>
              </div>
              <div className="flex flex-col items-center justify-center rounded-3xl bg-white/20 p-6 text-center min-w-[120px]">
                <span className="text-5xl font-black">{topIntelligence.percentage}%</span>
                <span className="mt-1 text-sm font-bold opacity-90">نسبة الذكاء</span>
              </div>
            </div>
            <div className="mt-6">
              <p className="mb-2 text-sm font-bold opacity-80">أسلوب التعلم المفضل</p>
              <p className="text-sm leading-7 opacity-90">{topIntelligence.learningStyle}</p>
            </div>
          </section>
        )}

        {/* Top 3 Intelligences */}
        <section>
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-700 text-white">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-brand-700">أعلى 3 ذكاءات</p>
              <h2 className="text-2xl font-black text-ink">نقاط القوة الأقرب للطالب</h2>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {top3.map((item, index) => (
              <article key={item.key} className="card-glass overflow-hidden rounded-[2rem]">
                <div className={`bg-gradient-to-br ${item.colorClass} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{item.icon}</span>
                    <span className="rounded-full bg-white/20 px-4 py-1 text-sm font-black">المركز {index + 1}</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-black">{item.name}</h3>
                  <div className="mt-3">
                    <div className="h-2 overflow-hidden rounded-full bg-white/20">
                      <div className="h-full rounded-full bg-white/80" style={{ width: `${item.percentage}%` }} />
                    </div>
                    <p className="mt-2 text-sm font-black">{item.percentage}%</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm leading-7 text-slate-600">{item.description}</p>
                  <div className="mt-4 rounded-3xl bg-slate-50 p-4">
                    <p className="mb-2 text-xs font-black text-brand-700">أنشطة مقترحة</p>
                    <ul className="grid gap-2">
                      {item.suggestedActivities.map((activity) => (
                        <li key={activity} className="flex items-center gap-2 text-xs font-bold text-slate-600">
                          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
                          {activity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Full Ranking + Learning Styles */}
        <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div className="card-glass rounded-[2rem] p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-brand-700" />
              <h2 className="text-2xl font-black text-ink">الترتيب الكامل للذكاءات</h2>
            </div>
            <div className="grid gap-4">
              {scores.map((item) => (
                <div key={item.key} className="rounded-3xl bg-white p-4 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${item.colorClass} text-xl text-white shadow-sm`}>
                        {item.icon}
                      </span>
                      <div>
                        <p className="font-black text-ink">{item.rank}. {item.name}</p>
                        <p className="text-xs font-bold text-slate-500">{item.score} من {item.maxScore}</p>
                      </div>
                    </div>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-black text-brand-700">{item.percentage}%</span>
                  </div>
                  <ScoreBar percentage={item.percentage} />
                </div>
              ))}
            </div>
          </div>

          <aside className="grid gap-6">
            {top3.map((item) => (
              <article key={item.key} className="card-glass rounded-[2rem] p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br ${item.colorClass} text-xl text-white`}>
                    {item.icon}
                  </span>
                  <h3 className="text-xl font-black text-ink">كيف يتعلم صاحب {item.shortName}؟</h3>
                </div>
                <p className="text-sm leading-7 text-slate-600">{item.learningStyle}</p>
                <div className="mt-5 rounded-3xl bg-white p-4">
                  <p className="mb-3 text-sm font-black text-brand-700">أنشطة مقترحة</p>
                  <ul className="grid gap-2 text-sm font-bold text-slate-600">
                    {item.suggestedActivities.map((activity) => (
                      <li key={activity} className="flex items-center gap-2">
                        <ArrowRight className="h-4 w-4 text-brand-700 shrink-0" /> {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </aside>
        </section>

        {/* Footer Note */}
        <footer className="rounded-3xl border border-amber-200 bg-amber-50 p-5 print:border-amber-300">
          <p className="text-sm leading-7 text-amber-800">
            <strong>ملاحظة:</strong> هذه النتائج إرشادية تُبرز ميول الطالب التعليمية استنادًا إلى نظرية هوارد غاردنر للذكاءات المتعددة.
            يُنصح باستشارة المختص التربوي لتفسير النتائج واستثمارها بشكل صحيح.
          </p>
        </footer>
      </section>
    </main>
  );
}
