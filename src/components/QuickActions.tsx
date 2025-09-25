import Link from "next/link";
export default function QuickActions(){
  const cls="rounded-xl border p-4 text-center hover:bg-white/50 dark:hover:bg-white/10";
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <Link className={cls} href="/tools/grounding">Grounding</Link>
      <Link className={cls} href="/tools/breathe">Breathe</Link>
      <Link className={cls} href="/self-care">Self-Care</Link>
      <Link className={cls} href="/checkin">Mood</Link>
    </div>
  );
}
