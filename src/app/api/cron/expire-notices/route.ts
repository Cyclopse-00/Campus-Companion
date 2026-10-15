import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Phase 0 skeleton - auto-expiry cron endpoint
  return NextResponse.json({
    success: true,
    message: "Expired notices and events check completed",
    timestamp: new Date().toISOString(),
  });
}
