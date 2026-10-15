/**
 * CampusHub — Map Type Definitions
 * ============================================================
 * Central type registry for:
 *   - All 11 utility marker categories (with metadata)
 *   - GeoJSON campus layers (buildings, walkways, zones)
 *   - Indoor floor plan types
 *   - Leaflet-specific config & overlay types
 *   - Route & accessibility types
 * ============================================================
 */

import type { FeatureCollection, Feature, Point, Polygon, LineString } from "geojson";

// ==============================================================================
// 1. MARKER CATEGORIES — 11 Utility Layers
// ==============================================================================

export const MARKER_CATEGORIES = [
  "FOOD",
  "STATIONERY",
  "MONEY",
  "HEALTH",
  "WATER_SANITATION",
  "TRANSPORT",
  "STUDY",
  "SERVICES",
  "RECREATION",
  "CHARGING_WIFI",
  "SAFETY",
] as const;

export type MarkerCategory = (typeof MARKER_CATEGORIES)[number];

/** Display metadata for each category (icon name, label, color, sub-types) */
export interface CategoryMeta {
  id: MarkerCategory;
  label: string;
  /** Lucide icon name */
  icon: string;
  /** Tailwind bg color class for the map pin */
  color: string;
  /** Hex color for Leaflet marker tint */
  hex: string;
  description: string;
  subCategories: string[];
}

/**
 * Complete category metadata map.
 * Import and spread wherever you need labels/icons in components.
 */
export const CATEGORY_META: Record<MarkerCategory, CategoryMeta> = {
  FOOD: {
    id: "FOOD",
    label: "Food & Canteen",
    icon: "UtensilsCrossed",
    color: "bg-orange-500",
    hex: "#f97316",
    description: "Canteens, cafeterias, tuck shops, vending machines",
    subCategories: ["Canteen", "Cafeteria", "Tuck Shop", "Vending Machine", "Food Court"],
  },
  STATIONERY: {
    id: "STATIONERY",
    label: "Stationery & Print",
    icon: "BookOpen",
    color: "bg-yellow-500",
    hex: "#eab308",
    description: "Stationery shops, photocopy & print centres, book stores",
    subCategories: ["Stationery Shop", "Print & Photocopy", "Book Store"],
  },
  MONEY: {
    id: "MONEY",
    label: "Money & Finance",
    icon: "Banknote",
    color: "bg-green-500",
    hex: "#22c55e",
    description: "ATMs, bank branches, fee payment counters",
    subCategories: ["ATM", "Bank Branch", "Fee Counter", "Cash Counter"],
  },
  HEALTH: {
    id: "HEALTH",
    label: "Health & Medical",
    icon: "Stethoscope",
    color: "bg-red-500",
    hex: "#ef4444",
    description: "Medical centre, first aid, pharmacy, counselling",
    subCategories: ["Medical Centre", "First Aid", "Pharmacy", "Counselling", "Dispensary"],
  },
  WATER_SANITATION: {
    id: "WATER_SANITATION",
    label: "Water & Sanitation",
    icon: "Droplets",
    color: "bg-sky-500",
    hex: "#0ea5e9",
    description: "Drinking water, RO purifiers, washrooms, restrooms",
    subCategories: ["Drinking Water", "RO Purifier", "Washroom", "Gender-Neutral Restroom"],
  },
  TRANSPORT: {
    id: "TRANSPORT",
    label: "Transport",
    icon: "Bus",
    color: "bg-indigo-500",
    hex: "#6366f1",
    description: "Bus stops, parking lots, cycle stands, auto/cab pickup points",
    subCategories: ["Bus Stop", "Parking", "Cycle Stand", "Cab Pickup", "Shuttle Stop"],
  },
  STUDY: {
    id: "STUDY",
    label: "Study Spaces",
    icon: "GraduationCap",
    color: "bg-violet-500",
    hex: "#8b5cf6",
    description: "Libraries, reading rooms, seminar halls, open study zones",
    subCategories: ["Library", "Reading Room", "Seminar Hall", "Open Study Zone", "Lab"],
  },
  SERVICES: {
    id: "SERVICES",
    label: "Services & Admin",
    icon: "Building2",
    color: "bg-slate-500",
    hex: "#64748b",
    description: "Admin office, registrar, ID card, certificates, hostel office",
    subCategories: [
      "Admin Office",
      "Registrar",
      "ID Card",
      "Certificate Counter",
      "Hostel Office",
      "Placement Cell",
    ],
  },
  RECREATION: {
    id: "RECREATION",
    label: "Recreation & Sports",
    icon: "Dumbbell",
    color: "bg-pink-500",
    hex: "#ec4899",
    description: "Gym, sports fields, courts, auditorium, student lounge",
    subCategories: [
      "Gym",
      "Sports Field",
      "Basketball Court",
      "Badminton Court",
      "Auditorium",
      "Student Lounge",
    ],
  },
  CHARGING_WIFI: {
    id: "CHARGING_WIFI",
    label: "Charging & Wi-Fi",
    icon: "Wifi",
    color: "bg-teal-500",
    hex: "#14b8a6",
    description: "Charging stations, strong Wi-Fi spots, computer labs",
    subCategories: ["Charging Station", "Wi-Fi Hotspot", "Computer Lab"],
  },
  SAFETY: {
    id: "SAFETY",
    label: "Safety & Security",
    icon: "Shield",
    color: "bg-rose-600",
    hex: "#e11d48",
    description: "Security posts, CCTV zones, emergency phones, safe walk zones",
    subCategories: [
      "Security Post",
      "Emergency Phone",
      "CCTV Zone",
      "Safe Walk Route",
      "Fire Extinguisher",
    ],
  },
};

