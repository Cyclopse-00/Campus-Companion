/**
 * Map routing engine (A* / Dijkstra over campus walking graph).
 * Client-first, wheelchair accessible and lit route calculation.
 */

import { LatLng } from "@/lib/geo";

export interface RouteRequest {
  from: LatLng;
  to: LatLng;
  accessible?: boolean;
  wellLit?: boolean;
}

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  durationSeconds: number;
}

export interface RouteResult {
  coordinates: LatLng[];
  distanceMeters: number;
  durationMinutes: number;
  steps: RouteStep[];
}

/**
 * Calculates a route between two campus points.
 * (Placeholder skeleton for Phase 0 - full graph implementation in Phase 1)
 */
export async function calculateCampusRoute(request: RouteRequest): Promise<RouteResult> {
  const { from, to } = request;
  return {
    coordinates: [from, to],
    distanceMeters: 100,
    durationMinutes: 2,
    steps: [
      {
        instruction: "Walk straight along the campus pathway",
        distanceMeters: 100,
        durationSeconds: 120,
      },
    ],
  };
}
