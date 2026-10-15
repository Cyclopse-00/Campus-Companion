import { describe, it, expect } from "vitest";
import {
  convertCoords,
  toLeafletCoords,
  toGeoJsonCoords,
  calculateHaversineDistance,
  isWithinCampusBounds,
  LngLat,
  LatLng,
  CampusBBox,
} from "@/lib/geo";

describe("Geo utility - coordinate conversion and bounds", () => {
  it("converts WGS84 [lng, lat] to Leaflet [lat, lng]", () => {
    const geoJsonPoint: LngLat = [78.4772, 17.4065];
    const leafletPoint = toLeafletCoords(geoJsonPoint);

    expect(leafletPoint).toEqual([17.4065, 78.4772]);
    expect(leafletPoint[0]).toBe(17.4065); // latitude first
    expect(leafletPoint[1]).toBe(78.4772); // longitude second
  });

  it("converts Leaflet [lat, lng] to WGS84 GeoJSON [lng, lat]", () => {
    const leafletPoint: LatLng = [17.4065, 78.4772];
    const geoJsonPoint = toGeoJsonCoords(leafletPoint);

    expect(geoJsonPoint).toEqual([78.4772, 17.4065]);
    expect(geoJsonPoint[0]).toBe(78.4772); // longitude first
    expect(geoJsonPoint[1]).toBe(17.4065); // latitude second
  });

  it("handles generic convertCoords helper both ways", () => {
    const original: [number, number] = [10, 20];
    const toLeaflet = convertCoords(original, "toLeaflet");
    expect(toLeaflet).toEqual([20, 10]);

    const toGeo = convertCoords(toLeaflet, "toGeoJSON");
    expect(toGeo).toEqual([10, 20]);
  });

  it("calculates realistic Haversine distance between two campus points", () => {
    const pointA: LatLng = [17.4065, 78.4772];
    const pointB: LatLng = [17.407, 78.478];

    const distance = calculateHaversineDistance(pointA, pointB);
    expect(distance).toBeGreaterThan(50);
    expect(distance).toBeLessThan(200);
  });

  it("accurately checks if coordinate falls within campus bounding box", () => {
    const campusBBox: CampusBBox = {
      minLng: 78.47,
      minLat: 17.4,
      maxLng: 78.49,
      maxLat: 17.42,
    };

    const insidePoint: LngLat = [78.4772, 17.4065];
    const outsidePoint: LngLat = [78.5, 17.45];

    expect(isWithinCampusBounds(insidePoint, campusBBox)).toBe(true);
    expect(isWithinCampusBounds(outsidePoint, campusBBox)).toBe(false);
  });
});
