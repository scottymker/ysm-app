import { Hand, Wind, ListChecks } from "lucide-react";

export function GroundingCard() {
  return (
    <section className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6 border border-divider" aria-label="Grounding Toolkit">
      <div className="flex items-center gap-2 mb-2 justify-between"><Hand className="text-sky-500" /> <h2 className="text-lg font-bold">Grounding Toolkit</h2></div>
      <p className="text-sm text-gray-600">Try the 5-4-3-2-1 method to ground yourself. Tap to begin.</p>
      <button className="mt-2 bg-sky-500 text-white rounded-lg px-4 py-2">Start Grounding</button>
    </section>
  );
}

export function BreathingCard() {
  return (
    <section className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6 border border-divider" aria-label="Breathing Tools">
      <div className="flex items-center gap-2 mb-2"><Wind className="text-sky-500" /> <h2 className="text-lg font-bold">Breathing Tools</h2></div>
      <p className="text-sm text-gray-600">Box Breathing and 4-7-8 timers with visual guides.</p>
      <button className="mt-2 bg-sky-500 text-white rounded-lg px-4 py-2">Try Breathing</button>
    </section>
  );
}

export function CopingListCard() {
  return (
    <section className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6 border border-divider" aria-label="Coping List">
      <div className="flex items-center gap-2 mb-2"><ListChecks className="text-sky-500" /> <h2 className="text-lg font-bold">Coping List</h2></div>
      <p className="text-sm text-gray-600">Add, edit, and reorder your personal coping strategies.</p>
      <button className="mt-2 bg-sky-500 text-white rounded-lg px-4 py-2">Manage Coping List</button>
    </section>
  );
}
