"use client";

import { useMemo, useState } from "react";
import { useSelfCareStore } from "@/stores/useSelfCareStore";

function useTodayKey() {
  const now = new Date();
  return now.toISOString().slice(0,10); // YYYY-MM-DD
}

export default function SelfCarePage() {
  const dateKey = useTodayKey();
  const { template, doneByDate, toggle, addItem, removeItem, resetDay, clearAllProgress } = useSelfCareStore();
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Grounding");

  const done = doneByDate[dateKey] ?? [];

  const categories = useMemo(() => {
    const map = new Map<string, typeof template>();
    for (const t of template) {
      const arr = map.get(t.category) ?? [];
      arr.push(t);
      map.set(t.category, arr);
    }
    return Array.from(map.entries()).sort(([a],[b]) => a.localeCompare(b));
  }, [template]);

  const total = template.length;
  const completed = done.length;
  const pct = total ? Math.round((completed/total)*100) : 0;

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-xl font-semibold">Self-Care Menu</h1>
      <p className="opacity-80 text-sm">
        Pick what helps today. Your checks reset daily. You can add your own items.
      </p>

      <section className="rounded-xl border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm">
            <div className="font-medium">Today’s progress</div>
            <div className="opacity-70">{completed} / {total} • {pct}%</div>
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border px-3 py-2 text-sm" onClick={()=>resetDay(dateKey)}>
              Reset today
            </button>
            <button className="rounded-xl border px-3 py-2 text-sm" onClick={clearAllProgress}>
              Clear all progress
            </button>
          </div>
        </div>
        <div className="mt-3 h-2 w-full rounded bg-neutral-200/60 dark:bg-neutral-800">
          <div
            className="h-2 rounded bg-[color:var(--color-primary)] transition-all"
            style={{ width: `${pct}%` }}
            aria-hidden
          />
        </div>
      </section>

      {categories.map(([cat, items]) => (
        <section key={cat} className="rounded-xl border p-4">
          <h2 className="font-medium">{cat}</h2>
          <ul className="mt-3 space-y-2">
            {items.map((it) => {
              const checked = done.includes(it.id);
              return (
                <li key={it.id} className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(it.id, dateKey)}
                    />
                    <span className={checked ? "line-through opacity-70" : ""}>{it.text}</span>
                  </label>
                  {!it.builtIn && (
                    <button
                      className="rounded-lg border px-2 py-1 text-xs"
                      onClick={() => removeItem(it.id)}
                      aria-label={`Remove ${it.text}`}
                    >
                      Remove
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      ))}

      <section className="rounded-xl border p-4">
        <h2 className="font-medium">Add your own</h2>
        <form
          onSubmit={(e)=>{ e.preventDefault(); if (!text.trim()) return;
            addItem(text.trim(), category); setText(""); }}
          className="mt-3 flex flex-wrap items-center gap-2"
        >
          <select
            className="rounded-xl border px-3 py-2 text-sm"
            value={category}
            onChange={(e)=>setCategory(e.target.value)}
            aria-label="Category"
          >
            {["Grounding","Move","Connect","Nourish","Rest","Joy","Hygiene","Health","Other"].map(c =>
              <option key={c} value={c}>{c}</option>
            )}
          </select>
          <input
            className="min-w-[12rem] flex-1 rounded-xl border px-3 py-2 text-sm"
            placeholder="Describe your self-care step…"
            value={text}
            onChange={(e)=>setText(e.target.value)}
            aria-label="Self-care text"
          />
          <button className="rounded-xl border px-3 py-2 text-sm" type="submit">Add</button>
        </form>
        <p className="mt-2 text-xs opacity-60">Tip: keep items small and doable.</p>
      </section>
    </main>
  );
}
