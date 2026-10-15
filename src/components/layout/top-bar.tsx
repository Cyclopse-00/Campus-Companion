"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Compass, Clock } from "lucide-react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { formatTimeIST } from "@/lib/time";

export function TopBar() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const update = () => setCurrentTime(formatTimeIST(new Date()));
    update();
    const interval = setInterval(update, 30000); // every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border/60 bg-background/90 px-3.5 sm:px-6 backdrop-blur-md">
      <Link
        href="/map"
        className="flex items-center gap-2 select-none group min-h-[44px]"
        aria-label="CampusHub Home"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm shadow-primary/30 transition-transform group-hover:scale-105">
          <Compass className="h-5 w-5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-foreground leading-none">
            Campus<span className="text-primary">Hub</span>
          </span>
          <span className="text-[10px] font-medium text-muted-foreground leading-tight">
            Smart Campus Companion
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-2">
        {currentTime && (
          <div
            className="hidden xs:flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-xs font-medium text-muted-foreground border border-border/40 select-none"
            title="Campus Local Time (Asia/Kolkata)"
          >
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>{currentTime} IST</span>
          </div>
        )}

        <ThemeToggle className="rounded-xl min-h-[44px] min-w-[44px]" />
      </div>
    </header>
  );
}