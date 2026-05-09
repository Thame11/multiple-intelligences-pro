"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button onClick={logout} className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-sm font-black text-slate-600 shadow-sm transition hover:text-red-600">
      <LogOut className="h-4 w-4" /> خروج
    </button>
  );
}
