import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import type { MarkerCategory, MarkerStatus } from "@prisma/client";

/**
 * GET /api/markers
 * Query params:
 *   - categories: comma-separated MarkerCategory values
 *   - status: MarkerStatus (default: ACTIVE)
 *   - buildingId: string
 *   - wheelchair: "true" | "false"
 *   - open: "true" — client-side filter (computed from operatingHours)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const categoriesParam = searchParams.get("categories");
  const statusParam = (searchParams.get("status") as MarkerStatus) ?? "ACTIVE";
  const buildingId = searchParams.get("buildingId");
  const wheelchairOnly = searchParams.get("wheelchair") === "true";

  const categories = categoriesParam
    ? (categoriesParam.split(",") as MarkerCategory[])
    : undefined;

  const markers = await db.mapMarker.findMany({
    where: {
      status: statusParam,
      ...(categories && { category: { in: categories } }),
      ...(buildingId && { buildingId }),
      ...(wheelchairOnly && { wheelchairAccessible: true }),
    },
    select: {
      id: true,
      name: true,
      shortName: true,
      description: true,
      category: true,
      subCategory: true,
      lat: true,
      lng: true,
      buildingId: true,
      building: { select: { name: true } },
      floorNumber: true,
      address: true,
      phone: true,
      thumbnailUrl: true,
      imageUrls: true,
      operatingHours: true,
      holidayOverrides: true,
      examSeasonHours: true,
      wheelchairAccessible: true,
      hasRamp: true,
      hasElevator: true,
      crowdLevel: true,
      crowdUpdatedAt: true,
      status: true,
      tags: true,
      amenities: true,
      avgRating: true,
      ratingCount: true,
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ markers }, { status: 200 });
}

/**
 * POST /api/markers
 * Admin only — create a new map marker
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await request.json();

  const marker = await db.mapMarker.create({
    data: {
      ...body,
      createdById: session.user.id,
    },
  });

  return NextResponse.json({ marker }, { status: 201 });
}
