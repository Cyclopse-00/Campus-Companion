import React from "react";
import { OfflineBanner } from "@/components/layout/offline-banner";
import { TopBar } from "@/components/layout/top-bar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { SOSFloatingButton } from "@/components/layout/sos-floating-button";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background flex flex-col font-sans text-foreground">
      {/* Offline connectivity banner */}
      <OfflineBanner />

      {/* Main Student Shell Header */}
      <TopBar />

      {/* Main scrollable view */}
      <main className="flex-1 pb-20 sm:pb-24">
        {children}
      </main>

      {/* Persistent Emergency SOS Trigger */}
      <SOSFloatingButton />

      {/* Primary Mobile Bottom Navigation */}
      <BottomNav />
    </div>
  );
}