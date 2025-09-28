"use client";
import PHQ9 from "@/components/screeners/PHQ9";
import GAD7 from "@/components/screeners/GAD7";
export default function ScreenersPage() {
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-8">
      <h1 className="text-2xl font-bold">Screening Tools</h1>
      <PHQ9 />
      <GAD7 />
    </main>
  );
}
