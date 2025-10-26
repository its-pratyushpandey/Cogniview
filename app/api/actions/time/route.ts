import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const timezone = searchParams.get("timezone") || "UTC";

    const now = new Date();
    const timeString = now.toLocaleString("en-US", {
      timeZone: timezone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    return NextResponse.json({
      timezone,
      time: timeString,
      timestamp: now.toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      timezone: "UTC",
      time: new Date().toLocaleString(),
      error: "Invalid timezone, showing UTC"
    });
  }
}