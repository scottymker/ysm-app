import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, NotebookPen, BarChart3, AlertTriangle } from "lucide-react";

const navItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/tools", label: "Tools", icon: Wrench },
  { href: "/journal", label: "Journal", icon: NotebookPen },
  { href: "/insights", label: "Insights", icon: BarChart3 },
  { href: "/crisis", label: "Crisis", icon: AlertTriangle, color: "text-red-600" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-divider flex justify-around py-3 z-10 md:hidden justify-between"
    >
      {navItems.map(({ href, label, icon: Icon, color }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center text-xs px-2 py-1 rounded-lg focus:outline focus-visible:ring-2 ${color || ""}" aria-current={pathname === href ? "page" : undefined}`}
        >
          <Icon className="h-7 w-7 mb-1" aria-hidden="true" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
