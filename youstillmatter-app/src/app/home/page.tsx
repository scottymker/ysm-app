import { HomeGreeting, QuickActions, ContinueCard } from "../../components/Home";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-light text-ink flex flex-col items-center px-4 py-8">
      <HomeGreeting />
      <QuickActions />
      <ContinueCard />
    </main>
  );
}
