"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { getMarkers } from "@/lib/markers";
import { getBuildings, getPathways, getCampusBoundary } from "@/lib/buildings";
import type { CampusMarker, BuildingFeature, WalkwayFeature, MarkerCategory } from "@/types/map";
import { useMapStore } from "@/store/map-store";
import { UtilityFilterBar } from "@/components/map/filter-drawer";
import { MarkerDetailsSheet } from "@/components/map/marker-popup";
import { LiveStatusBadge } from "@/components/map/open-status-badge";
import { CrowdBadge } from "@/components/map/crowd-badge";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorBoundary } from "@/components/shared/error-boundary";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_META } from "@/types/map";
import {
  Search,
  X,
  Map as MapIcon,
  List as ListIcon,
  SlidersHorizontal,
  Building,
  Navigation,
  Phone,
  CheckCircle2,
} from "lucide-react";
import type { Feature, Polygon } from "geojson";

// Client-only dynamic import for CampusMap (Leaflet cannot run during SSR)
const CampusMap = dynamic(
  () => import("@/components/map/campus-map").then((mod) => mod.CampusMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[calc(100vh-14rem)] w-full items-center justify-center bg-muted/30">
        <LoadingSpinner size="lg" label="Loading interactive campus map..." />
      </div>
    ),
  }
);

