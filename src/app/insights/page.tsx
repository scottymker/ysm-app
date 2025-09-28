"use client";

import { useMemo } from "react";
import { useJournalStore } from "@/stores/useJournalStore";
import { useMoodStore } from "@/stores/useMoodStore";
import { downloadJSON, pickJSON } from "@/lib/backup";
import Link from "next/link";

/** ---------- helpers ---------- */
function ymKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function mmdd(d: Date) {
  return `${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function average(nums: number[]) {
  return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

/** ---------- charts (inline SVG) ---------- */
function Bars({
  labels,
  values,
  height = 120,
  pad = 8,
  ariaLabel,
}: {
  labels: string[];
  values: number[];
  height?: number;
  pad?: number;
  ariaLabel: string;
}) {
  const max = Math.max(1, ...values);
  const w = 16; // each bar width
  const gap = 8;
  const width = values.length * (w + gap) + pad * 2 - gap;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      {/* baseline */}
      <polyline
        points={`${pad},${height - pad} ${width - pad},${height - pad}`}
        fill="none"
        stroke="currentColor"
        opacity="0.2"
      />
      {values.map((v, i) => {
        const x = pad + i * (w + gap);
        const h = Math.round(((v / max) * (height - pad * 2)) || 0);
        const y = height - pad - h;
        return (
          <g key={i}>
            <rect
              x={x}
              y={y}
              width={w}
              height={h}
              rx="4"
              className="fill-[color:var(--color-primary)]"
            />
            {/* x label (sparse for clarity) */}
            {labels.length <= 12 || i % 2 === 0 ? (
              <text
                x={x + w / 2}
                y={height - 2}
                textAnchor="middle"
                fontSize="9"
                opacity="0.7"
              >
                {labels[i]}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}

function Line({
  labels,
  values,
  min = 1,
  max = 10,
  height = 120,
  pad = 8,
  ariaLabel,
}: {
  labels: string[];
  values: number[];
  min?: number;
  max?: number;
  height?: number;
  pad?: number;
  ariaLabel: string;
}) {
  const width = Math.max(1, (labels.length - 1)) * 12 + pad * 2; // 12px step
  const points = values.map((v, i) => {
    const x = pad + (i * (width - 2 * pad)) / Math.max(1, labels.length - 1);
    const t = (v - min) / (max - min);
    const y = height - pad - (isFinite(t) ? t : 0) * (height - 2 * pad);
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      role="img"
      aria-label={ariaLabel}
    >
      <title>{ariaLabel}</title>
      {/* grid lines (quartiles) */}
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
        const y = height - pad - p * (height - 2 * pad);
        return (
          <polyline
            key={i}
            points={`${pad},${y} ${width - pad},${y}`}
            fill="none"
            stroke="currentColor"
            opacity={i === 0 ? 0.25 : 0.1}
          />
        );
      })}
      <path
        d={points || `M${pad},${height - pad} L${width - pad},${height - pad}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      {/* sparse x labels */}
      {labels.map((lab, i) => {
        if (labels.length > 20 && i % 3 !== 0) return null;
        const x = pad + (i * (width - 2 * pad)) / Math.max(1, labels.length - 1);
        return (
          <text key={i} x={x} y={height - 2} textAnchor="middle" fontSize="9" opacity="0.7">
            {lab}
          </text>
        );
      })}
    </svg>
  );
}

