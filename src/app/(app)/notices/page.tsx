import React from "react";
import Link from "next/link";
import { Bell, ArrowLeft, Sparkles, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NoticesPage() {
  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <Button asChild variant="ghost" size="icon" className="rounded-xl min-h-[44px]">
          <Link href="/map">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back to map</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-primary" />
            <span>Campus Notices</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Official department notices, circulars, and updates.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center space-y-4">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Megaphone className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Coming Soon in Phase 2</span>
          </div>
          <h2 className="text-lg font-bold text-foreground">Notice Board & FCM Notifications</h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
            Categorized academic, exam, and administrative notices with instant push alerts to your device.
          </p>
        </div>
        <Button asChild variant="outline" className="rounded-xl font-semibold">
          <Link href="/map">Explore Campus Map</Link>
        </Button>
      </div>
    </div>
  );
}