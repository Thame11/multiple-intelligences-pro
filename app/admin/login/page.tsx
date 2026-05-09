"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Loader2 } from "lucide-react";
import { LogoMark } from "@/components/LogoMark";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "فشل تسجيل الدخول");
      router.push(data.redirectTo ?? "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="card-glass w-full max-w-md rounded-[2rem] p-6 md:p-8">
        <LogoMark />
        <div className="mt-8">
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-sm font-bold text-brand-700">
            <LockKeyhole className="h-4 w-4" /> دخول الإدارة
          </p>
          <h1 className="mt-4 text-3xl font-black text-ink">لوحة تحكم الاختبارات</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">أدخل بيانات الإدارة لمراجعة النتائج والتقارير وتصدير Excel.</p>
        </div>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">اسم المستخدم</span>
            <input
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-bold text-slate-700">كلمة المرور</span>
            <input
              type="password"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
          <button
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-700 px-5 py-4 text-base font-black text-white shadow-soft transition hover:bg-brand-900 disabled:bg-slate-300"
          >
            {loading && <Loader2 className="h-5 w-5 animate-spin" />}
            تسجيل الدخول
          </button>
        </form>
      </section>
    </main>
  );
}
