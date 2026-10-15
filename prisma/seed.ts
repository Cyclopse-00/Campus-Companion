/**
 * Prisma Database Seed
 * Run: npx tsx prisma/seed.ts
 * Or:  npm run db:seed
 */
import { PrismaClient, MarkerCategory, MarkerStatus, CrowdLevel, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CampusHub database...");

  // ------------------------------------------------------------------
  // 1. Admin user
  // ------------------------------------------------------------------
  const admin = await prisma.user.upsert({
    where: { email: "admin@campus.edu" },
    update: {},
    create: {
      email: "admin@campus.edu",
      name: "Campus Admin",
      role: UserRole.ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // ------------------------------------------------------------------
  // 2. Sample buildings
  // ------------------------------------------------------------------
  const blockA = await prisma.building.upsert({
    where: { code: "BLK_A" },
    update: {},
    create: {
      name: "Block A — Computer Science",
      code: "BLK_A",
      lat: 17.4065,
      lng: 78.4770,
      totalFloors: 4,
      hasElevator: true,
      wheelchairEntry: true,
    },
  });

  const library = await prisma.building.upsert({
    where: { code: "LIB" },
    update: {},
    create: {
      name: "Central Library",
      code: "LIB",
      lat: 17.4076,
      lng: 78.4776,
      totalFloors: 2,
      hasElevator: true,
      wheelchairEntry: true,
    },
  });

  console.log(`✅ Buildings: ${blockA.name}, ${library.name}`);

  // ------------------------------------------------------------------
  // 3. Sample floor plans & rooms
  // ------------------------------------------------------------------
  const groundFloor = await prisma.floorPlan.upsert({
    where: { buildingId_floorNumber: { buildingId: blockA.id, floorNumber: 0 } },
    update: {},
    create: {
      buildingId: blockA.id,
      floorNumber: 0,
      floorLabel: "Ground Floor",
    },
  });

  await prisma.room.upsert({
    where: { id: "room_a_001" },
    update: {},
    create: {
      id: "room_a_001",
      floorPlanId: groundFloor.id,
      roomNumber: "001",
      roomName: "Main Lab",
      roomType: "LAB",
      capacity: 40,
      isWheelchairAccessible: true,
    },
  });

  console.log("✅ Floor plans & rooms seeded");

  // ------------------------------------------------------------------
  // 4. Sample markers for each category
  // ------------------------------------------------------------------
  const markers = [
    {
      name: "Block A Canteen",
      category: MarkerCategory.FOOD,
      subCategory: "Canteen",
      lat: 17.4063,
      lng: 78.4768,
      buildingId: blockA.id,
      operatingHours: {
        alwaysOpen: false,
        mon: [{ open: "08:00", close: "21:00" }],
        tue: [{ open: "08:00", close: "21:00" }],
        wed: [{ open: "08:00", close: "21:00" }],
        thu: [{ open: "08:00", close: "21:00" }],
        fri: [{ open: "08:00", close: "21:00" }],
        sat: [{ open: "09:00", close: "18:00" }],
        sun: [],
      },
      wheelchairAccessible: true,
      crowdLevel: CrowdLevel.MODERATE,
      tags: ["veg", "non-veg", "thali"],
    },
    {
      name: "Central ATM",
      category: MarkerCategory.MONEY,
      subCategory: "ATM",
      lat: 17.4070,
      lng: 78.4774,
      operatingHours: { alwaysOpen: true },
      wheelchairAccessible: true,
      crowdLevel: CrowdLevel.QUIET,
      tags: ["SBI", "24/7"],
    },
    {
      name: "Campus Medical Centre",
      category: MarkerCategory.HEALTH,
      subCategory: "Medical Centre",
      lat: 17.4058,
      lng: 78.4760,
      operatingHours: {
        mon: [{ open: "09:00", close: "17:00" }],
        tue: [{ open: "09:00", close: "17:00" }],
        wed: [{ open: "09:00", close: "17:00" }],
        thu: [{ open: "09:00", close: "17:00" }],
        fri: [{ open: "09:00", close: "17:00" }],
        sat: [{ open: "09:00", close: "13:00" }],
        sun: [],
      },
      wheelchairAccessible: true,
      crowdLevel: CrowdLevel.QUIET,
      tags: ["doctor", "first-aid", "free"],
    },
    {
      name: "Central Library",
      category: MarkerCategory.STUDY,
      subCategory: "Library",
      lat: 17.4076,
      lng: 78.4776,
      buildingId: library.id,
      operatingHours: {
        mon: [{ open: "08:00", close: "22:00" }],
        tue: [{ open: "08:00", close: "22:00" }],
        wed: [{ open: "08:00", close: "22:00" }],
        thu: [{ open: "08:00", close: "22:00" }],
        fri: [{ open: "08:00", close: "22:00" }],
        sat: [{ open: "09:00", close: "20:00" }],
        sun: [{ open: "10:00", close: "18:00" }],
      },
      wheelchairAccessible: true,
      crowdLevel: CrowdLevel.MODERATE,
      tags: ["ac", "silent-zone", "books", "internet"],
      amenities: ["free-wifi", "ac", "seating"],
    },
    {
      name: "Main Bus Stop",
      category: MarkerCategory.TRANSPORT,
      subCategory: "Bus Stop",
      lat: 17.4050,
      lng: 78.4755,
      operatingHours: {
        mon: [{ open: "06:00", close: "22:00" }],
        tue: [{ open: "06:00", close: "22:00" }],
        wed: [{ open: "06:00", close: "22:00" }],
        thu: [{ open: "06:00", close: "22:00" }],
        fri: [{ open: "06:00", close: "22:00" }],
        sat: [{ open: "06:00", close: "20:00" }],
        sun: [{ open: "08:00", close: "18:00" }],
      },
      wheelchairAccessible: true,
      crowdLevel: CrowdLevel.BUSY,
      tags: ["city-bus", "college-bus"],
    },
    {
      name: "Main Gate Security Post",
      category: MarkerCategory.SAFETY,
      subCategory: "Security Post",
      lat: 17.4045,
      lng: 78.4750,
      operatingHours: { alwaysOpen: true },
      wheelchairAccessible: true,
      crowdLevel: CrowdLevel.QUIET,
      tags: ["24/7", "CCTV"],
    },
    {
      name: "RO Water Station — Block A",
      category: MarkerCategory.WATER_SANITATION,
      subCategory: "RO Purifier",
      lat: 17.4066,
      lng: 78.4771,
      buildingId: blockA.id,
      operatingHours: { alwaysOpen: true },
      wheelchairAccessible: true,
      crowdLevel: CrowdLevel.EMPTY,
      tags: ["free", "filtered"],
    },
    {
      name: "Charging Hub — Library Foyer",
      category: MarkerCategory.CHARGING_WIFI,
      subCategory: "Charging Station",
      lat: 17.4075,
      lng: 78.4777,
      buildingId: library.id,
      operatingHours: {
        mon: [{ open: "08:00", close: "22:00" }],
        tue: [{ open: "08:00", close: "22:00" }],
        wed: [{ open: "08:00", close: "22:00" }],
        thu: [{ open: "08:00", close: "22:00" }],
        fri: [{ open: "08:00", close: "22:00" }],
        sat: [{ open: "09:00", close: "20:00" }],
        sun: [{ open: "10:00", close: "18:00" }],
      },
      wheelchairAccessible: true,
      crowdLevel: CrowdLevel.QUIET,
      tags: ["USB-A", "USB-C", "free"],
      amenities: ["free-wifi"],
    },
  ];

  for (const marker of markers) {
    await prisma.mapMarker.create({ data: marker as any });
  }

  console.log(`✅ ${markers.length} sample markers seeded`);

  // ------------------------------------------------------------------
  // 5. Sample notice
  // ------------------------------------------------------------------
  await prisma.notice.create({
    data: {
      title: "Welcome to CampusHub!",
      content:
        "CampusHub is your all-in-one smart campus companion. Explore the map, check facility hours, and stay updated with notices.",
      category: "GENERAL",
      isPinned: true,
      createdById: admin.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  console.log("✅ Sample notice created");
  console.log("\n🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
