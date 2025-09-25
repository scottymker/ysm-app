"use client";

import { useState } from "react";
import { useMoodStore } from "@/stores/useMoodStore";
import Link from "next/link";

const EMOTIONS = ["happy","calm","anxious","sad","overwhelmed","proud"] as const;

export default function CheckInPage() {
  const add = useMoodStore(s => s.add);
  const [score, setScore] = useState(5);
  const [chosen, setChosen] = useState<string[]>([]);
  const [note, setNote] = useState("");

  function toggle(tag: string){
    setChosen(arr => arr.includes(tag) ? arr.filter(t => t!==tag) : [...arr, tag]);
  }

  function submit(e: React.FormEvent){
    e.preventDefault();
    add({ score, tags: chosen, note });
    setChosen([]); setNote(""); setScore(5);
    alert("Mood saved ✅");
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">Mood Check-in</h1>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <label className="block text-sm opacity-80">How are you feeling (1–10)?</label>
          <div className="mt-2 flex items-center gap-3">
            <input
              type="range" min={1} max={10} value={score}
              onChange={(e)=>setScore(Number(e.target.value))}
              className="w-full"
            />
            <span className="w-10 text-right tabular-nums">{score}</span>
          </div>
        </div>

        <div>
          <label className="block text-sm opacity-80">Pick any emotions</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {EMOTIONS.map(t => (
              <button
                key={t}
                type="button"
                onClick={()=>toggle(t)}
                className={[
                  "rounded-full border px-3 py-1 text-sm",
                  chosen.includes(t) ? "border-[color:var(--color-primary)] text-[color:var(--color-primary)]" : "opacity-80"
                ].join(" ")}
                aria-pressed={chosen.includes(t)}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm opacity-80">Optional note</label>
          <textarea
            value={note}
            onChange={(e)=>setNote(e.target.value)}
            className="h-24 w-full resize-none rounded-xl border bg-transparent px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
            placeholder="Anything you'd like to add?"
          />
        </div>

        <div className="flex gap-3">
          <button className="rounded-xl border px-4 py-2" type="submit">Save</button>
          <Link className="rounded-xl border px-4 py-2" href="/insights">Insights</Link>
        </div>

        <p className="text-xs opacity-60">Private to your device. Clearing browser storage will remove entries.</p>
      </form>
    </main>
  );
}
