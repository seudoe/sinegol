"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  HeartHandshake,
  LayoutDashboard,
  Shuffle,
  Trophy,
  UserRound,
  Users,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS = {
  dashboard: LayoutDashboard,
  scores: Trophy,
  charity: HeartHandshake,
  draws: Shuffle,
  winnings: Wallet,
  profile: UserRound,
  users: Users,
  winners: Trophy,
  analytics: BarChart3,
} as const;

export type SidebarIcon = keyof typeof ICONS;

export interface SidebarItem {
  label: string;
  href: string;
  icon: SidebarIcon;
}

/**
 * Icons are resolved here from a string key (`SidebarIcon`) rather than
 * accepted as component references — this is a Client Component, and
 * function/component values can't cross the Server -> Client boundary
 * as props from the Server Component layouts that render it.
 */
export function Sidebar({
  eyebrow,
  items,
}: {
  eyebrow: string;
  items: SidebarItem[];
}) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col gap-6 bg-sidebar px-4 py-8 text-sidebar-foreground">
      <div className="px-3">
        <p className="text-[0.65rem] font-medium tracking-[0.25em] text-sidebar-primary uppercase">
          {eyebrow}
        </p>
      </div>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = ICONS[item.icon];

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md border-l-2 border-transparent px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
