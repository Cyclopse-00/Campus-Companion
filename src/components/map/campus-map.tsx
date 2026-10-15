"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import type { CampusMarker, BuildingFeature, WalkwayFeature } from "@/types/map";
import { DEFAULT_MAP_CONFIG } from "@/types/map";
import { MarkerLayer } from "@/components/map/marker-layer";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { Crosshair, Maximize2, ZoomIn, ZoomOut, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Feature, Polygon } from "geojson";

// Dynamically import react-leaflet components (must be client-only)
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const PolygonLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polygon),
  { ssr: false }
);
const PolylineLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.Polyline),
  { ssr: false }
);
const CircleMarkerLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.CircleMarker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

interface CampusMapProps {
  markers: CampusMarker[];
  buildings?: BuildingFeature[];
  pathways?: WalkwayFeature[];
  boundary?: Feature<Polygon, any> | null;
  onSelectMarker: (marker: CampusMarker) => void;
  onSelectBuilding?: (building: BuildingFeature) => void;
  className?: string;
}

// Controller component to listen to map events and trigger programmatic actions
function MapController({
  onZoomChange,
  targetLocation,
}: {
  onZoomChange: (zoom: number) => void;
  targetLocation?: [number, number] | null;
}) {
  const { useMap, useMapEvents } = require("react-leaflet");
  const map = useMap();

  useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
  });

  useEffect(() => {
    if (targetLocation) {
      map.flyTo(targetLocation, 18, { duration: 1.2 });
    }
  }, [targetLocation, map]);

  return null;
}

