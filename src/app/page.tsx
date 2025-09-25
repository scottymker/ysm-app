import HomeGreeting from "@/components/HomeGreeting";
import QuickActions from "@/components/QuickActions";
import ContinueCard from "@/components/ContinueCard";

export default function HomePage(){
  return (
    <main className="min-h-screen bg-[var(--surface-light)] text-[var(--color-ink)] dark:bg-[var(--surface-dark)] dark:text-white">
      <div className="mx-auto max-w-2xl p-6 py-16">
        <HomeGreeting />
        <QuickActions />
        <ContinueCard />
      </div>
    </main>
  );
}
