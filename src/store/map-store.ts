/**
 * CampusHub — Map Store (Zustand)
 * ============================================================
 * Global client-side state for the interactive campus map.
 * Handles: active category filters, view mode, selected markers,
 * indoor floor navigation, active route, and user geolocation.
 * ============================================================
 */
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  MarkerCategory,
  MapFilters,
  MapUIState,
  MapViewMode,
  CampusRoute,
  LatLng,
  IndoorSearchResult,
  CampusMarker,
} from "@/types/map";
import { MARKER_CATEGORIES } from "@/types/map";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MapStoreActions {
  // Filter actions
  toggleCategory: (category: MarkerCategory) => void;
  setActiveCategories: (categories: MarkerCategory[]) => void;
  enableAllCategories: () => void;
  disableAllCategories: () => void;
  setShowOnlyOpen: (value: boolean) => void;
  setShowOnlyWheelchairAccessible: (value: boolean) => void;
  setShowOnlyLowCrowd: (value: boolean) => void;
  setSearchQuery: (query: string) => void;
  resetFilters: () => void;

  // View mode
  setViewMode: (mode: MapViewMode) => void;

  // Marker selection
  selectMarker: (marker: CampusMarker | null) => void;
  selectMarkerId: (id: string | null) => void;

  // Building / Indoor
  selectBuilding: (buildingId: string | null) => void;
  setSelectedFloor: (floor: number) => void;

  // Routing
  setActiveRoute: (route: CampusRoute | null) => void;
  clearRoute: () => void;

  // Geolocation
  setUserLocation: (location: LatLng | null) => void;
  setIsLocatingUser: (locating: boolean) => void;
}

export type MapStore = MapUIState & {
  // Derived helpers (not persisted)
  selectedMarker: CampusMarker | null;
} & MapStoreActions;

// ---------------------------------------------------------------------------
// Default filter state
// ---------------------------------------------------------------------------

const defaultFilters: MapFilters = {
  activeCategories: new Set(MARKER_CATEGORIES), // all on by default
  showOnlyOpen: false,
  showOnlyWheelchairAccessible: false,
  showOnlyLowCrowd: false,
  searchQuery: "",
  selectedBuildingId: null,
};

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useMapStore = create<MapStore>()(
  persist(
    (set, get) => ({
      // --- State ---
      viewMode: "OUTDOOR",
      filters: defaultFilters,
      selectedMarkerId: null,
      selectedMarker: null,
      selectedBuildingId: null,
      selectedFloorNumber: 0,
      activeRoute: null,
      isLocatingUser: false,
      userLocation: null,

      // --- Filter Actions ---
      toggleCategory: (category) =>
        set((state) => {
          const next = new Set(state.filters.activeCategories);
          if (next.has(category)) {
            next.delete(category);
          } else {
            next.add(category);
          }
          return { filters: { ...state.filters, activeCategories: next } };
        }),

      setActiveCategories: (categories) =>
        set((state) => ({
          filters: { ...state.filters, activeCategories: new Set(categories) },
        })),

      enableAllCategories: () =>
        set((state) => ({
          filters: { ...state.filters, activeCategories: new Set(MARKER_CATEGORIES) },
        })),

      disableAllCategories: () =>
        set((state) => ({
          filters: { ...state.filters, activeCategories: new Set<MarkerCategory>() },
        })),

      setShowOnlyOpen: (value) =>
        set((state) => ({ filters: { ...state.filters, showOnlyOpen: value } })),

      setShowOnlyWheelchairAccessible: (value) =>
        set((state) => ({
          filters: { ...state.filters, showOnlyWheelchairAccessible: value },
        })),

      setShowOnlyLowCrowd: (value) =>
        set((state) => ({ filters: { ...state.filters, showOnlyLowCrowd: value } })),

      setSearchQuery: (query) =>
        set((state) => ({ filters: { ...state.filters, searchQuery: query } })),

      resetFilters: () =>
        set({ filters: defaultFilters }),

      // --- View Mode ---
      setViewMode: (mode) => set({ viewMode: mode }),

      // --- Marker Selection ---
      selectMarker: (marker) =>
        set({
          selectedMarker: marker,
          selectedMarkerId: marker?.id ?? null,
        }),

      selectMarkerId: (id) =>
        set({ selectedMarkerId: id, selectedMarker: null }),

      // --- Building / Indoor ---
      selectBuilding: (buildingId) =>
        set({
          selectedBuildingId: buildingId,
          viewMode: buildingId ? "INDOOR" : "OUTDOOR",
          selectedFloorNumber: 0,
        }),

      setSelectedFloor: (floor) => set({ selectedFloorNumber: floor }),

      // --- Routing ---
      setActiveRoute: (route) =>
        set({ activeRoute: route, viewMode: "ROUTE" }),

      clearRoute: () =>
        set({ activeRoute: null, viewMode: "OUTDOOR" }),

      // --- Geolocation ---
      setUserLocation: (location) => set({ userLocation: location }),
      setIsLocatingUser: (locating) => set({ isLocatingUser: locating }),
    }),
    {
      name: "campushub-map-store",
      storage: createJSONStorage(() => localStorage),
      // Only persist filter preferences (not ephemeral state)
      partialize: (state) => ({
        filters: {
          ...state.filters,
          // Serialize Set → Array for JSON storage
          activeCategories: Array.from(state.filters.activeCategories),
        },
      }),
      // Rehydrate Array → Set after load
      onRehydrateStorage: () => (state) => {
        if (state?.filters?.activeCategories) {
          state.filters.activeCategories = new Set(
            state.filters.activeCategories as unknown as MarkerCategory[]
          );
        }
      },
    }
  )
);

// ---------------------------------------------------------------------------
// Selector hooks (for efficient re-render isolation)
// ---------------------------------------------------------------------------

export const useMapFilters = () => useMapStore((s) => s.filters);
export const useActiveCategories = () =>
  useMapStore((s) => s.filters.activeCategories);
export const useSelectedMarker = () => useMapStore((s) => s.selectedMarker);
export const useMapViewMode = () => useMapStore((s) => s.viewMode);
export const useActiveRoute = () => useMapStore((s) => s.activeRoute);
export const useUserLocation = () => useMapStore((s) => s.userLocation);
