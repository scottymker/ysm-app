import Link from "next/link";

export default function ToolsIndex(){
  const cls="rounded-xl border p-4 text-center hover:bg-white/50 dark:hover:bg-white/10";
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">Tools</h1>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link className={cls} href="/tools/grounding">Grounding 5-4-3-2-1</Link>
        <Link className={cls} href="/tools/breathe">Breathe</Link>
        <Link className={cls} href="/self-care">Self-Care Menu</Link>
      </div>
    </main>
  );
}
