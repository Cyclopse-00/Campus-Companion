import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <header className="border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-lg font-semibold">CampusHub Admin Portal</h1>
      </header>
      <main className="p-4">{children}</main>
    </div>
  );
}
