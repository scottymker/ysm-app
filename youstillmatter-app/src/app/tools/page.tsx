import { GroundingCard, BreathingCard, CopingListCard } from "../../components/Tools";

export default function ToolsPage() {
  return (
    <main className="min-h-screen bg-surface-light text-ink flex flex-col items-center px-4 py-8">
      <GroundingCard />
      <BreathingCard />
      <CopingListCard />
    </main>
  );
}
