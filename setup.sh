#!/usr/bin/env bash
# ==============================================================================
# CampusHub — Workspace Setup Script
# ==============================================================================
# Usage: bash setup.sh
#
# This script:
#   1. Creates the full directory structure for CampusHub
#   2. Initializes all placeholder files with boilerplate comments
#   3. Does NOT overwrite files that already exist (safe to re-run)
#
# After running, install dependencies:
#   npm install
#   cp .env.example .env.local   # then fill in real values
#   npm run db:migrate
#   npm run db:seed
# ==============================================================================

set -euo pipefail

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log() { echo -e "${CYAN}[campushub]${NC} $1"; }
ok()  { echo -e "${GREEN}✓${NC} $1"; }
warn(){ echo -e "${YELLOW}⚠${NC}  $1"; }

# ------------------------------------------------------------------------------
# Helper: create directory and log
# ------------------------------------------------------------------------------
mkd() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1"
    ok "dir  $1"
  fi
}

# Helper: create empty file with header comment (skip if exists)
mkf() {
  local path="$1"
  local comment="${2:-# placeholder}"
  if [ ! -f "$path" ]; then
    echo "$comment" > "$path"
    ok "file $path"
  else
    warn "skip $path (already exists)"
  fi
}

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║        CampusHub — Full Workspace Scaffolder             ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ==============================================================================
# 1. ROOT CONFIG FILES
# ==============================================================================
log "Creating root config files..."
mkf ".gitignore" "# See .gitignore template below"
mkf ".eslintrc.json" '{
  "extends": ["next/core-web-vitals", "next/typescript"]
}'
mkf "components.json" '{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}'
mkf "prettier.config.js" 'module.exports = { semi: true, singleQuote: false, trailingComma: "es5", printWidth: 100 };'

# ==============================================================================
# 2. PRISMA
# ==============================================================================
log "Creating Prisma directory..."
mkd "prisma/migrations"
mkf "prisma/migrations/.gitkeep"

# ==============================================================================
# 3. PUBLIC ASSETS
# ==============================================================================
log "Creating public/ structure..."
mkd "public/icons"
mkd "public/screenshots"
mkd "public/geojson"
mkd "public/floorplans"
mkd "public/offline"

# Placeholder icon PNGs (replace with real assets)
for size in 72 96 128 144 152 192 384 512; do
  mkf "public/icons/icon-${size}x${size}.png" ""
done

mkf "public/offline/index.html" '<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>CampusHub — Offline</title></head>
<body>
  <h1>You are offline</h1>
  <p>Please check your internet connection. The campus map is still available from cache.</p>
</body>
</html>'

# ==============================================================================
# 4. SRC/APP — App Router Pages
# ==============================================================================
log "Creating src/app/ route structure..."

mkd "src/app"
mkd "src/app/api/auth"
mkd "src/app/api/markers"
mkd "src/app/api/markers/[id]"
mkd "src/app/api/markers/[id]/report"
mkd "src/app/api/markers/bulk-import"
mkd "src/app/api/buildings"
mkd "src/app/api/buildings/[id]/floors"
mkd "src/app/api/rooms/search"
mkd "src/app/api/notices"
mkd "src/app/api/notices/[id]"
mkd "src/app/api/timetable"
mkd "src/app/api/events"
mkd "src/app/api/events/[id]/rsvp"
mkd "src/app/api/lost-found"
mkd "src/app/api/grievances"
mkd "src/app/api/grievances/[id]"
mkd "src/app/api/sos"
mkd "src/app/api/notifications"
mkd "src/app/api/admin/markers"
mkd "src/app/api/admin/reports"
mkd "src/app/api/admin/csv-import"
mkd "src/app/api/uploadthing"
mkd "src/app/api/user/profile"
mkd "src/app/api/user/saved-locations"
mkd "src/app/api/fcm/token"

# Auth pages
mkd "src/app/auth/sign-in"
mkd "src/app/auth/error"
mkd "src/app/auth/verify"
mkf "src/app/auth/sign-in/page.tsx" "// Sign-in page — TODO: implement with NextAuth signIn()"
mkf "src/app/auth/error/page.tsx"   "// Auth error page"
mkf "src/app/auth/verify/page.tsx"  "// Email verify page"

