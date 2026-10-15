"use client";

import React, { useState } from "react";
import type { CampusMarker } from "@/types/map";
import { CATEGORY_META } from "@/types/map";
import { LiveStatusBadge } from "@/components/map/open-status-badge";
import { CrowdBadge } from "@/components/map/crowd-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCampusDateTime } from "@/lib/open-status";
import {
  Phone,
  Navigation,
  Share2,
  Clock,
  Accessibility,
  Building,
  CheckCircle2,
  Copy,
  ExternalLink,
  MapPin,
  Sparkles,
} from "lucide-react";

interface MarkerDetailsSheetProps {
  marker: CampusMarker | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToDirections?: () => void;
}

export function MarkerDetailsSheet({
  marker,
  isOpen,
  onClose,
}: MarkerDetailsSheetProps) {
  const [copied, setCopied] = useState(false);
  const [showDirectionsNotice, setShowDirectionsNotice] = useState(false);

  if (!marker) return null;

  const meta = CATEGORY_META[marker.category];
  const todayKey = getCampusDateTime(new Date()).dayKey;

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({
          title: marker.name,
          text: `Check out ${marker.name} on CampusHub!`,
          url,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard.writeText(`${marker.name} — ${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const dayLabels: Record<string, string> = {
    mon: "Monday",
    tue: "Tuesday",
    wed: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="bottom"
        className="max-w-xl mx-auto rounded-t-3xl border-border bg-card p-5 sm:p-7 max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader className="text-left space-y-3 pb-3 border-b border-border/60">
          {/* Category Tag & Live Status */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold text-white shadow-sm select-none"
              style={{ backgroundColor: meta.hex }}
            >
              <span>{meta.label}</span>
              {marker.subCategory && (
                <span className="opacity-80 font-normal">· {marker.subCategory}</span>
              )}
            </span>

            <div className="flex items-center gap-2">
              <LiveStatusBadge status={marker.openStatus} label={marker.openStatusLabel} />
              <CrowdBadge level={marker.crowdLevel} />
            </div>
          </div>

          <div>
            <SheetTitle className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {marker.name}
            </SheetTitle>
            {marker.buildingName && (
              <p className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground mt-1">
                <Building className="h-4 w-4 text-primary shrink-0" />
                <span>
                  {marker.buildingName}
                  {marker.floorNumber !== null && marker.floorNumber !== undefined && (
                    <span className="ml-1">
                      (Floor {marker.floorNumber === 0 ? "Ground" : marker.floorNumber})
                    </span>
                  )}
                </span>
              </p>
            )}
          </div>
        </SheetHeader>

        {/* Content Body */}
        <div className="py-4 space-y-5 text-sm">
          {/* Description */}
          {marker.description && (
            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
              {marker.description}
            </p>
          )}

          {/* Action Button Bar */}
          <div className="grid grid-cols-3 gap-2">
            {marker.phone ? (
              <Button
                asChild
                variant="outline"
                className="h-11 min-h-[44px] rounded-xl text-xs font-semibold gap-1.5 border-border active:scale-95"
              >
                <a href={`tel:${marker.phone}`}>
                  <Phone className="h-4 w-4 text-emerald-500" />
                  <span>Call</span>
                </a>
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                className="h-11 min-h-[44px] rounded-xl text-xs font-semibold gap-1.5 opacity-50"
              >
                <Phone className="h-4 w-4" />
                <span>No Phone</span>
              </Button>
            )}

            <Button
              variant="default"
              onClick={() => setShowDirectionsNotice(true)}
              className="h-11 min-h-[44px] rounded-xl text-xs font-semibold gap-1.5 active:scale-95 shadow-sm shadow-primary/25"
            >
              <Navigation className="h-4 w-4" />
              <span>Directions</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleShare}
              className="h-11 min-h-[44px] rounded-xl text-xs font-semibold gap-1.5 border-border active:scale-95"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 text-primary" />
                  <span>Share</span>
                </>
              )}
            </Button>
          </div>

          {/* Directions placeholder modal banner */}
          {showDirectionsNotice && (
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-foreground space-y-1.5 animate-fade-in">
              <div className="flex items-center gap-1.5 font-bold text-primary">
                <Sparkles className="h-4 w-4" />
                <span>Turn-by-turn routing is coming soon</span>
              </div>
              <p className="text-muted-foreground leading-snug">
                Walking path graph and wheelchair route navigation will be enabled in Phase 2.
              </p>
            </div>
          )}

          {/* Accessibility Info */}
          <div className="rounded-2xl border border-border/80 bg-muted/40 p-3.5 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Accessibility className="h-3.5 w-3.5 text-primary" />
              <span>Accessibility & Facilities</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <Badge
                variant={marker.wheelchairAccessible ? "success" : "secondary"}
                className="text-[11px] font-medium"
              >
                {marker.wheelchairAccessible ? "Wheelchair Accessible" : "Step Access Only"}
              </Badge>
              {marker.hasRamp && (
                <Badge variant="outline" className="text-[11px] font-medium">
                  Ramp Entry
                </Badge>
              )}
              {marker.hasElevator && (
                <Badge variant="outline" className="text-[11px] font-medium">
                  Elevator Access
                </Badge>
              )}
              {marker.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline" className="text-[11px] font-normal">
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>

          {/* Weekly Operating Hours Breakdown */}
          {marker.operatingHours && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" />
                <span>Operating Hours (Asia/Kolkata)</span>
              </h4>

              {marker.operatingHours.alwaysOpen ? (
                <p className="text-xs font-semibold text-emerald-500">
                  Open 24 Hours, 7 Days a Week
                </p>
              ) : (
                <div className="rounded-2xl border border-border/80 divide-y divide-border/60 overflow-hidden text-xs">
                  {(["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const).map((day) => {
                    const slots = marker.operatingHours?.[day] ?? [];
                    const isToday = day === todayKey;

                    return (
                      <div
                        key={day}
                        className={`flex items-center justify-between px-3.5 py-2 ${
                          isToday ? "bg-primary/10 font-bold text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        <span className="capitalize flex items-center gap-1.5">
                          <span>{dayLabels[day]}</span>
                          {isToday && (
                            <span className="text-[9px] uppercase tracking-wider font-extrabold text-primary bg-primary/20 px-1.5 py-0.2 rounded-full">
                              Today
                            </span>
                          )}
                        </span>
                        <span>
                          {slots.length === 0 ? (
                            <span className="text-rose-500">Closed</span>
                          ) : (
                            slots.map((s) => `${s.open} – ${s.close}`).join(", ")
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Tags */}
          {marker.tags && marker.tags.length > 0 && (
            <div className="pt-1">
              <div className="flex flex-wrap gap-1">
                {marker.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[10px] text-muted-foreground bg-muted rounded-md px-2 py-0.5"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}