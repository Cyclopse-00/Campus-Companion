"use client";

import React, { useMemo } from "react";
import L from "leaflet";
import { Marker, Tooltip, useMap } from "react-leaflet";
import type { CampusMarker, MarkerCategory } from "@/types/map";
import { CATEGORY_META } from "@/types/map";

interface MarkerLayerProps {
  markers: CampusMarker[];
  zoom: number;
  onSelectMarker: (marker: CampusMarker) => void;
}

interface ClusterItem {
  id: string;
  lat: number;
  lng: number;
  markers: CampusMarker[];
}

// Build SVG divIcon for an individual marker
function createMarkerIcon(marker: CampusMarker) {
  const meta = CATEGORY_META[marker.category] ?? CATEGORY_META.SERVICES;
  const isClosed = marker.openStatus === "CLOSED";
  const isOpen = marker.openStatus === "OPEN" || marker.openStatus === "ALWAYS_OPEN";
  const isClosingSoon = marker.openStatus === "CLOSING_SOON";

  const dotColor = isClosed ? "#ef4444" : isClosingSoon ? "#f59e0b" : "#10b981";

  const svgHtml = `
    <div style="position: relative; width: 34px; height: 44px; display: flex; justify-content: center; align-items: center; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.35)); cursor: pointer; transition: transform 0.15s ease;">
      <svg viewBox="0 0 32 42" width="34" height="44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 1C7.716 1 1 7.716 1 16c0 11.2 13.6 23.9 14.2 24.4a1.2 1.2 0 001.6 0C17.4 39.9 31 27.2 31 16 31 7.716 24.284 1 16 1z" fill="${meta.hex}"/>
        <circle cx="16" cy="15" r="10" fill="#ffffff" opacity="0.25"/>
      </svg>
      <div style="position: absolute; top: 6px; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center;">
        <img src="/icons/${marker.category.toLowerCase()}.svg" style="width: 16px; height: 16px; object-fit: contain; filter: brightness(0) invert(1);" alt="" />
      </div>
      <!-- Status Indicator Dot -->
      <span style="position: absolute; top: 0px; right: 0px; width: 9px; height: 9px; border-radius: 50%; background-color: ${dotColor}; border: 1.5px solid #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></span>
    </div>
  `;

  return L.divIcon({
    html: svgHtml,
    className: "campus-custom-marker",
    iconSize: [34, 44],
    iconAnchor: [17, 42],
    popupAnchor: [0, -38],
  });
}

// Build divIcon for clustered markers
function createClusterIcon(count: number) {
  const size = count < 10 ? 38 : count < 50 ? 44 : 50;

  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1 0%, #4338ca 100%);
      border: 3px solid #ffffff;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.45);
      color: #ffffff;
      font-weight: 800;
      font-size: ${size > 42 ? 14 : 12}px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    ">
      <span>${count}</span>
    </div>
  `;

  return L.divIcon({
    html,
    className: "campus-cluster-marker",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function MarkerLayer({ markers, zoom, onSelectMarker }: MarkerLayerProps) {
  const map = useMap();

  // Cluster algorithm: when zoom < 17, group markers that are within close proximity
  const { clusters, unclustered } = useMemo(() => {
    if (zoom >= 17) {
      return { clusters: [], unclustered: markers };
    }

    // Grid cell size in degrees based on zoom level
    const gridSize = zoom <= 14 ? 0.003 : zoom <= 15 ? 0.0018 : 0.0009;
    const grid: Record<string, CampusMarker[]> = {};

    for (const m of markers) {
      const cellX = Math.floor(m.lng / gridSize);
      const cellY = Math.floor(m.lat / gridSize);
      const key = `${cellX}_${cellY}`;
      if (!grid[key]) grid[key] = [];
      grid[key].push(m);
    }

    const clustersList: ClusterItem[] = [];
    const unclusteredList: CampusMarker[] = [];

    for (const key of Object.keys(grid)) {
      const cellMarkers = grid[key];
      if (cellMarkers.length > 1) {
        // Average coordinates for the cluster center
        const avgLat = cellMarkers.reduce((sum, m) => sum + m.lat, 0) / cellMarkers.length;
        const avgLng = cellMarkers.reduce((sum, m) => sum + m.lng, 0) / cellMarkers.length;
        clustersList.push({
          id: key,
          lat: avgLat,
          lng: avgLng,
          markers: cellMarkers,
        });
      } else {
        unclusteredList.push(cellMarkers[0]);
      }
    }

    return { clusters: clustersList, unclustered: unclusteredList };
  }, [markers, zoom]);

  const handleClusterClick = (c: ClusterItem) => {
    // Zoom into the cluster bounds
    const bounds = L.latLngBounds(c.markers.map((m) => [m.lat, m.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18 });
  };

  return (
    <>
      {/* Clusters */}
      {clusters.map((c) => (
        <Marker
          key={`cluster-${c.id}`}
          position={[c.lat, c.lng]}
          icon={createClusterIcon(c.markers.length)}
          eventHandlers={{
            click: () => handleClusterClick(c),
          }}
        >
          <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
            <span className="text-xs font-semibold">
              {c.markers.length} places (Tap to zoom)
            </span>
          </Tooltip>
        </Marker>
      ))}

      {/* Individual Markers */}
      {unclustered.map((m) => (
        <Marker
          key={m.id}
          position={[m.lat, m.lng]}
          icon={createMarkerIcon(m)}
          eventHandlers={{
            click: () => onSelectMarker(m),
          }}
        >
          <Tooltip direction="top" offset={[0, -32]} opacity={0.95}>
            <div className="flex flex-col gap-0.5 p-0.5 text-xs">
              <span className="font-bold text-slate-900">{m.name}</span>
              {m.openStatusLabel && (
                <span className="text-[11px] text-slate-600">{m.openStatusLabel}</span>
              )}
            </div>
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}