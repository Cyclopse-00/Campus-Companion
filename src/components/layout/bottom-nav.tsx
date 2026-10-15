"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, CalendarDays, Bell, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPrefix: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    label: "Map",
    href: "/map",
    icon: MapPin,
    matchPrefix: "/map",
  },
  {
    label: "Timetable",
    href: "/academics/timetable",
    icon: CalendarDays,
    matchPrefix: "/academics",
  },
  {
    label: "Notices",
    href: "/notices",
    icon: Bell,
    matchPrefix: "/notices",
  },
  {
    label: "Campus Life",
    href: "/campus-life",
    icon: Sparkles,
    matchPrefix: "/campus-life",
  },
  {
    label: "Profile",
    href: "/profile",
    icon: User,
    matchPrefix: "/profile",
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Student Navigation"
      className="fixed bottom-0 inset-x-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 shadow-lg shadow-black/5"
    >
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.matchPrefix !== "/" && pathname.startsWith(item.matchPrefix)) ||
            (item.href === "/map" && pathname === "/");

          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "group relative flex min-h-[44px] min-w-[54px] flex-col items-center justify-center rounded-xl px-2 py-1 transition-all duration-150 active:scale-95",
                isActive
                  ? "text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground font-medium"
              )}
            >
              {/* Active pill background */}
              {isActive && (
                <span
                  className="absolute inset-0 rounded-xl bg-primary/10 -z-10 animate-fade-in"
                  aria-hidden="true"
                />
              )}

              <Icon
                className={cn(
                  "h-5 w-5 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "stroke-[2.4]" : "stroke-[1.8]"
                )}
              />
              <span className="mt-0.5 text-[11px] leading-tight tracking-tight select-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}