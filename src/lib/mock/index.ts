/**
 * Central registry of mock data and mock loaders.
 * Components NEVER import this directory directly; they call data functions in src/lib/.
 */

export * from "./markers";

export const mockNotices = [
  {
    id: "notice-1",
    title: "Mid-Term Examination Schedule Released (Autumn 2026)",
    category: "academic",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    priority: "HIGH",
    content: "The mid-term examination timetable for all undergraduate and postgraduate programmes has been uploaded.",
  },
  {
    id: "notice-2",
    title: "Campus Library Extended Hours for Study Week",
    category: "facility",
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 14).toISOString(),
    priority: "NORMAL",
    content: "Central Library reading rooms will remain open 24/7 with active coffee stations on ground floor.",
  },
];
