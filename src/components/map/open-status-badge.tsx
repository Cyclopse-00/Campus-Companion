"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import type { OpenStatusCode } from "@/types/map";
import { getStatusColor } from "@/lib/open-status";
import { cn } from "@/lib/utils";

interface LiveStatusBadgeProps {
  status?: OpenStatusCode;
  label?: string;
  className?: string;
  showDot?: boolean;
}

export function LiveStatusBadge({
  status = "CLOSED",
  label,
  className,
  showDot = true,
}: LiveStatusBadgeProps) {
  const colors = getStatusColor(status);

  const displayLabel =
    label ??
    (status === "ALWAYS_OPEN"
      ? "Open 24/7"
      : status === "OPEN"
      ? "Open Now"
      : status === "CLOSING_SOON"
      ? "Closing Soon"
      : "Closed");

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold border select-none transition-colors",
        status === "OPEN" || status === "ALWAYS_OPEN"
          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          : status === "CLOSING_SOON"
          ? "border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : "border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400",
        className
      )}
    >
      {showDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full shrink-0",
            colors.dot,
            status === "CLOSING_SOON" ? "animate-pulse" : ""
          )}
          aria-hidden="true"
        />
      )}
      <span className="truncate">{displayLabel}</span>
    </span>
  );
}