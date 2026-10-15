/**
 * CampusHub — Buildings & Campus Spatial Data Layer
 * ============================================================
 * Public data access layer for campus buildings, walkways, and boundaries.
 *
 * RULE 3: Components NEVER import mock JSON directly.
 * They call data functions in src/lib/.
 * ============================================================
 */

import type {
  BuildingFeature,
  BuildingCollection,
  WalkwayFeature,
  WalkwayCollection,
} from "@/types/map";
import type { Feature, Polygon, FeatureCollection } from "geojson";
import {
  mockBuildingsGeoJson,
  mockPathwaysGeoJson,
  mockBoundaryGeoJson,
} from "@/lib/mock/geojson-data";

export async function getBuildings(): Promise<BuildingFeature[]> {
  if (typeof window !== "undefined" && typeof fetch === "function") {
    try {
      const res = await fetch("/geojson/buildings.geojson");
      if (res && res.ok) {
        const data: BuildingCollection = await res.json();
        return data.features;
      }
    } catch {
      // fallback
    }
  }
  return mockBuildingsGeoJson.features;
}

export async function getBuildingById(id: string): Promise<BuildingFeature | null> {
  const buildings = await getBuildings();
  return buildings.find((b) => b.properties.id === id || b.properties.code === id) ?? null;
}

export async function getPathways(): Promise<WalkwayFeature[]> {
  if (typeof window !== "undefined" && typeof fetch === "function") {
    try {
      const res = await fetch("/geojson/pathways.geojson");
      if (res && res.ok) {
        const data: WalkwayCollection = await res.json();
        return data.features;
      }
    } catch {
      // fallback
    }
  }
  return mockPathwaysGeoJson.features;
}

export async function getCampusBoundary(): Promise<Feature<Polygon, any> | null> {
  if (typeof window !== "undefined" && typeof fetch === "function") {
    try {
      const res = await fetch("/geojson/campus-boundary.geojson");
      if (res && res.ok) {
        const data: FeatureCollection<Polygon, any> = await res.json();
        return data.features[0] ?? null;
      }
    } catch {
      // fallback
    }
  }
  return mockBoundaryGeoJson.features[0] ?? null;
}