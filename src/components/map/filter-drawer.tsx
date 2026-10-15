"use client";

import React from "react";
import type { MarkerCategory } from "@/types/map";
import { CATEGORY_META, MARKER_CATEGORIES } from "@/types/map";
import { useMapStore } from "@/store/map-store";
import {
  UtensilsCrossed,
  BookOpen,
  Banknote,
  Stethoscope,
  Droplets,
  Bus,
  GraduationCap,
  Building2,
  Dumbbell,
  Wifi,
  Shield,
  Clock,
  Accessibility,
  X,
  CheckCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS: Record<MarkerCategory, React.ComponentType<{ className?: string }>> = {
  FOOD: UtensilsCrossed,
  STATIONERY: BookOpen,
  MONEY: Banknote,
  HEALTH: Stethoscope,
  WATER_SANITATION: Droplets,
  TRANSPORT: Bus,
  STUDY: GraduationCap,
  SERVICES: Building2,
  RECREATION: Dumbbell,
  CHARGING_WIFI: Wifi,
  SAFETY: Shield,
};

interface UtilityFilterBarProps {
  className?: string;
  categoryCounts?: Partial<Record<MarkerCategory, number>>;
}

export function UtilityFilterBar({ className, categoryCounts = {} }: UtilityFilterBarProps) {
  const { filters, toggleCategory, enableAllCategories, disableAllCategories, setShowOnlyOpen, setShowOnlyWheelchairAccessible } =
    useMapStore();

  const activeCategories = filters.activeCategories;
  const isAllSelected = MARKER_CATEGORIES.every((c) => activeCategories.has(c));
  const isNoneSelected = activeCategories.size === 0;

  return (
    <div className={cn("w-full space-y-2 select-none", className)}>
      {/* Category Chips Carousel */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar px-1 scroll-smooth">
        {/* All Categories Toggle */}
        <button
          type="button"
          onClick={() => (isAllSelected ? disableAllCategories() : enableAllCategories())}
          className={cn(
            "flex h-10 min-h-[44px] shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all duration-200 active:scale-95 border",
            isAllSelected
              ? "bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/25"
              : "bg-background/90 text-muted-foreground border-border hover:text-foreground"
          )}
        >
          {isAllSelected ? (
            <>
              <CheckCheck className="h-4 w-4" />
              <span>All 11 Layers</span>
            </>
          ) : (
            <>
              <span>Select All</span>
            </>
          )}
        </button>

        {/* 11 Utility Category Chips */}
        {MARKER_CATEGORIES.map((catKey) => {
          const meta = CATEGORY_META[catKey];
          const Icon = CATEGORY_ICONS[catKey];
          const isActive = activeCategories.has(catKey);
          const count = categoryCounts[catKey];

          return (
            <button
              key={catKey}
              type="button"
              onClick={() => toggleCategory(catKey)}
              aria-pressed={isActive}
              className={cn(
                "group flex h-10 min-h-[44px] shrink-0 items-center gap-2 rounded-full px-3.5 text-xs font-semibold transition-all duration-200 active:scale-95 border",
                isActive
                  ? "bg-card text-foreground border-border shadow-sm ring-2"
                  : "bg-background/80 text-muted-foreground border-border/60 hover:text-foreground hover:bg-card opacity-60 hover:opacity-100"
              )}
              style={{
                borderColor: isActive ? meta.hex : undefined,
                boxShadow: isActive ? `0 2px 8px -2px ${meta.hex}40` : undefined,
              }}
            >
              <span
                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: meta.hex }}
              >
                <Icon className="h-3 w-3 stroke-[2.2]" />
              </span>
              <span>{meta.label}</span>
              {typeof count === "number" && (
                <span className="text-[10px] font-bold text-muted-foreground bg-muted rounded-full px-1.5 py-0.2">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Secondary Quick Toggles: Open Now & Wheelchair Accessible */}
      <div className="flex items-center gap-2 px-1 text-xs">
        <button
          type="button"
          onClick={() => setShowOnlyOpen(!filters.showOnlyOpen)}
          className={cn(
            "flex h-9 min-h-[36px] items-center gap-1.5 rounded-full px-3 font-semibold transition-all border active:scale-95",
            filters.showOnlyOpen
              ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
              : "bg-card/80 text-muted-foreground border-border hover:text-foreground"
          )}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Open Now</span>
        </button>

        <button
          type="button"
          onClick={() => setShowOnlyWheelchairAccessible(!filters.showOnlyWheelchairAccessible)}
          className={cn(
            "flex h-9 min-h-[36px] items-center gap-1.5 rounded-full px-3 font-semibold transition-all border active:scale-95",
            filters.showOnlyWheelchairAccessible
              ? "bg-sky-500 text-white border-sky-500 shadow-sm"
              : "bg-card/80 text-muted-foreground border-border hover:text-foreground"
          )}
        >
          <Accessibility className="h-3.5 w-3.5" />
          <span>Wheelchair Accessible</span>
        </button>
      </div>
    </div>
  );
}