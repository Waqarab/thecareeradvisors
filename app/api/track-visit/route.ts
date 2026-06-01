import { NextRequest, NextResponse } from "next/server";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "@/firebase/config"; // Ensure this imports your initialized app
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    // Parse the body to get the traffic source
    const body = await request.json().catch(() => ({}));
    const source = body.source || "Direct / Other";

    // Get IP Address safely from headers
    let ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (ip.includes(",")) ip = ip.split(",")[0].trim(); // Handle multiple IPs
    
    // Hash the IP for privacy & to create a valid, clean database key
    const ipHash = crypto.createHash("md5").update(ip).digest("hex");
    
    // Get current date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // Connect to Free Realtime Database
    const rtdb = getDatabase(app);
    
    // Save the unique visit for today, including the source and a timestamp
    // If the same IP visits again today, it simply overwrites this key (0 reads, 1 write)
    const visitRef = ref(rtdb, `stats/visits/${today}/${ipHash}`);
    await set(visitRef, {
      source: source,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}