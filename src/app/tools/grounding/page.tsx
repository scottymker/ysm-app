"use client";

import { useState, useMemo } from "react";
import { useJournalStore } from "@/stores/useJournalStore";

type Step = { count: number; label: string; prompt: string };

const STEPS: Step[] = [
  { count: 5, label: "See",   prompt: "Name 5 things you can see" },
  { count: 4, label: "Touch", prompt: "Name 4 things you can feel/touch" },
  { count: 3, label: "Hear",  prompt: "Name 3 things you can hear" },
  { count: 2, label: "Smell", prompt: "Name 2 things you can smell" },
  { count: 1, label: "Taste", prompt: "Name 1 thing you can taste" },
];

export default function GroundingPage() {
  const addJournal = useJournalStore((s) => s.add);
  const [stepIdx, setStepIdx] = useState(0);
  const [answers, setAnswers] = useState<string[][]>(
    STEPS.map((s) => Array.from({ length: s.count }, () => ""))
  );
  const [note, setNote] = useState("");

  const current = STEPS[stepIdx];

  const canNext = useMemo(() => {
    const filled = answers[stepIdx].some((x) => x.trim().length > 0);
    return filled || stepIdx > 0; // allow moving back/forth; encourage but don't block
  }, [answers, stepIdx]);

  function setAnswer(i: number, val: string) {
    setAnswers((prev) => {
      const copy = prev.map((arr) => [...arr]);
      copy[stepIdx][i] = val;
      return copy;
    });
  }

  function finish() {
    const body =
      `5-4-3-2-1 Grounding summary\n\n` +
      STEPS.map((s, i) => {
        const filled = answers[i].filter(Boolean);
        return `${s.label} (${s.count}): ${filled.length ? filled.join(", ") : "—"}`;
      }).join("\n") +
      (note.trim() ? `\n\nNote: ${note.trim()}` : "");
    addJournal({ body, tags: ["grounding"] });
    setStepIdx(0);
    setAnswers(STEPS.map((s) => Array.from({ length: s.count }, () => "")));
    setNote("");
    alert("Saved to Journal ✅");
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">Grounding (5-4-3-2-1)</h1>
      <p className="mt-2 opacity-80">{current.prompt}</p>

      <div className="mt-6 space-y-2">
        {answers[stepIdx].map((val, i) => (
          <input
            key={i}
            value={val}
            onChange={(e) => setAnswer(i, e.target.value)}
            placeholder={`${current.label} #${i + 1}`}
            className="w-full rounded-xl border bg-transparent px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
          />
        ))}
      </div>

      <div className="mt-6 flex items-center gap-3 justify-between">
        <button
          className="rounded-xl border px-4 py-2 disabled:opacity-50"
          onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
          disabled={stepIdx === 0}
        >
          Back
        </button>
        {stepIdx < STEPS.length - 1 ? (
          <button
            className="rounded-xl border px-4 py-2 disabled:opacity-50"
            onClick={() => setStepIdx((i) => Math.min(STEPS.length - 1, i + 1))}
            disabled={!canNext}
          >
            Next
          </button>
        ) : (
          <button className="rounded-xl border px-4 py-2" onClick={finish}>Finish & Save</button>
        )}
      </div>

      <div className="mt-8">
        <label className="mb-1 block text-sm opacity-80">Optional note</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="h-24 w-full resize-none rounded-xl border bg-transparent px-3 py-2 outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]"
          placeholder="Anything you want to remember from this exercise?"
        />
      </div>

      <ol className="mt-8 flex items-center gap-2">
        {STEPS.map((_, i) => (
          <li
            key={i}
            aria-label={`step ${i + 1}`}
            className={[
              "h-2 w-2 rounded-full",
              i === stepIdx ? "bg-[color:var(--color-primary)]" : "bg-neutral-400/50",
            ].join(" ")}
          />
        ))}
      </ol>

      <p className="mt-8 text-sm opacity-70">
        Tip: even a few words count. Small steps are still steps.
      </p>
    </main>
  );
}
