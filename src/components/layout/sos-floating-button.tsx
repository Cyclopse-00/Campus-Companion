"use client";

import React from "react";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

interface SOSFloatingButtonProps {
  className?: string;
}

export function SOSFloatingButton({ className }: SOSFloatingButtonProps) {
  return (
    <div
      className={cn(
        "fixed bottom-20 right-3.5 sm:bottom-24 sm:right-6 z-40 select-none",
        className
      )}
    >
      <Link
        href="/safety"
        aria-label="Campus Emergency SOS Safety Tools"
        title="Emergency SOS & Campus Security Hotline"
        className="group relative flex items-center gap-2 rounded-full bg-rose-600 px-4 py-3 text-white shadow-lg shadow-rose-600/40 transition-all duration-200 hover:bg-rose-700 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-500/50 min-h-[48px] min-w-[48px]"
      >
        {/* Subtle pulsing background glow ring */}
        <span
          className="absolute -inset-1 rounded-full bg-rose-600/30 animate-pulse pointer-events-none"
          aria-hidden="true"
        />

        <ShieldAlert className="h-5 w-5 shrink-0 stroke-[2.2] animate-bounce" />
        <span className="text-xs sm:text-sm font-extrabold tracking-wider uppercase drop-shadow-sm">
          SOS
        </span>
      </Link>
    </div>
  );
}