export function CampusMap({
  markers,
  buildings = [],
  pathways = [],
  boundary,
  onSelectMarker,
  onSelectBuilding,
  className,
}: CampusMapProps) {
  const [mounted, setMounted] = useState(false);
  const [zoom, setZoom] = useState<number>(DEFAULT_MAP_CONFIG.defaultZoom);
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [targetLocation, setTargetLocation] = useState<[number, number] | null>(null);
  const [locateError, setLocateError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      setLocateError("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocateError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const coords: [number, number] = [lat, lng];
        setUserCoords(coords);
        setTargetLocation(coords);
      },
      (err) => {
        setIsLocating(false);
        setLocateError(err.message || "Could not retrieve your location");
        setTimeout(() => setLocateError(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  const handleFitCampus = () => {
    // Default campus center
    setTargetLocation([DEFAULT_MAP_CONFIG.defaultCenter.lat, DEFAULT_MAP_CONFIG.defaultCenter.lng]);
  };

  if (!mounted) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-muted/40 min-h-[350px]">
        <LoadingSpinner size="lg" label="Initializing Interactive Map..." />
      </div>
    );
  }

  // Convert boundary polygon coordinates (GeoJSON [lng, lat] -> Leaflet [lat, lng])
  const boundaryCoords: [number, number][] =
    boundary?.geometry?.coordinates?.[0]?.map(([lng, lat]) => [lat, lng]) ?? [];

  return (
    <div className={`relative h-full w-full overflow-hidden ${className ?? ""}`}>
      <MapContainer
        center={[DEFAULT_MAP_CONFIG.defaultCenter.lat, DEFAULT_MAP_CONFIG.defaultCenter.lng]}
        zoom={DEFAULT_MAP_CONFIG.defaultZoom}
        minZoom={DEFAULT_MAP_CONFIG.minZoom}
        maxZoom={DEFAULT_MAP_CONFIG.maxZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full z-10"
      >
        <MapController
          onZoomChange={(z) => setZoom(z)}
          targetLocation={targetLocation}
        />

        {/* Clean Carto / OSM Tile Layer */}
        <TileLayer
          attribution={DEFAULT_MAP_CONFIG.attribution}
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Campus Boundary Line */}
        {boundaryCoords.length > 0 && (
          <PolygonLayer
            positions={boundaryCoords}
            pathOptions={{
              color: "#6366f1",
              weight: 2,
              dashArray: "6, 6",
              fillColor: "#6366f1",
              fillOpacity: 0.04,
            }}
          />
        )}

        {/* Pathways Layer */}
        {pathways.map((path) => {
          const coords: [number, number][] = path.geometry.coordinates.map(([lng, lat]) => [
            lat,
            lng,
          ]);
          const isAccessible = path.properties.isWheelchairAccessible;

          return (
            <PolylineLayer
              key={path.properties.id}
              positions={coords}
              pathOptions={{
                color: isAccessible ? "#0284c7" : "#f97316",
                weight: isAccessible ? 3.5 : 2.5,
                dashArray: isAccessible ? undefined : "4, 6",
                opacity: 0.75,
              }}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <p className="font-bold">{path.properties.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {isAccessible ? "✓ Wheelchair Accessible" : "⚠ Steps / Uneven path"}
                  </p>
                </div>
              </Popup>
            </PolylineLayer>
          );
        })}

        {/* Buildings Polygon Layer */}
        {buildings.map((b) => {
          const polyCoords: [number, number][] =
            b.geometry.coordinates[0]?.map(([lng, lat]) => [lat, lng]) ?? [];

          return (
            <PolygonLayer
              key={b.properties.id}
              positions={polyCoords}
              eventHandlers={{
                click: () => onSelectBuilding && onSelectBuilding(b),
              }}
              pathOptions={{
                color: "#475569",
                weight: 1.5,
                fillColor: "#64748b",
                fillOpacity: 0.18,
              }}
            >
              <Popup>
                <div className="p-1 text-xs space-y-1">
                  <p className="font-bold text-sm text-foreground">{b.properties.name}</p>
                  <p className="text-muted-foreground text-[11px]">
                    Code: {b.properties.code} · {b.properties.totalFloors} Floors
                  </p>
                  <p className="text-[11px] font-medium text-emerald-600">
                    {b.properties.wheelchairEntry && "✓ Wheelchair Entry"}
                    {b.properties.hasElevator && " · Elevator Available"}
                  </p>
                </div>
              </Popup>
            </PolygonLayer>
          );
        })}

        {/* User Geolocation Marker */}
        {userCoords && (
          <CircleMarkerLayer
            center={userCoords}
            radius={8}
            pathOptions={{
              color: "#ffffff",
              weight: 2.5,
              fillColor: "#3b82f6",
              fillOpacity: 1,
            }}
          >
            <Popup>
              <div className="p-1 text-xs font-semibold text-center">
                <span>Your Location</span>
              </div>
            </Popup>
          </CircleMarkerLayer>
        )}

        {/* Clustered Marker Layer for all 11 Categories */}
        <MarkerLayer
          markers={markers}
          zoom={zoom}
          onSelectMarker={onSelectMarker}
        />
      </MapContainer>

      {/* Locate Error Toast */}
      {locateError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 rounded-xl border border-destructive/20 bg-destructive/90 px-4 py-2 text-xs font-semibold text-white shadow-lg backdrop-blur-sm animate-fade-in">
          {locateError}
        </div>
      )}

      {/* Floating Map Controls (Mobile first, 44px touch targets) */}
      <div className="absolute top-4 right-3.5 z-20 flex flex-col gap-2 select-none">
        {/* Locate Me Button */}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={handleLocateMe}
          disabled={isLocating}
          aria-label="Locate my position on campus"
          title="Locate Me"
          className="h-11 w-11 rounded-2xl bg-card/95 border border-border/80 shadow-md backdrop-blur-md active:scale-90"
        >
          {isLocating ? (
            <span className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          ) : (
            <Crosshair className={`h-5 w-5 ${userCoords ? "text-primary stroke-[2.5]" : "text-foreground"}`} />
          )}
        </Button>

        {/* Reset / Fit Campus Bounds Button */}
        <Button
          type="button"
          variant="secondary"
          size="icon"
          onClick={handleFitCampus}
          aria-label="Center map on campus"
          title="Center Campus"
          className="h-11 w-11 rounded-2xl bg-card/95 border border-border/80 shadow-md backdrop-blur-md active:scale-90"
        >
          <Maximize2 className="h-4 w-4 text-foreground" />
        </Button>
      </div>
    </div>
  );
}
export default CampusMap;