/** ---------- page ---------- */
export default function InsightsPage() {
  const journal = useJournalStore();
  const mood = useMoodStore();

  const now = Date.now();

  // Journal entries per month (last 12 months)
  const journalByMonth = useMemo(() => {
    const labels: string[] = [];
    const counts: number[] = [];
    const map = new Map<string, number>();

    // seed 12 months (from oldest to newest)
    for (let i = 11; i >= 0; i--) {
      const dt = new Date(now);
      dt.setMonth(dt.getMonth() - i);
      const key = ymKey(dt);
      map.set(key, 0);
      labels.push(key.slice(2)); // YY-MM for compact label
    }
    // tally
    for (const e of journal.entries) {
      const d = new Date(e.updatedAt || e.createdAt || e.dateISO || e.date || now);
      const key = ymKey(d);
      if (map.has(key)) map.set(key, (map.get(key) || 0) + 1);
    }
    counts.push(...Array.from(map.values()));
    return { labels, counts, total: counts.reduce((a, b) => a + b, 0) };
  }, [journal.entries, now]);

  // Mood averages per day (last 30 days) + emotion frequency
  const moodSeries = useMemo(() => {
    const labels: string[] = [];
    const mapScores = new Map<string, number[]>();
    const emotions = new Map<string, number>();

    for (let i = 29; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const key = d.toISOString().slice(0, 10);
      labels.push(mmdd(d));
      mapScores.set(key, []);
    }

    for (const e of (mood.entries || (mood as any).history || [])) {
      const d = new Date(e.dateISO || e.date || now);
      const key = d.toISOString().slice(0, 10);
      if (mapScores.has(key)) {
        const arr = mapScores.get(key)!;
        arr.push(Number(e.score) || 0);
      }
      if (Array.isArray(e.tags)) {
        for (const tag of e.tags) emotions.set(tag, (emotions.get(tag) || 0) + 1);
      }
    }

    const values = Array.from(mapScores.values()).map((arr) => average(arr));
    // top emotions, desc
    const topEmotions = Array.from(emotions.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    const a7 = average(values.slice(-7).filter(Boolean));
    const a30 = average(values.filter(Boolean));

    return { labels, values, a7, a30, topEmotions };
  }, [mood.entries, now]);

  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-xl font-semibold">Insights</h1>

      {/* Export / Import */}
      <section className="rounded-xl border p-4">
        <h2 className="font-medium">Back up your data</h2>
        <p className="text-sm opacity-80">Export a JSON with Journal & Mood; import to restore.</p>
        <div className="mt-3 flex flex-wrap gap-2 justify-between">
          <button
            className="rounded-xl border px-3 py-2 text-sm"
            onClick={() =>
              downloadJSON("ysm-backup.json", {
                journal: journal.entries,
                mood: mood.entries || (mood as any).history || [],
              })
            }
          >
            Export
          </button>
          <button
            className="rounded-xl border px-3 py-2 text-sm"
            onClick={async () => {
              const payload = await pickJSON<{ journal?: any[]; mood?: any[] }>();
              if (!payload) return;
              if (Array.isArray(payload.journal)) {
                journal.clear?.();
                payload.journal.forEach((e) =>
                  journal.add({
                    title: e.title || "",
                    body: e.body || e.text || "",
                  })
                );
              }
              if (Array.isArray(payload.mood) && (mood as any).add) {
                payload.mood.forEach((m) =>
                  (mood as any).add({
                    score: Number(m.score) || 5,
                    tags: m.tags || [],
                    note: m.note || "",
                  })
                );
              }
              alert("Import complete.");
            }}
          >
            Import
          </button>
          <Link className="rounded-xl border px-3 py-2 text-sm" href="/journal">Journal</Link>
          <Link className="rounded-xl border px-3 py-2 text-sm" href="/checkin">Add Mood</Link>
        </div>
      </section>

      {/* KPIs */}
      <section className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border p-3 text-center">
          <div className="text-xs opacity-70">Journal (12m)</div>
          <div className="text-2xl font-semibold tabular-nums">{journalByMonth.total}</div>
        </div>
        <div className="rounded-xl border p-3 text-center">
          <div className="text-xs opacity-70">Mood avg 7d</div>
          <div className="text-2xl font-semibold tabular-nums">{moodSeries.a7 ? moodSeries.a7.toFixed(1) : "—"}</div>
        </div>
        <div className="rounded-xl border p-3 text-center">
          <div className="text-xs opacity-70">Mood avg 30d</div>
          <div className="text-2xl font-semibold tabular-nums">{moodSeries.a30 ? moodSeries.a30.toFixed(1) : "—"}</div>
        </div>
      </section>

      {/* Journal per month bar chart */}
      <section className="rounded-xl border p-4">
        <h2 className="font-medium mb-2">Journal entries per month</h2>
        <Bars
          labels={journalByMonth.labels}
          values={journalByMonth.counts}
          ariaLabel="Bar chart of journal entries per month for the last 12 months"
        />
      </section>

      {/* Mood line (last 30 days) */}
      <section className="rounded-xl border p-4">
        <h2 className="font-medium mb-2">Average mood over last 30 days</h2>
        <Line
          labels={moodSeries.labels}
          values={moodSeries.values.map(v => (isFinite(v) ? Number(v.toFixed(2)) : NaN))}
          min={1}
          max={10}
          ariaLabel="Line chart of average daily mood for the last 30 days"
        />
        <div className="mt-2 text-xs opacity-60">Scale 1–10 (higher is better).</div>
      </section>

      {/* Emotions frequency */}
      <section className="rounded-xl border p-4">
        <h2 className="font-medium mb-2">Most picked emotions</h2>
        {moodSeries.topEmotions.length === 0 ? (
          <p className="text-sm opacity-70">No emotion tags yet. Try a few check-ins.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {moodSeries.topEmotions.map(([tag, count]) => (
              <span key={tag} className="rounded-full border px-3 py-1 text-sm">
                {tag} <span className="opacity-60">×{count}</span>
              </span>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
