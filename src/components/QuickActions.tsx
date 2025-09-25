import Link from "next/link";

export default function QuickActions(){
  const base = "rounded-xl border p-4 text-center transition hover:bg-white/50 dark:hover:bg-white/10";
  const primary = "border-[color:var(--color-primary)] text-[color:var(--color-primary)]";

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {/* Big, bold Crisis button */}
      <Link
        className={`${base} ${primary} col-span-2 sm:col-span-2 text-lg font-semibold py-5`}
        href="/crisis"
        aria-label="Open Crisis resources and hotlines"
      >
        ⚠️ Crisis
      </Link>

      {/* Other actions */}
      <Link className={base} href="/tools/grounding">Grounding</Link>
      <Link className={base} href="/tools/breathe">Breathe</Link>
      <Link className={base} href="/self-care">Self-Care</Link>
      <Link className={base} href="/checkin">Mood</Link>
    </div>
  );
}