// ==============================================================================
// 2. MAP MARKER — Client-Side Shape
// ==============================================================================

export interface LatLng {
  lat: number;
  lng: number;
}

export interface MarkerOperatingHours {
  alwaysOpen?: boolean;
  mon?: Array<{ open: string; close: string }>;
  tue?: Array<{ open: string; close: string }>;
  wed?: Array<{ open: string; close: string }>;
  thu?: Array<{ open: string; close: string }>;
  fri?: Array<{ open: string; close: string }>;
  sat?: Array<{ open: string; close: string }>;
  sun?: Array<{ open: string; close: string }>;
}

export interface HolidayOverride {
  date: string; // "YYYY-MM-DD"
  label?: string;
  status: "CLOSED" | "OPEN_CUSTOM";
  hours?: Array<{ open: string; close: string }>;
}

export type CrowdLevel = "EMPTY" | "QUIET" | "MODERATE" | "BUSY" | "VERY_BUSY";
export type MarkerStatus = "ACTIVE" | "INACTIVE" | "PENDING_REVIEW" | "ARCHIVED";
export type OpenStatusCode = "OPEN" | "CLOSING_SOON" | "CLOSED" | "ALWAYS_OPEN";

/** Full map marker as returned from the API / Prisma */
export interface CampusMarker {
  id: string;
  name: string;
  shortName?: string | null;
  description?: string | null;
  category: MarkerCategory;
  subCategory?: string | null;
  lat: number;
  lng: number;
  buildingId?: string | null;
  buildingName?: string | null;
  floorNumber?: number | null;
  address?: string | null;
  phone?: string | null;
  website?: string | null;
  imageUrls: string[];
  thumbnailUrl?: string | null;
  operatingHours?: MarkerOperatingHours | null;
  holidayOverrides?: HolidayOverride[] | null;
  examSeasonHours?: MarkerOperatingHours | null;
  wheelchairAccessible: boolean;
  hasRamp: boolean;
  hasElevator: boolean;
  crowdLevel: CrowdLevel;
  crowdUpdatedAt?: string | null;
  status: MarkerStatus;
  tags: string[];
  amenities: string[];
  avgRating?: number | null;
  ratingCount: number;
  // Computed fields (added client-side)
  openStatus?: OpenStatusCode;
  openStatusLabel?: string;
}