# Main app pages
mkd "src/app/(app)"
mkd "src/app/(app)/map"
mkd "src/app/(app)/map/indoor/[buildingId]"
mkd "src/app/(app)/notices"
mkd "src/app/(app)/notices/[id]"
mkd "src/app/(app)/academics"
mkd "src/app/(app)/academics/timetable"
mkd "src/app/(app)/academics/resources"
mkd "src/app/(app)/academics/cgpa"
mkd "src/app/(app)/academics/faculty"
mkd "src/app/(app)/events"
mkd "src/app/(app)/events/[id]"
mkd "src/app/(app)/lost-found"
mkd "src/app/(app)/lost-found/new"
mkd "src/app/(app)/grievances"
mkd "src/app/(app)/grievances/new"
mkd "src/app/(app)/marketplace"
mkd "src/app/(app)/marketplace/new"
mkd "src/app/(app)/rides"
mkd "src/app/(app)/mess"
mkd "src/app/(app)/safety"
mkd "src/app/(app)/safety/sos"
mkd "src/app/(app)/profile"
mkd "src/app/(app)/settings"

# Placeholder pages
for page in \
  "src/app/(app)/map/page.tsx" \
  "src/app/(app)/notices/page.tsx" \
  "src/app/(app)/academics/timetable/page.tsx" \
  "src/app/(app)/academics/resources/page.tsx" \
  "src/app/(app)/academics/cgpa/page.tsx" \
  "src/app/(app)/academics/faculty/page.tsx" \
  "src/app/(app)/events/page.tsx" \
  "src/app/(app)/lost-found/page.tsx" \
  "src/app/(app)/grievances/page.tsx" \
  "src/app/(app)/marketplace/page.tsx" \
  "src/app/(app)/rides/page.tsx" \
  "src/app/(app)/mess/page.tsx" \
  "src/app/(app)/safety/sos/page.tsx" \
  "src/app/(app)/profile/page.tsx" \
  "src/app/(app)/settings/page.tsx"
do
  mkf "$page" 'export default function Page() { return <div>TODO</div>; }'
done

mkf "src/app/(app)/layout.tsx" '// App shell layout with bottom nav — TODO'
mkf "src/app/page.tsx"    'import { redirect } from "next/navigation"; export default function Home() { redirect("/map"); }'
mkf "src/app/offline/page.tsx" 'export default function OfflinePage() { return <div>You are offline</div>; }'
mkf "src/app/unauthorized/page.tsx" 'export default function Unauthorized() { return <div>Access denied.</div>; }'

# Admin pages
mkd "src/app/admin"
mkd "src/app/admin/(dashboard)"
mkd "src/app/admin/(dashboard)/markers"
mkd "src/app/admin/(dashboard)/reports"
mkd "src/app/admin/(dashboard)/users"
mkd "src/app/admin/(dashboard)/notices"
mkd "src/app/admin/(dashboard)/csv-import"
mkd "src/app/admin/(dashboard)/sos-dashboard"
for page in \
  "src/app/admin/(dashboard)/markers/page.tsx" \
  "src/app/admin/(dashboard)/reports/page.tsx" \
  "src/app/admin/(dashboard)/users/page.tsx" \
  "src/app/admin/(dashboard)/notices/page.tsx" \
  "src/app/admin/(dashboard)/csv-import/page.tsx" \
  "src/app/admin/(dashboard)/sos-dashboard/page.tsx"
do
  mkf "$page" 'export default function AdminPage() { return <div>Admin — TODO</div>; }'
done
mkf "src/app/admin/layout.tsx" '// Admin layout with sidebar — TODO'
mkf "src/app/admin/page.tsx"   'import { redirect } from "next/navigation"; export default function AdminHome() { redirect("/admin/markers"); }'

# ==============================================================================
# 5. SRC/COMPONENTS
# ==============================================================================
log "Creating src/components/ structure..."

mkd "src/components/ui"
mkd "src/components/providers"
mkd "src/components/layout"
mkd "src/components/map"
mkd "src/components/markers"
mkd "src/components/forms"
mkd "src/components/shared"

# UI primitives (shadcn/ui — install via `npx shadcn@latest add`)
for comp in button badge card dialog drawer input label select sheet skeleton tabs toast tooltip avatar separator scroll-area progress switch checkbox slider; do
  mkf "src/components/ui/${comp}.tsx" "// shadcn/ui — run: npx shadcn@latest add ${comp}"
