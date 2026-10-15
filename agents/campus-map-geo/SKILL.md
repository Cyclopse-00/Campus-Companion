---
name: campus-map-geo
description: Use when building or changing the interactive campus map, GeoJSON data, markers, layers, search, routing, or indoor room lookup. Covers Leaflet setup, data model, coordinate handling, and performance.
---

# Campus Map and Geo

## Data model (PostGIS)
- `Place`: id, name, slug, type (building|hostel|lab|gate|landmark), geom (Point), polygon (optional footprint), description, photoUrl
- `Floor`: id, placeId, level, label, planImageUrl, bounds
- `Room`: id, floorId, code (e.g. "C-304"), name, type, geom (pixel or lat/lng on plan)
- `Path`: id, geom (LineString), accessible (bool), lit (bool), surface
- `PathNode`: id, geom, linked path ids (for the routing graph)

## Map setup
- Leaflet + OSM tiles; fit bounds to the campus bbox; restrict panning with `maxBounds`.
- Load campus layers from `/api/map/geojson`, cached with ETag. Do not hardcode markers in components.
- Use marker clustering above ~150 markers. Use custom SVG icons per category with a text label for accessibility.
- Coordinates: store `[lng, lat]`, convert only in `lib/geo.ts`.

## Search
- Single search box over places, rooms, utilities, faculty offices. Postgres `pg_trgm` for fuzzy match, ranked by exact > prefix > fuzzy.
- Selecting a result flies the map to it, opens a popup, and offers "Directions".

## Routing
- Build a walking graph from `Path` and `PathNode`. Run Dijkstra or A* server-side (`/api/route?from=&to=&accessible=`).
- Respect the `accessible` flag (avoid stairs) and offer a "well-lit route" option for night.
- Return distance, estimated walk time (1.3 m/s default, configurable), and the polyline.
- Fall back to a straight-line estimate if the graph is incomplete, and flag it to admins.

## Indoor lookup
- Image overlay per floor with `L.imageOverlay`. Room search resolves to building + floor + a highlighted spot.
- Show a floor switcher control; default to the floor of the selected room.

## Checks
- All markers fall inside the campus bbox (validate on import).
- Route endpoints snap to the nearest node within 30 m or return a clear error.
- Map is usable with touch (no hover-only interactions) and has a keyboard-accessible list view alternative.