/** Lightweight marker used for map rendering (fewer fields = faster re-renders) */
export interface MarkerPin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category: MarkerCategory;
  status: MarkerStatus;
  openStatus?: OpenStatusCode;
  wheelchairAccessible: boolean;
  crowdLevel: CrowdLevel;
}

// ==============================================================================
// 3. GEOJSON CAMPUS LAYERS
// ==============================================================================

/** Properties attached to each building Feature in campus.buildings.geojson */
export interface BuildingGeoJsonProperties {
  id: string;
  name: string;
  code: string;
  totalFloors: number;
  hasElevator: boolean;
  wheelchairEntry: boolean;
  thumbnailUrl?: string;
}

/** Properties attached to each walkway Feature in campus.walkways.geojson */
export interface WalkwayGeoJsonProperties {
  id: string;
  name?: string;
  type: "FOOTPATH" | "ROAD" | "CYCLE_LANE" | "EMERGENCY_ACCESS";
  isWheelchairAccessible: boolean;
  surface?: "CONCRETE" | "ASPHALT" | "GRAVEL" | "GRASS";
  width?: number; // metres
}

/** Properties for campus zone polygons (academic, sports, hostel, etc.) */
export interface ZoneGeoJsonProperties {
  id: string;
  name: string;
  type: "ACADEMIC" | "HOSTEL" | "SPORTS" | "ADMIN" | "COMMERCIAL" | "PARKING" | "GREEN";
  color?: string; // fill hex
}

export type BuildingFeature = Feature<Polygon, BuildingGeoJsonProperties>;
export type WalkwayFeature = Feature<LineString, WalkwayGeoJsonProperties>;
export type ZoneFeature = Feature<Polygon, ZoneGeoJsonProperties>;
export type MarkerFeature = Feature<Point, CampusMarker>;

export type BuildingCollection = FeatureCollection<Polygon, BuildingGeoJsonProperties>;
export type WalkwayCollection = FeatureCollection<LineString, WalkwayGeoJsonProperties>;
export type ZoneCollection = FeatureCollection<Polygon, ZoneGeoJsonProperties>;
export type MarkerCollection = FeatureCollection<Point, CampusMarker>;

/** All GeoJSON layers bundled together */
export interface CampusGeoJsonLayers {
  buildings: BuildingCollection;
  walkways: WalkwayCollection;
  zones: ZoneCollection;
  markers: MarkerCollection;
}

// ==============================================================================
// 4. INDOOR FLOOR PLAN TYPES
// ==============================================================================

export interface FloorPlan {
  id: string;
  buildingId: string;
  buildingName: string;
  buildingCode: string;
  floorNumber: number;
  floorLabel: string;
  /** URL to floor plan raster image (PNG/JPEG) for Leaflet ImageOverlay */
  imageUrl?: string | null;
  /** Leaflet LatLngBounds: [[south, west], [north, east]] */
  imageBounds?: [[number, number], [number, number]] | null;
  svgData?: string | null;
  rooms: IndoorRoom[];
}

export interface IndoorRoom {
  id: string;
  floorPlanId: string;
  roomNumber: string;
  roomName?: string | null;
  roomType?: RoomType | null;
  lat?: number | null;
  lng?: number | null;
  /** Pixel X coordinate on floor plan image (for SVG overlay) */
  pixelX?: number | null;
  /** Pixel Y coordinate on floor plan image (for SVG overlay) */
  pixelY?: number | null;
  capacity?: number | null;
  isWheelchairAccessible: boolean;
}

export type RoomType =
  | "CLASSROOM"
  | "LAB"
  | "OFFICE"
  | "WASHROOM"
  | "STORE"
  | "SEMINAR_HALL"
  | "LIBRARY"
  | "COMMON_ROOM"
  | "OTHER";

