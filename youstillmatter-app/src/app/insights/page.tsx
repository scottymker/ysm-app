import { InsightsCharts, InsightsSummary } from "../../components/Insights";

export default function InsightsPage() {
  return (
    <main className="min-h-screen bg-surface-light text-ink flex flex-col items-center px-4 py-8 justify-between">
      <InsightsSummary />
      <InsightsCharts />
    </main>
  );
}
