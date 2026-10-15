"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    // Initial check
    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      const timer = setTimeout(() => {
        setJustReconnected(false);
      }, 3500);
      return () => clearTimeout(timer);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  if (!isOffline && !justReconnected) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "sticky top-0 z-50 flex items-center justify-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium shadow-md transition-all duration-300",
        isOffline
          ? "bg-amber-600 text-white dark:bg-amber-600/90"
          : "bg-emerald-600 text-white dark:bg-emerald-600/90"
      )}
    >
      {isOffline ? (
        <>
          <WifiOff className="h-4 w-4 shrink-0 animate-pulse" />
          <span>You are offline — cached map and offline places remain available.</span>
        </>
      ) : (
        <>
          <Wifi className="h-4 w-4 shrink-0" />
          <span>Back online — live statuses synchronized.</span>
        </>
      )}
    </div>
  );
}