import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security SOS Dashboard | CampusHub Admin",
  description: "Live security dashboard and emergency SOS alerts feed",
};

export default function AdminSosPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">Security SOS Alert Feed</h2>
      <p className="text-muted-foreground text-sm">
        Live active SOS broadcasts and emergency responder status.
      </p>
    </div>
  );
}