done

# Providers
mkf "src/components/providers/theme-provider.tsx" '"use client"; import { ThemeProvider as NextThemesProvider } from "next-themes"; import type { ThemeProviderProps } from "next-themes"; export function ThemeProvider({ children, ...props }: ThemeProviderProps) { return <NextThemesProvider {...props}>{children}</NextThemesProvider>; }'
mkf "src/components/providers/auth-provider.tsx"  '"use client"; // SessionProvider wrapper if needed'

# Layout components
for comp in bottom-nav top-bar sidebar page-header; do
  mkf "src/components/layout/${comp}.tsx" "// TODO: implement ${comp}"
done

# Map components
for comp in campus-map marker-layer filter-drawer marker-popup indoor-viewer route-panel crowd-badge open-status-badge; do
  mkf "src/components/map/${comp}.tsx" "// TODO: implement ${comp}"
done

# Shared components
for comp in loading-spinner empty-state error-boundary image-upload csv-importer; do
  mkf "src/components/shared/${comp}.tsx" "// TODO: implement ${comp}"
done

# ==============================================================================
# 6. SRC/FEATURES (Feature-Sliced Architecture)
# ==============================================================================
log "Creating src/features/ structure..."

# Phase 1 features
for feature in map auth admin; do
  mkd "src/features/${feature}/components"
  mkd "src/features/${feature}/hooks"
  mkd "src/features/${feature}/lib"
  mkd "src/features/${feature}/types"
  mkd "src/features/${feature}/api"
  mkf "src/features/${feature}/index.ts" "// ${feature} feature — public API exports"
done

# Phase 2 features
for feature in notices timetable resources events lost-found faculty cgpa; do
  mkd "src/features/${feature}/components"
  mkd "src/features/${feature}/hooks"
  mkd "src/features/${feature}/api"
  mkf "src/features/${feature}/index.ts" "// ${feature} feature — public API exports"
done

# Phase 3 features
for feature in grievances helpline complaints; do
  mkd "src/features/${feature}/components"
  mkd "src/features/${feature}/api"
  mkf "src/features/${feature}/index.ts" "// ${feature} feature — public API exports"
done

# Phase 4 features
for feature in marketplace rides mess safety; do
  mkd "src/features/${feature}/components"
  mkd "src/features/${feature}/api"
  mkf "src/features/${feature}/index.ts" "// ${feature} feature — public API exports"
done

# ==============================================================================
# 7. SRC/LIB — Utilities
# ==============================================================================
log "Creating src/lib/ utilities..."
mkd "src/lib"

mkf "src/lib/utils.ts" '// cn() helper for Tailwind class merging
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }'

mkf "src/lib/firebase.ts"      "// Firebase app + FCM initializer"
mkf "src/lib/uploadthing.ts"   "// UploadThing client helpers"
mkf "src/lib/papaparse.ts"     "// CSV parse helpers for bulk import"
mkf "src/lib/geojson.ts"       "// GeoJSON layer loaders and helpers"
mkf "src/lib/timetable-route.ts" "// Auto-timetable routing engine (Phase 2)"
mkf "src/lib/cgpa.ts"          "// CGPA/GPA calculation utilities"
mkf "src/lib/notifications.ts" "// FCM send helpers (server-side)"
mkf "src/lib/validations.ts"   "// Zod schemas shared across API routes"

# ==============================================================================
# 8. SRC/HOOKS
# ==============================================================================
log "Creating src/hooks/..."
mkd "src/hooks"

for hook in use-markers use-buildings use-indoor-search use-geolocation use-map-filters use-open-status use-notices use-timetable use-events use-offline; do
  mkf "src/hooks/${hook}.ts" "// TODO: implement ${hook}"
done

# ==============================================================================
# 9. SRC/TYPES
# ==============================================================================
log "Creating src/types/..."
mkd "src/types"

