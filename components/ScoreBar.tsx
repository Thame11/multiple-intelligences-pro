export function ScoreBar({ percentage }: { percentage: number }) {
  return (
    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-gradient-to-l from-brand-700 to-brand-500 transition-all"
        style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
      />
    </div>
  );
}
