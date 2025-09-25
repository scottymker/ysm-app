import HomeGreeting from "@/components/HomeGreeting";
import QuickActions from "@/components/QuickActions";
import ContinueCard from "@/components/ContinueCard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-surface-light text-ink flex flex-col gap-6 p-6">
      {/* Hero logo (mobile-first) */}
      <header className="pt-2">
        <img
          src="/logo.png"
          alt=""              /* decorative */
          className="mx-auto block rounded-full"
          width={128}
          height={128}
          style={{ width: "6rem", height: "6rem" }}  /* sm: 96px-ish; tweak as desired */
        />
      </header>

      {/* Title + greeting */}
      <div className="text-center">
        <HomeGreeting />
      </div>

      <QuickActions />
      <ContinueCard />
    </main>
  );
}
