"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, NotebookPen, BarChart3, AlertTriangle } from "lucide-react";

type Item = { href: string; label: string; Icon: React.ComponentType<{ className?: string }> };

const items: Item[] = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/tools", label: "Tools", Icon: Wrench },
  { href: "/journal", label: "Journal", Icon: NotebookPen },
  { href: "/insights", label: "Insights", Icon: BarChart3 },
  { href: "/crisis", label: "Crisis", Icon: AlertTriangle },
];

export default function BottomNav() {
  const pathname = usePathname() || "/";
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black/60" aria-label="Primary">
      <ul className="mx-auto flex max-w-md items-stretch justify-between gap-1 p-2">
        {items.map(({ href, label, Icon }) => {
          const active = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={[
                  "flex flex-col items-center justify-center rounded-xl px-3 py-2 text-sm",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)]",
                  active
                    ? "font-medium text-[color:var(--color-primary)]"
                    : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" />
                <span className="mt-1">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
