"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { questions } from "@/lib/questions";
import { orderedIntelligences } from "@/lib/intelligences";
import { LogoMark } from "./LogoMark";

type StudentForm = {
  name: string;
  nationalId: string;
  grade: string;
  school: string;
};

const choices = [
  { value: 1, label: "لا ينطبق" },
  { value: 2, label: "ينطبق قليلًا" },
  { value: 3, label: "محايد" },
  { value: 4, label: "ينطبق غالبًا" },
  { value: 5, label: "ينطبق تمامًا" },
];

export function StudentAssessment() {
  const router = useRouter();
  const [student, setStudent] = useState<StudentForm>({ name: "", nationalId: "", grade: "", school: "" });
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const progress = Math.round((Object.keys(answers).length / questions.length) * 100);
  const isReady = student.name.trim().length >= 2 && Object.keys(answers).length === questions.length;

  const groupedQuestions = useMemo(() => {
    return orderedIntelligences.map((intelligence) => ({
      intelligence,
      questions: questions.filter((q) => q.type === intelligence.key),
    }));
  }, []);

  async function handleSubmit() {
    setError("");
    if (!isReady) {
      setError("فضلاً أكمل بيانات الطالب وجميع الأسئلة قبل عرض النتيجة.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student, answers }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "تعذر حفظ النتيجة");
      router.push(data.redirectTo);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8">
      <section className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="card-glass flex flex-col gap-6 rounded-[2rem] p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <LogoMark />
          <div className="max-w-2xl">
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
              <Sparkles className="h-4 w-4" /> اختبار تفاعلي من 40 عبارة
            </p>
            <h2 className="text-3xl font-black leading-tight text-ink md:text-5xl">
              اكتشف نمط ذكائك الأقرب بطريقة منظمة وجذابة.
            </h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              اقرأ كل عبارة واختر الدرجة التي تمثلك. النتيجة تعرض أعلى 3 ذكاءات مع ترتيب كامل وتوصيات مناسبة.
            </p>
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-[0.9fr_1.4fr]">
          <aside className="card-glass h-fit rounded-[2rem] p-6 lg:sticky lg:top-6">
            <h3 className="text-xl font-black text-ink">بيانات الطالب</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">تستخدم هذه البيانات لحفظ النتيجة وظهورها في لوحة التحكم.</p>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">اسم الطالب *</span>
                <input
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  value={student.name}
                  onChange={(e) => setStudent((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="مثال: ثامر الشمري"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">رقم الهوية</span>
                <input
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  value={student.nationalId}
                  onChange={(e) => setStudent((prev) => ({ ...prev, nationalId: e.target.value }))}
                  placeholder="اختياري"
                />
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">الصف</span>
                <select
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  value={student.grade}
                  onChange={(e) => setStudent((prev) => ({ ...prev, grade: e.target.value }))}
                >
                  <option value="">اختر الصف</option>
                  <option>ثالث ابتدائي</option>
                  <option>رابع ابتدائي</option>
                  <option>خامس ابتدائي</option>
                  <option>سادس ابتدائي</option>
                  <option>أول متوسط</option>
                  <option>ثاني متوسط</option>
                  <option>ثالث متوسط</option>
                  <option>أول ثانوي</option>
                  <option>ثاني ثانوي</option>
                  <option>ثالث ثانوي</option>
                </select>
              </label>
              <label className="grid gap-2">
                <span className="text-sm font-bold text-slate-700">المدرسة</span>
                <input
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                  value={student.school}
                  onChange={(e) => setStudent((prev) => ({ ...prev, school: e.target.value }))}
                  placeholder="اختياري"
                />
              </label>
            </div>

            <div className="mt-8 rounded-3xl bg-white p-4">
              <div className="mb-3 flex items-center justify-between text-sm font-bold text-slate-600">
                <span>التقدم</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-l from-brand-700 to-brand-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-3 text-xs font-bold text-slate-500">
                تمت الإجابة على {Object.keys(answers).length} من {questions.length} عبارة.
              </p>
            </div>

            {error && <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={!isReady || isSubmitting}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-700 px-5 py-4 text-base font-black text-white shadow-soft transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
              عرض النتيجة
            </button>
          </aside>

          <div className="grid gap-5">
            {groupedQuestions.map((group) => (
              <section key={group.intelligence.key} className="card-glass rounded-[2rem] p-5 md:p-6">
                <div className="mb-5 flex items-center gap-3">
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${group.intelligence.colorClass} text-xl text-white`}>
                    {group.intelligence.icon}
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-brand-700">قسم الأسئلة</p>
                    <h3 className="text-xl font-black text-ink">{group.intelligence.name}</h3>
                  </div>
                </div>

                <div className="grid gap-4">
                  {group.questions.map((question) => (
                    <div key={question.id} className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
                      <div className="flex gap-3">
                        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-50 text-sm font-black text-brand-700">
                          {question.id}
                        </span>
                        <p className="pt-1 text-base font-bold leading-7 text-slate-800">{question.text}</p>
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-5">
                        {choices.map((choice) => {
                          const selected = answers[question.id] === choice.value;
                          return (
                            <button
                              key={choice.value}
                              type="button"
                              onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: choice.value }))}
                              className={`rounded-2xl border px-3 py-3 text-center text-sm font-bold transition ${
                                selected
                                  ? "border-brand-700 bg-brand-700 text-white shadow-soft"
                                  : "border-slate-200 bg-slate-50 text-slate-600 hover:border-brand-500 hover:bg-brand-50"
                              }`}
                            >
                              <span className="block text-base font-black">{choice.value}</span>
                              {choice.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            <button
              onClick={handleSubmit}
              disabled={!isReady || isSubmitting}
              className="inline-flex items-center justify-center gap-2 rounded-[1.5rem] bg-ink px-6 py-5 text-lg font-black text-white shadow-soft transition hover:bg-brand-900 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowLeft className="h-5 w-5" />}
              حفظ الاختبار والانتقال للنتيجة
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}
