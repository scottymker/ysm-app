import SafetyBanner from "@/components/SafetyBanner";
import HomeGreeting from "@/components/HomeGreeting";
import QuickActions from "@/components/QuickActions";
import ContinueCard from "@/components/ContinueCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-light text-ink flex flex-col gap-6 p-6">
      <header className="pt-2">
        <img src="/logo.png" alt="" className="mx-auto block rounded-full" width={128} height={128} style={{ width: "6rem", height: "6rem" }} />
      </header>
      <div className="text-center"><HomeGreeting /></div>
      <SafetyBanner />
      <QuickActions />
      <ContinueCard />
    </main>
  );
}
