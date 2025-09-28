"use client";
import { useState } from "react";
import { fourPoint, useTotal, Badge } from "./ScreenerShared";

const questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it is hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen",
];

function interpretGAD7(total: number) {
  if (total <= 4) return "Minimal";
  if (total <= 9) return "Mild";
  if (total <= 14) return "Moderate";
  return "Severe";
}

export default function GAD7({ onSave }: { onSave?: (score: number, responses: number[]) => void }) {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const total = useTotal(responses);

  const save = () => {
    const arr = Array.from({length: 7}, (_, i) => responses[i] ?? 0);
    onSave?.(total, arr);
    try {
      const historyRaw = localStorage.getItem("ysm:gad7") || "[]";
      const history = JSON.parse(historyRaw as string);
      (history as any[]).unshift({ ts: Date.now(), total, responses: arr });
      localStorage.setItem("ysm:gad7", JSON.stringify((history as any[]).slice(0, 25)));
      alert("GAD-7 saved locally.");
    } catch {}
  };

  return (
    <section className="rounded-2xl border p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">GAD-7 (Anxiety Screener)</h2>
        <Badge>Total: {total} — {interpretGAD7(total)}</Badge>
      </header>
      <ol className="space-y-3">
        {questions.map((q, idx) => (
          <li key={idx} className="grid gap-2 sm:grid-cols-[1fr,auto] sm:items-center">
            <span>{idx+1}. {q}</span>
            <div className="flex gap-2 flex-wrap">
              {fourPoint.map(opt => (
                <label key={opt.value} className="inline-flex items-center gap-1">
                  <input type="radio" name={`gad7-${idx}`} value={opt.value}
                    onChange={() => setResponses(r => ({...r, [idx]: opt.value}))}/>
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div className="flex gap-2">
        <button className="rounded-xl border px-4 py-2 font-semibold hover:shadow" onClick={save}>Save result</button>
        <a className="text-sm underline" href="/privacy">Privacy notice</a>
      </div>
      <p className="text-xs text-gray-500">
        This screening tool is not a diagnosis. Please seek professional support if you have concerns about your mental health.
      </p>
    </section>
  );
}
