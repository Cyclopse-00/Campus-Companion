import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Safe Walk Tracking | CampusHub",
  description: "Live Safe Walk companion tracking",
};

export default function TrackPage({
  params,
}: {
  params: { token: string };
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Safe Walk Live Tracking
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Tracking Token: <code className="font-mono text-xs">{params.token}</code>
        </p>
      </div>
    </main>
  );
}