/** Search result from the indoor room lookup */
export interface IndoorSearchResult {
  buildingId: string;
  buildingName: string;
  buildingCode: string;
  floorNumber: number;
  floorLabel: string;
  room: IndoorRoom;
  /** Display path e.g. "Block C → 3rd Floor → Room 304" */
  breadcrumb: string;
  /** Walking distance estimate in metres (from current location if available) */
  distanceMetres?: number;
}

// ==============================================================================
// 5. CAMPUS MAP CONFIG
// ==============================================================================

export interface MapConfig {
  defaultCenter: LatLng;
  defaultZoom: number;
  minZoom: number;
  maxZoom: number;
  /** Leaflet tile layer URL template */
  tileUrl: string;
  /** Tile layer attribution */
  attribution: string;
  /** Optional campus boundary for restricting panning */
  bounds?: [[number, number], [number, number]];
}

export const DEFAULT_MAP_CONFIG: MapConfig = {
  defaultCenter: {
    lat: parseFloat(process.env.NEXT_PUBLIC_MAP_DEFAULT_LAT ?? "17.4065"),
    lng: parseFloat(process.env.NEXT_PUBLIC_MAP_DEFAULT_LNG ?? "78.4772"),
  },
  defaultZoom: parseInt(process.env.NEXT_PUBLIC_MAP_DEFAULT_ZOOM ?? "16", 10),
  minZoom: parseInt(process.env.NEXT_PUBLIC_MAP_MIN_ZOOM ?? "14", 10),
  maxZoom: parseInt(process.env.NEXT_PUBLIC_MAP_MAX_ZOOM ?? "22", 10),
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// ==============================================================================
// 6. ROUTING & ACCESSIBILITY
// ==============================================================================

export interface RouteOptions {
  wheelchairFriendly: boolean;
  avoidStairs: boolean;
  preferIndoor: boolean;
}

export interface RouteStep {
  instruction: string;
  distanceMetres: number;
  durationSeconds: number;
  maneuver?: "straight" | "left" | "right" | "slight_left" | "slight_right" | "u_turn";
  waypoint: LatLng;
  isIndoor?: boolean;
  floorChange?: { from: number; to: number; via: "elevator" | "ramp" | "stairs" };
}

export interface CampusRoute {
  from: LatLng | IndoorSearchResult;
  to: LatLng | IndoorSearchResult;
  options: RouteOptions;
  steps: RouteStep[];
  totalDistanceMetres: number;
  totalDurationMinutes: number;
  geometry: LineString;
  warnings?: string[];
}

// ==============================================================================
// 7. MAP UI STATE (used by Zustand map store)
// ==============================================================================

export interface MapFilters {
  activeCategories: Set<MarkerCategory>;
  showOnlyOpen: boolean;
  showOnlyWheelchairAccessible: boolean;
  showOnlyLowCrowd: boolean;
  searchQuery: string;
  selectedBuildingId: string | null;
}

export type MapViewMode = "OUTDOOR" | "INDOOR" | "ROUTE";

export interface MapUIState {
  viewMode: MapViewMode;
  filters: MapFilters;
  selectedMarkerId: string | null;
  selectedBuildingId: string | null;
  selectedFloorNumber: number;
  activeRoute: CampusRoute | null;
  isLocatingUser: boolean;
  userLocation: LatLng | null;
}

// ==============================================================================
// 8. CROWD LEVEL METADATA
// ==============================================================================

export const CROWD_LEVEL_META: Record<
  CrowdLevel,
  { label: string; color: string; dots: number }
> = {
  EMPTY:     { label: "Empty",     color: "text-slate-400",   dots: 1 },
  QUIET:     { label: "Quiet",     color: "text-emerald-400", dots: 2 },
  MODERATE:  { label: "Moderate",  color: "text-yellow-400",  dots: 3 },
  BUSY:      { label: "Busy",      color: "text-orange-400",  dots: 4 },
  VERY_BUSY: { label: "Very Busy", color: "text-rose-400",    dots: 5 },
};
