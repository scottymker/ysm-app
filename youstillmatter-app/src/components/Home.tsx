import { Sparkle } from "lucide-react";

export function HomeGreeting() {
  const hour = new Date().getHours();
  let greeting = "You matter.";
  if (hour < 12) greeting = "Good morning. You matter.";
  else if (hour < 18) greeting = "Good afternoon. You matter.";
  else greeting = "Good evening. You matter.";
  return (
    <section aria-label="Greeting" className="mb-6 text-2xl font-semibold flex items-center gap-2 justify-between">
      <Sparkle aria-hidden="true" className="text-sky-500" />
      {greeting}
    </section>
  );
}

export function QuickActions() {
  return (
    <nav aria-label="Quick actions" className="flex gap-4 mb-6">
      <button className="bg-sky-500 text-white rounded-lg px-4 py-2 focus:outline focus-visible:ring-2" aria-label="Grounding Toolkit">Grounding</button>
      <button className="bg-sky-500 text-white rounded-lg px-4 py-2 focus:outline focus-visible:ring-2" aria-label="Breathe">Breathe</button>
      <button className="bg-sky-500 text-white rounded-lg px-4 py-2 focus:outline focus-visible:ring-2" aria-label="Mood Check-in">Mood Check-in</button>
      <button className="bg-red-600 text-white rounded-lg px-4 py-2 focus:outline focus-visible:ring-2" aria-label="Crisis">Crisis</button>
    </nav>
  );
}

export function ContinueCard() {
  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6 border border-divider" aria-label="Continue where you left off">
      <h2 className="text-lg font-bold mb-2">Continue where you left off</h2>
      <p className="text-sm text-gray-600">No unfinished entries. Start a new journal or check-in!</p>
    </div>
  );
}