mkf "src/types/api.ts"         "// Shared API response types"
mkf "src/types/auth.ts"        "// Auth-related types (RBAC roles, etc.)"
mkf "src/types/notices.ts"     "// Notice domain types"
mkf "src/types/timetable.ts"   "// Timetable domain types"
mkf "src/types/events.ts"      "// Events domain types"
mkf "src/types/lost-found.ts"  "// Lost & Found domain types"
mkf "src/types/grievance.ts"   "// Grievance domain types"
mkf "src/types/marketplace.ts" "// Marketplace domain types"
mkf "src/types/safety.ts"      "// SOS & Safety domain types"
mkf "src/types/mess.ts"        "// Mess menu domain types"

# ==============================================================================
# 10. SRC/STORE — Zustand stores
# ==============================================================================
log "Creating src/store/..."
mkd "src/store"
mkf "src/store/app-store.ts"    "// Global app store (user prefs, notifications)"
mkf "src/store/offline-store.ts" "// Offline cache metadata store"

# ==============================================================================
# 11. SRC/APP/API — Remaining API route placeholders
# ==============================================================================
log "Creating API route placeholders..."

for route in \
  "src/app/api/auth/[...nextauth]/route.ts" \
  "src/app/api/buildings/route.ts" \
  "src/app/api/buildings/[id]/floors/route.ts" \
  "src/app/api/rooms/search/route.ts" \
  "src/app/api/notices/route.ts" \
  "src/app/api/notices/[id]/route.ts" \
  "src/app/api/timetable/route.ts" \
  "src/app/api/events/route.ts" \
  "src/app/api/events/[id]/rsvp/route.ts" \
  "src/app/api/lost-found/route.ts" \
  "src/app/api/grievances/route.ts" \
  "src/app/api/grievances/[id]/route.ts" \
  "src/app/api/sos/route.ts" \
  "src/app/api/notifications/route.ts" \
  "src/app/api/admin/reports/route.ts" \
  "src/app/api/admin/csv-import/route.ts" \
  "src/app/api/user/profile/route.ts" \
  "src/app/api/user/saved-locations/route.ts" \
  "src/app/api/fcm/token/route.ts"
do
  mkf "$route" 'import { NextResponse } from "next/server"; export async function GET() { return NextResponse.json({ message: "TODO" }); }'
done

# NextAuth catch-all route
mkf "src/app/api/auth/[...nextauth]/route.ts" 'import { handlers } from "@/auth"; export const { GET, POST } = handlers;'

# ==============================================================================
# 12. FIREBASE SERVICE WORKER
# ==============================================================================
log "Creating Firebase service worker stub..."
mkf "public/firebase-messaging-sw.js" '// Firebase Cloud Messaging service worker
// This file must be at the root of /public for FCM to work.
importScripts("https://www.gstatic.com/firebasejs/10.12.3/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.3/firebase-messaging-compat.js");

// Config is injected at runtime via query param or hardcoded here
firebase.initializeApp({
  apiKey: self.FIREBASE_API_KEY,
  authDomain: self.FIREBASE_AUTH_DOMAIN,
  projectId: self.FIREBASE_PROJECT_ID,
  storageBucket: self.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: self.FIREBASE_MESSAGING_SENDER_ID,
  appId: self.FIREBASE_APP_ID,
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body, icon } = payload.notification ?? {};
  self.registration.showNotification(title ?? "CampusHub", {
    body: body ?? "",
    icon: icon ?? "/icons/icon-192x192.png",
    badge: "/icons/icon-72x72.png",
    data: payload.data,
  });
});
'

# ==============================================================================
# 13. GITIGNORE
# ==============================================================================
cat > ".gitignore" << 'GITIGNORE'
# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/
build/

# Environment
.env
.env.local
.env.*.local

# PWA
public/sw.js
public/workbox-*.js
public/worker-*.js

# Prisma
prisma/generated/

# Misc
.DS_Store
*.pem
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.vercel
*.tsbuildinfo
next-env.d.ts

# Editor
.vscode/settings.json
.idea/
GITIGNORE

ok ".gitignore written"

# ==============================================================================
# DONE
# ==============================================================================
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅  CampusHub workspace scaffolded successfully!        ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo "Next steps:"
echo "  1. npm install"
echo "  2. cp .env.example .env.local    # fill in real values"
echo "  3. npm run db:migrate            # apply Prisma schema"
echo "  4. npm run db:seed               # seed sample data"
echo "  5. npx shadcn@latest init        # initialize shadcn/ui"
echo "  6. npm run dev                   # start development server"
echo ""
