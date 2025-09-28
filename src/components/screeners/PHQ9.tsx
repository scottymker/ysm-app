"use client";
import { useState } from "react";
import { fourPoint, useTotal, Badge } from "./ScreenerShared";

const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading or watching television",
  "Moving or speaking so slowly that other people could have noticed; or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way",
];

function interpretPHQ9(total: number) {
  if (total <= 4) return "Minimal";
  if (total <= 9) return "Mild";
  if (total <= 14) return "Moderate";
  if (total <= 19) return "Moderately severe";
  return "Severe";
}

export default function PHQ9({ onSave }: { onSave?: (score: number, responses: number[]) => void }) {
  const [responses, setResponses] = useState<Record<number, number>>({});
  const total = useTotal(responses);

  const save = () => {
    const arr = Array.from({length: 9}, (_, i) => responses[i] ?? 0);
    onSave?.(total, arr);
    try {
      const historyRaw = localStorage.getItem("ysm:phq9") || "[]";
      const history = JSON.parse(historyRaw as string);
      (history as any[]).unshift({ ts: Date.now(), total, responses: arr });
      localStorage.setItem("ysm:phq9", JSON.stringify((history as any[]).slice(0, 25)));
      alert("PHQ-9 saved locally.");
    } catch {}
  };

  return (
    <section className="rounded-2xl border p-4 space-y-4">
      <header className="flex items-center justify-between justify-between">
        <h2 className="text-lg font-semibold">PHQ-9 (Depression Screener)</h2>
        <Badge>Total: {total} — {interpretPHQ9(total)}</Badge>
      </header>
      <ol className="space-y-3">
        {questions.map((q, idx) => (
          <li key={idx} className="grid gap-2 sm:grid-cols-[1fr,auto] sm:items-center">
            <span>{idx+1}. {q}</span>
            <div className="flex gap-2 flex-wrap">
              {fourPoint.map(opt => (
                <label key={opt.value} className="inline-flex items-center gap-1">
                  <input type="radio" name={`phq9-${idx}`} value={opt.value}
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
        This screening tool is not a diagnosis. If you scored high or have any self-harm thoughts, use the Crisis button or contact emergency services.
      </p>
    </section>
  );
}
