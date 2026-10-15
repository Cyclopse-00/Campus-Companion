import { describe, it, expect } from "vitest";
import { getMarkers, getMarkerById, getCategories } from "@/lib/markers";
import { getBuildings, getBuildingById, getPathways, getCampusBoundary } from "@/lib/buildings";
import { MARKER_CATEGORIES } from "@/types/map";

describe("Data Access Layer (src/lib/markers.ts & src/lib/buildings.ts)", () => {
  describe("getMarkers()", () => {
    it("returns markers with computed openStatus", async () => {
      const markers = await getMarkers();
      expect(markers.length).toBeGreaterThan(0);
      for (const m of markers) {
        expect(m.id).toBeDefined();
        expect(m.name).toBeDefined();
        expect(m.category).toBeDefined();
        expect(m.openStatus).toBeDefined();
        expect(m.openStatusLabel).toBeDefined();
      }
    });

    it("covers all 11 utility categories across the seed dataset", async () => {
      const markers = await getMarkers();
      const presentCategories = new Set(markers.map((m) => m.category));
      for (const cat of MARKER_CATEGORIES) {
        expect(presentCategories.has(cat)).toBe(true);
      }
    });

    it("filters markers by category", async () => {
      const foodMarkers = await getMarkers({ categories: ["FOOD"] });
      expect(foodMarkers.length).toBeGreaterThan(0);
      expect(foodMarkers.every((m) => m.category === "FOOD")).toBe(true);
    });

    it("filters markers by wheelchair accessibility", async () => {
      const accessibleMarkers = await getMarkers({ wheelchairOnly: true });
      expect(accessibleMarkers.length).toBeGreaterThan(0);
      expect(accessibleMarkers.every((m) => m.wheelchairAccessible)).toBe(true);
    });

    it("searches markers by query across name, description, tags", async () => {
      const results = await getMarkers({ search: "canteen" });
      expect(results.length).toBeGreaterThan(0);
      for (const m of results) {
        const match =
          m.name.toLowerCase().includes("canteen") ||
          (m.shortName && m.shortName.toLowerCase().includes("canteen")) ||
          (m.description && m.description.toLowerCase().includes("canteen")) ||
          m.tags.some((t) => t.toLowerCase().includes("canteen"));
        expect(match).toBe(true);
      }
    });

    it("fetches single marker by id", async () => {
      const marker = await getMarkerById("m_food_1");
      expect(marker).not.toBeNull();
      expect(marker?.id).toBe("m_food_1");
      expect(marker?.category).toBe("FOOD");
      expect(marker?.openStatus).toBeDefined();
    });

    it("returns null for non-existent marker id", async () => {
      const marker = await getMarkerById("non_existent_id");
      expect(marker).toBeNull();
    });
  });

  describe("getCategories()", () => {
    it("returns metadata for all 11 categories", () => {
      const categories = getCategories();
      expect(categories.length).toBe(11);
      for (const c of categories) {
        expect(c.id).toBeDefined();
        expect(c.label).toBeDefined();
        expect(c.hex).toBeDefined();
        expect(c.icon).toBeDefined();
      }
    });
  });

  describe("getBuildings() & Spatial features", () => {
    it("loads campus buildings GeoJSON", async () => {
      const buildings = await getBuildings();
      expect(buildings.length).toBeGreaterThanOrEqual(5);
      for (const b of buildings) {
        expect(b.properties.id).toBeDefined();
        expect(b.properties.name).toBeDefined();
        expect(b.geometry.type).toBe("Polygon");
      }
    });

    it("retrieves a building by id or code", async () => {
      const b = await getBuildingById("blk_a");
      expect(b).not.toBeNull();
      expect(b?.properties.code).toBe("BLK_A");
    });

    it("loads pathways GeoJSON with wheelchair accessibility flag on every segment", async () => {
      const pathways = await getPathways();
      expect(pathways.length).toBeGreaterThan(0);
      for (const p of pathways) {
        expect(p.geometry.type).toBe("LineString");
        expect(typeof p.properties.isWheelchairAccessible).toBe("boolean");
      }
    });

    it("loads campus boundary polygon", async () => {
      const boundary = await getCampusBoundary();
      expect(boundary).not.toBeNull();
      expect(boundary?.geometry.type).toBe("Polygon");
    });
  });
});
