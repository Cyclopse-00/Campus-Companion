"use client";

import React from "react";
import type { CrowdLevel } from "@/types/map";
import { CROWD_LEVEL_META } from "@/types/map";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface CrowdBadgeProps {
  level: CrowdLevel;
  className?: string;
  showIcon?: boolean;
}

export function CrowdBadge({ level, className, showIcon = true }: CrowdBadgeProps) {
  const meta = CROWD_LEVEL_META[level] ?? CROWD_LEVEL_META.MODERATE;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium bg-muted/80 border border-border/50 text-foreground select-none",
        className
      )}
      title={`Live crowd level: ${meta.label}`}
    >
      {showIcon && <Users className="h-3 w-3 text-muted-foreground shrink-0" />}
      <span className={cn("font-semibold", meta.color)}>{meta.label}</span>
      <span className="flex items-center gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((dot) => (
          <span
            key={dot}
            className={cn(
              "h-1 w-1 rounded-full",
              dot <= meta.dots ? "bg-primary" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </span>
    </span>
  );
}