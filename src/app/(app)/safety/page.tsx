import React from "react";
import Link from "next/link";
import { ShieldAlert, Phone, Ambulance, Flame, HeartHandshake, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SafetyPage() {
  const emergencyNumbers = [
    { name: "Campus Security Central Command", number: "+91 40 2300 0100", desc: "Main gate, patrols & incident response", icon: ShieldAlert, color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40" },
    { name: "Campus Health & Ambulance", number: "+91 40 2300 0108", desc: "24/7 doctor on call & emergency transport", icon: Ambulance, color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40" },
    { name: "Women's Safety & Anti-Harassment", number: "+91 40 2300 0109", desc: "Confidential immediate student support", icon: HeartHandshake, color: "text-violet-600 bg-violet-50 dark:bg-violet-950/40" },
    { name: "Fire & Disaster Response", number: "101", desc: "National emergency fire brigade dispatch", icon: Flame, color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40" },
  ];

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
            <ShieldAlert className="h-6 w-6 text-rose-600" />
            <span>Campus Emergency & Safety</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Direct hotlines and rapid response assistance for campus students.
          </p>
        </div>
      </div>

      {/* Main SOS Trigger Card */}
      <div className="rounded-3xl border border-rose-600/30 bg-rose-500/10 p-6 text-center space-y-4 shadow-lg shadow-rose-600/10">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rose-600 text-white shadow-xl shadow-rose-600/40 animate-pulse">
          <ShieldAlert className="h-9 w-9 stroke-[2.2]" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-rose-600 dark:text-rose-400">
            Emergency SOS Active Dispatch
          </h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
            Tap below to call campus security immediately. Location sharing & safe walk will be connected in Phase 4.
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="w-full h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-base shadow-lg shadow-rose-600/30 active:scale-95 gap-2"
        >
          <a href="tel:+914023000100">
            <Phone className="h-5 w-5" />
            <span>Call Campus Security Hotline</span>
          </a>
        </Button>
      </div>

      {/* Direct Helplines */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">
          Direct Emergency Contacts
        </h3>
        <div className="space-y-2.5">
          {emergencyNumbers.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${item.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground leading-tight">{item.name}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="rounded-xl shrink-0 h-10 min-h-[44px] px-3 font-semibold border-border"
                >
                  <a href={`tel:${item.number}`}>
                    <Phone className="h-4 w-4 text-emerald-500 mr-1.5" />
                    <span>Call</span>
                  </a>
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}