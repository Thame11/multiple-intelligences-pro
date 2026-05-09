import type { LucideIcon } from "lucide-react";

export function StatCard({ title, value, note, Icon }: { title: string; value: string | number; note?: string; Icon: LucideIcon }) {
  return (
    <article className="card-glass rounded-[2rem] p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-bold text-slate-500">{title}</p>
          <h3 className="mt-2 text-4xl font-black text-ink">{value}</h3>
          {note && <p className="mt-3 text-sm font-bold text-brand-700">{note}</p>}
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand-50 text-brand-700">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </article>
  );
}
