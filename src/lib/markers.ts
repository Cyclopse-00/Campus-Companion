/**
 * CampusHub — Marker Data Layer
 * ============================================================
 * Public data access layer for utility markers.
 *
 * RULE 3: Components NEVER import mock JSON directly.
 * They call data functions in src/lib/ so swapping mock to real API is a one-file change.
 * ============================================================
 */

import type { CampusMarker, MarkerCategory, CategoryMeta } from "@/types/map";
import { CATEGORY_META, MARKER_CATEGORIES } from "@/types/map";
import { mockCampusMarkers } from "@/lib/mock";
import { computeOpenStatus } from "@/lib/open-status";

export interface MarkerQueryOptions {
  categories?: MarkerCategory[];
  search?: string;
  openOnly?: boolean;
  wheelchairOnly?: boolean;
  lowCrowdOnly?: boolean;
  buildingId?: string;
}

/**
 * Hydrates a marker with real-time computed open status based on Asia/Kolkata time.
 */
export function hydrateMarkerStatus(marker: CampusMarker, now: Date = new Date()): CampusMarker {
  const statusResult = computeOpenStatus(
    marker.operatingHours,
    marker.holidayOverrides,
    marker.examSeasonHours,
    now
  );

  return {
    ...marker,
    openStatus: statusResult.status,
    openStatusLabel: statusResult.label,
  };
}

/**
 * Fetch all campus markers with optional server/client filters.
 */
export async function getMarkers(options?: MarkerQueryOptions): Promise<CampusMarker[]> {
  // Simulate standard network latency for async feel
  await new Promise((resolve) => setTimeout(resolve, 30));

  const now = new Date();
  let markers = mockCampusMarkers.map((m) => hydrateMarkerStatus(m, now));

  if (!options) return markers;

  // 1. Category filter
  if (options.categories && options.categories.length > 0) {
    const categorySet = new Set(options.categories);
    markers = markers.filter((m) => categorySet.has(m.category));
  }

  // 2. Wheelchair filter
  if (options.wheelchairOnly) {
    markers = markers.filter((m) => m.wheelchairAccessible);
  }

  // 3. Open only filter
  if (options.openOnly) {
    markers = markers.filter(
      (m) => m.openStatus === "OPEN" || m.openStatus === "ALWAYS_OPEN" || m.openStatus === "CLOSING_SOON"
    );
  }

  // 4. Low crowd filter
  if (options.lowCrowdOnly) {
    markers = markers.filter((m) => m.crowdLevel === "EMPTY" || m.crowdLevel === "QUIET");
  }

  // 5. Building filter
  if (options.buildingId) {
    markers = markers.filter((m) => m.buildingId === options.buildingId);
  }

  // 6. Search query
  if (options.search && options.search.trim() !== "") {
    const q = options.search.trim().toLowerCase();
    markers = markers.filter((m) => {
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

  return markers;
}

/**
 * Fetch a single marker by ID.
 */
export async function getMarkerById(id: string): Promise<CampusMarker | null> {
  await new Promise((resolve) => setTimeout(resolve, 20));
  const marker = mockCampusMarkers.find((m) => m.id === id);
  if (!marker) return null;
  return hydrateMarkerStatus(marker);
}

/**
 * Retrieve metadata for all 11 marker categories.
 */
export function getCategories(): CategoryMeta[] {
  return MARKER_CATEGORIES.map((id) => CATEGORY_META[id]);
}
