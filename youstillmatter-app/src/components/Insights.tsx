import { BarChart3, Info } from "lucide-react";

export function InsightsSummary() {
  return (
    <section className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6 border border-divider" aria-label="Insights Summary">
      <div className="flex items-center gap-2 mb-2"><Info className="text-sky-500" /> <h2 className="text-lg font-bold">Mood Insights</h2></div>
      <p className="text-sm text-gray-600">Gentle insights and trends will appear here as you check in.</p>
    </section>
  );
}

export function InsightsCharts() {
  return (
    <section className="w-full max-w-md bg-white rounded-xl shadow p-4 mb-6 border border-divider" aria-label="Mood Charts">
      <div className="flex items-center gap-2 mb-2"><BarChart3 className="text-sky-500" /> <h2 className="text-lg font-bold">Mood Charts</h2></div>
      <p className="text-sm text-gray-600">Charts for last 7/30/90 days will appear here.</p>
    </section>
  );
}
