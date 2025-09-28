"use client";
import { useMemo } from "react";

export type Option = { label: string; value: number };
export const fourPoint: Option[] = [
  { label: "Not at all", value: 0 },
  { label: "Several days", value: 1 },
  { label: "More than half the days", value: 2 },
  { label: "Nearly every day", value: 3 },
];

export function useTotal(responses: Record<number, number>) {
  return useMemo(
    () => Object.values(responses).reduce((a, b) => a + (Number.isFinite(b) ? b : 0), 0),
    [responses]
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return <span className="inline-block rounded-full border px-2 py-0.5 text-xs">{children}</span>;
}
