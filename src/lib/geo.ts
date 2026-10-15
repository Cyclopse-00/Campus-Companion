/**
 * Single source of truth for coordinate conversion and spatial utilities.
 *
 * CONVENTIONS:
 * - GeoJSON / PostGIS standard: [longitude, latitude] (WGS84)
 * - Leaflet standard:           [latitude, longitude] (LatLngTuple)
 *
 * Rule 5: Coordinates are WGS84; convert [lng,lat] vs [lat,lng] in one helper only.
 */

export type LngLat = [longitude: number, latitude: number];
export type LatLng = [latitude: number, longitude: number];

export interface CampusBBox {
  minLng: number;
  minLat: number;
  maxLng: number;
  maxLat: number;
}

/**
 * Single canonical converter between WGS84 [lng, lat] and Leaflet [lat, lng].
 *
 * @param coords Tuple with 2 coordinate numbers
 * @param targetFormat The desired output format ('toLeaflet' or 'toGeoJSON')
 * @returns Tuple converted to target representation
 */
export function convertCoords(
  coords: [number, number],
  targetFormat: "toLeaflet" | "toGeoJSON"
): [number, number] {
  const [first, second] = coords;
  if (targetFormat === "toLeaflet") {
    // GeoJSON [lng, lat] -> Leaflet [lat, lng]
    return [second, first];
  }
  // Leaflet [lat, lng] -> GeoJSON [lng, lat]
  return [second, first];
}

/**
 * Convenience alias: Convert GeoJSON [lng, lat] to Leaflet [lat, lng].
 */
export function toLeafletCoords(lngLat: LngLat): LatLng {
  return convertCoords(lngLat, "toLeaflet") as LatLng;
}

/**
 * Convenience alias: Convert Leaflet [lat, lng] to GeoJSON [lng, lat].
 */
export function toGeoJsonCoords(latLng: LatLng): LngLat {
  return convertCoords(latLng, "toGeoJSON") as LngLat;
}

/**
 * Calculates straight-line distance in meters between two WGS84 coordinates using Haversine formula.
 */
export function calculateHaversineDistance(coord1: LatLng, coord2: LatLng): number {
  const R = 6371e3; // Earth radius in meters
  const [lat1, lon1] = coord1;
  const [lat2, lon2] = coord2;

  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Checks whether a given [longitude, latitude] falls within the campus bounding box.
 */
export function isWithinCampusBounds(coords: LngLat, bbox: CampusBBox): boolean {
  const [lng, lat] = coords;
  return (
    lng >= bbox.minLng &&
    lng <= bbox.maxLng &&
    lat >= bbox.minLat &&
    lat <= bbox.maxLat
  );
}
