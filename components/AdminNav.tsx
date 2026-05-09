import Link from "next/link";
import { BarChart3, Home, Table2 } from "lucide-react";
import { LogoMark } from "./LogoMark";
import { LogoutButton } from "./LogoutButton";

export function AdminNav() {
  return (
    <header className="card-glass rounded-[2rem] p-5 md:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <LogoMark />
        <nav className="flex flex-wrap gap-3">
          <Link href="/admin" className="inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-4 py-3 text-sm font-black text-white shadow-sm">
            <Home className="h-4 w-4" /> الرئيسية
          </Link>
          <Link href="/admin/reports" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">
            <BarChart3 className="h-4 w-4" /> التقارير
          </Link>
          <Link href="/admin/results" className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm">
            <Table2 className="h-4 w-4" /> النتائج
          </Link>
          <LogoutButton />
        </nav>
      </div>
    </header>
  );
}
