"use client";

import { useMemo } from "react";
import { useMoodStore } from "@/stores/useMoodStore";

function avg(nums: number[]) { return nums.length ? (nums.reduce((a,b)=>a+b,0)/nums.length) : 0; }

export default function InsightsPage(){
  const entries = useMoodStore(s => s.entries);

  const now = useMemo(()=>Date.now(), []);
  const byDays = useMemo(()=>{
    const map = new Map<string, number[]>();
    for(const e of entries){
      const d = new Date(e.dateISO);
      const key = d.toISOString().slice(0,10);
      const arr = map.get(key) ?? [];
      arr.push(e.score);
      map.set(key, arr);
    }
    // last 30 days, newest last for the chart
    const days:number[] = [];
    const labels:string[] = [];
    for(let i=29;i>=0;i--){
      const dt = new Date(now - i*86400000);
      const key = dt.toISOString().slice(0,10);
      labels.push(key.slice(5)); // MM-DD
      days.push( avg(map.get(key) ?? []) );
    }
    return { labels, days };
  }, [entries, now]);

  function windowAvg(n: number){
    const cutoff = now - n*86400000;
    const scores = entries.filter(e => new Date(e.dateISO).getTime() >= cutoff).map(e=>e.score);
    return Math.round(avg(scores)*10)/10;
  }

  const a7  = windowAvg(7);
  const a30 = windowAvg(30);
  const a90 = windowAvg(90);

  // simple sparkline path
  const width = 320, height = 80, pad = 6;
  const max = 10, min = 1;
  const pts = byDays.days.map((v,i)=>{
    const x = pad + (i*(width-2*pad))/(byDays.days.length-1 || 1);
    const y = height - pad - ((v - min) / (max - min)) * (height - 2*pad);
    return `${i===0 ? 'M' : 'L'}${x},${isFinite(y)?y:height-pad}`;
  }).join(" ");

  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-xl font-semibold">Insights</h1>

      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border p-3 text-center">
          <div className="text-xs opacity-70">Avg 7d</div>
          <div className="text-2xl font-semibold tabular-nums">{a7.toFixed(1)}</div>
        </div>
        <div className="rounded-xl border p-3 text-center">
          <div className="text-xs opacity-70">Avg 30d</div>
          <div className="text-2xl font-semibold tabular-nums">{a30.toFixed(1)}</div>
        </div>
        <div className="rounded-xl border p-3 text-center">
          <div className="text-xs opacity-70">Avg 90d</div>
          <div className="text-2xl font-semibold tabular-nums">{a90.toFixed(1)}</div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border p-3">
        <div className="mb-2 text-sm opacity-70">Last 30 days</div>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100">
          <polyline points={`0,${height-pad} ${width},${height-pad}`} fill="none" stroke="currentColor" opacity="0.15" />
          <path d={pts || `M${pad},${height-pad} L${width-pad},${height-pad}`} fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <div className="mt-1 text-xs opacity-60">Higher is better (10)</div>
      </div>
    </main>
  );
}