export default function MapPage() {
  const { filters, setSearchQuery, resetFilters } = useMapStore();
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [allMarkers, setAllMarkers] = useState<CampusMarker[]>([]);
  const [buildings, setBuildings] = useState<BuildingFeature[]>([]);
  const [pathways, setPathways] = useState<WalkwayFeature[]>([]);
  const [boundary, setBoundary] = useState<Feature<Polygon, any> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMarker, setSelectedMarker] = useState<CampusMarker | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Load campus spatial data on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setIsLoading(true);
      try {
        const [markersData, buildingsData, pathwaysData, boundaryData] = await Promise.all([
          getMarkers(),
          getBuildings(),
          getPathways(),
          getCampusBoundary(),
        ]);
        if (isMounted) {
          setAllMarkers(markersData);
          setBuildings(buildingsData);
          setPathways(pathwaysData);
          setBoundary(boundaryData);
        }
      } catch (err) {
        console.error("Failed to load map data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<MarkerCategory, number>> = {};
    for (const m of allMarkers) {
      counts[m.category] = (counts[m.category] || 0) + 1;
    }
    return counts;
  }, [allMarkers]);

  // Client-side filtering
  const filteredMarkers = useMemo(() => {
    let result = allMarkers;

    // 1. Category Filter
    if (filters.activeCategories.size > 0) {
      result = result.filter((m) => filters.activeCategories.has(m.category));
    } else {
      return [];
    }

    // 2. Open Now Filter
    if (filters.showOnlyOpen) {
      result = result.filter(
        (m) => m.openStatus === "OPEN" || m.openStatus === "ALWAYS_OPEN" || m.openStatus === "CLOSING_SOON"
      );
    }

    // 3. Wheelchair Filter
    if (filters.showOnlyWheelchairAccessible) {
      result = result.filter((m) => m.wheelchairAccessible);
    }

    // 4. Search Filter
    if (filters.searchQuery.trim() !== "") {
      const q = filters.searchQuery.trim().toLowerCase();
      result = result.filter((m) => {
        return (
          m.name.toLowerCase().includes(q) ||
          (m.shortName && m.shortName.toLowerCase().includes(q)) ||
          (m.description && m.description.toLowerCase().includes(q)) ||
          (m.subCategory && m.subCategory.toLowerCase().includes(q)) ||
          (m.buildingName && m.buildingName.toLowerCase().includes(q)) ||
          m.tags.some((t) => t.toLowerCase().includes(q)) ||
          m.amenities.some((a) => a.toLowerCase().includes(q))
        );
      });
    }

    return result;
  }, [allMarkers, filters]);

  const handleMarkerSelect = (marker: CampusMarker) => {
    setSelectedMarker(marker);
    setIsSheetOpen(true);
  };

  return (
    <ErrorBoundary fallbackTitle="Error loading campus map">
      <div className="flex flex-col h-[calc(100vh-3.5rem)] bg-background">
        {/* Top Controls: Search Bar & List/Map Toggle */}
        <div className="px-3.5 sm:px-6 pt-3 pb-2 space-y-2.5 border-b border-border/50 bg-background/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            {/* Search Input Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search food, ATMs, print, library, wifi..."
                value={filters.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-8 h-11 min-h-[44px] rounded-2xl bg-muted/50 border-border/60 text-xs sm:text-sm focus-visible:ring-primary shadow-sm"
              />
              {filters.searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground min-h-[30px] min-w-[30px] flex items-center justify-center"
                >
                  <X className="h-3.5 w-3.5" />
                  <span className="sr-only">Clear search</span>
                </button>
              )}
            </div>

            {/* List / Map View Switcher Button (Rule 4: Every map feature has a list/text alternative) */}
            <Button
              type="button"
              variant={viewMode === "list" ? "default" : "outline"}
              onClick={() => setViewMode(viewMode === "map" ? "list" : "map")}
              aria-label={viewMode === "map" ? "Switch to list view alternative" : "Switch to map view"}
              title={viewMode === "map" ? "List View Alternative" : "Interactive Map"}
              className="h-11 min-h-[44px] px-3.5 rounded-2xl gap-1.5 shrink-0 text-xs font-semibold shadow-sm active:scale-95"
            >
              {viewMode === "map" ? (
                <>
                  <ListIcon className="h-4 w-4" />
                  <span className="hidden xs:inline">List View</span>
                </>
              ) : (
                <>
                  <MapIcon className="h-4 w-4" />
                  <span className="hidden xs:inline">Map View</span>
                </>
              )}
            </Button>
          </div>

          {/* 11 Utility Filter Chips Bar */}
          <UtilityFilterBar categoryCounts={categoryCounts} />

          {/* Result Count Banner */}
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-0.5 pt-0.5">
            <span>
              Showing <strong className="text-foreground">{filteredMarkers.length}</strong> of{" "}
              {allMarkers.length} campus facilities
            </span>
            {(filters.searchQuery || filters.showOnlyOpen || filters.showOnlyWheelchairAccessible) && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-primary hover:underline font-semibold"
              >
                Reset filters
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex h-full w-full items-center justify-center">
              <LoadingSpinner size="lg" label="Loading facilities & map layers..." />
            </div>
          ) : viewMode === "map" ? (
            /* Interactive Leaflet Map */
            <CampusMap
              markers={filteredMarkers}
              buildings={buildings}
              pathways={pathways}
              boundary={boundary}
              onSelectMarker={handleMarkerSelect}
              className="h-full w-full"
            />
          ) : (
            /* Accessible List View Alternative */
            <div className="h-full w-full overflow-y-auto p-3.5 sm:p-6 space-y-3">
              {filteredMarkers.length === 0 ? (
                <EmptyState
                  title="No places match your filters"
                  description="Try enabling more category layers or clearing your search term to see facilities."
                  actionLabel="Clear All Filters"
                  onAction={resetFilters}
                  className="my-8"
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredMarkers.map((marker) => {
                    const meta = CATEGORY_META[marker.category];

                    return (
                      <div
                        key={marker.id}
                        onClick={() => handleMarkerSelect(marker)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleMarkerSelect(marker);
                          }
                        }}
                        tabIndex={0}
                        role="button"
                        className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:border-primary/40 active:scale-[0.99] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary select-none"
                      >
                        <div className="space-y-2">
                          {/* Header row: category badge + open status */}
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-sm"
                              style={{ backgroundColor: meta.hex }}
                            >
                              <span>{meta.label}</span>
                            </span>
                            <LiveStatusBadge
                              status={marker.openStatus}
                              label={marker.openStatusLabel}
                            />
                          </div>

                          {/* Marker title & building */}
                          <div>
                            <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                              {marker.name}
                            </h4>
                            {marker.buildingName && (
                              <p className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                                <Building className="h-3 w-3 text-primary shrink-0" />
                                <span className="truncate">{marker.buildingName}</span>
                              </p>
                            )}
                          </div>

                          {/* Short description */}
                          {marker.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {marker.description}
                            </p>
                          )}
                        </div>

                        {/* Footer row: Crowd level & Accessibility badge */}
                        <div className="mt-3.5 pt-2.5 border-t border-border/50 flex items-center justify-between">
                          <CrowdBadge level={marker.crowdLevel} />
                          <span className="text-[11px] text-primary font-semibold group-hover:underline flex items-center gap-0.5">
                            Details & Hours →
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Marker Details Bottom Sheet */}
        <MarkerDetailsSheet
          marker={selectedMarker}
          isOpen={isSheetOpen}
          onClose={() => setIsSheetOpen(false)}
        />
      </div>
    </ErrorBoundary>
  );
}