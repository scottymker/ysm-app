"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Mode = "box" | "478";
type Phase = "In" | "Hold" | "Out";

const SEQS: Record<Mode, { phase: Phase; secs: number }[]> = {
  box: [
    { phase: "In", secs: 4 },
    { phase: "Hold", secs: 4 },
    { phase: "Out", secs: 4 },
    { phase: "Hold", secs: 4 },
  ],
  "478": [
    { phase: "In", secs: 4 },
    { phase: "Hold", secs: 7 },
    { phase: "Out", secs: 8 },
  ],
};

export default function BreathePage() {
  const [mode, setMode] = useState<Mode>("box");
  const [running, setRunning] = useState(false);
  const [idx, setIdx] = useState(0);
  const [count, setCount] = useState(SEQS[mode][0].secs);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches,
    []
  );

  function reset(toMode?: Mode) {
    const m = toMode ?? mode;
    setIdx(0);
    setCount(SEQS[m][0].secs);
    setRunning(false);
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  }

  useEffect(() => {
    // reset when mode changes
    reset(mode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  useEffect(() => {
    if (!running) return;
    timer.current = setInterval(() => {
      setCount((c) => {
        if (c > 1) return c - 1;
        // move to next phase
        setIdx((i) => {
          const next = (i + 1) % SEQS[mode].length;
          setCount(SEQS[mode][next].secs);
          return next;
        });
        return 0;
      });
    }, 1000);
    return () => {
      if (timer.current) clearInterval(timer.current);
      timer.current = null;
    };
  }, [running, mode]);

  const phase = SEQS[mode][idx].phase;

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">Breathe</h1>

      <div className="mt-4 flex gap-2">
        <button
          className={["rounded-xl border px-3 py-2", mode === "box" ? "border-[color:var(--color-primary)]" : ""].join(" ")}
          onClick={() => setMode("box")}
        >
          Box (4-4-4-4)
        </button>
        <button
          className={["rounded-xl border px-3 py-2", mode === "478" ? "border-[color:var(--color-primary)]" : ""].join(" ")}
          onClick={() => setMode("478")}
        >
          4-7-8
        </button>
      </div>

      <div className="mt-10 grid place-items-center">
        <div className="text-6xl font-semibold tabular-nums">{count}</div>
        <div className="mt-2 text-lg opacity-80">{phase}</div>

        {!reducedMotion && (
          <div
            className={[
              "mt-8 h-24 w-24 rounded-full border-2 border-[color:var(--color-primary)]",
              phase === "In" ? "animate-[pulse_1s_ease-in-out_infinite]" : "",
            ].join(" ")}
            aria-hidden
          />
        )}
      </div>

      <div className="mt-8 flex gap-3">
        <button className="rounded-xl border px-4 py-2" onClick={() => setRunning((r) => !r)}>
          {running ? "Pause" : "Start"}
        </button>
        <button className="rounded-xl border px-4 py-2" onClick={() => reset()}>
          Reset
        </button>
      </div>

      <p className="mt-8 text-sm opacity-70">
        Reduced-motion is respected. If animations are off, use the countdown and phase labels.
      </p>
    </main>
  );
}
