import HomeGreeting from "@/components/HomeGreeting";
import QuickActions from "@/components/QuickActions";
import ContinueCard from "@/components/ContinueCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-light text-ink flex flex-col gap-6 p-6 justify-between">
      <div className="flex items-center gap-3">
        <img src="/logo.v7.png" alt="" width="40" height="40" className="rounded-full" />
        <HomeGreeting />
      </div>
      <QuickActions />
      <ContinueCard />
    </main>
  );
}