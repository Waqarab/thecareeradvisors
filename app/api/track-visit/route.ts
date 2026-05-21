import { NextRequest, NextResponse } from "next/server";
import { getDatabase, ref, set } from "firebase/database";
import { app } from "@/firebase/config"; // Ensure this imports your initialized app
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    // Get IP Address safely from headers
    let ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    if (ip.includes(",")) ip = ip.split(",")[0].trim(); // Handle multiple IPs
    
    // Hash the IP for privacy & valid database key
    const ipHash = crypto.createHash("md5").update(ip).digest("hex");
    
    // Get current date (YYYY-MM-DD)
    const today = new Date().toISOString().split("T")[0];

    // Connect to Free Realtime Database
    const rtdb = getDatabase(app);
    
    // Save the unique visit for today (Uses 0 reads, just writes!)
    const visitRef = ref(rtdb, `stats/visits/${today}/${ipHash}`);
    await set(visitRef, true);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}