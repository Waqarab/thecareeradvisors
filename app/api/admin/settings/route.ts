import { NextResponse } from "next/server";
import { admin } from "@/lib/firebase-admin";
import { requireSuperAdmin, getClientIp, rateLimitByIp } from "@/lib/api-auth";
import { clearTodayAlert } from "@/lib/inquiry-limits";

export async function GET(req: Request) {
  const superAdmin = await requireSuperAdmin(req);
  if (superAdmin instanceof NextResponse) return superAdmin;

  try {
    const ref = admin.database().ref("settings/inquiry_daily_limit");
    const snap = await ref.get();
    const inquiry_daily_limit = typeof snap.val() === "number" ? snap.val() : 150;

    return NextResponse.json({ inquiry_daily_limit });
  } catch (error) {
    console.error("[ADMIN SETTINGS GET]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const superAdmin = await requireSuperAdmin(req);
  if (superAdmin instanceof NextResponse) return superAdmin;

  const ip = getClientIp(req);
  const limitCheck = await rateLimitByIp.check(ip, "admin_settings_post", 10, 60 * 1000);
  if (!limitCheck.success) {
    return NextResponse.json(
      { error: "Too many requests." },
      { status: 429, headers: { "Retry-After": String(limitCheck.retryAfter) } }
    );
  }
  await rateLimitByIp.commit(ip, "admin_settings_post", 60 * 1000);

  let body: { inquiry_daily_limit?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const { inquiry_daily_limit } = body;
  if (
    typeof inquiry_daily_limit !== "number" ||
    !Number.isInteger(inquiry_daily_limit) ||
    inquiry_daily_limit < 0 ||
    inquiry_daily_limit > 10000
  ) {
    return NextResponse.json(
      { error: "inquiry_daily_limit must be an integer between 0 and 10000." },
      { status: 400 }
    );
  }

  try {
    await admin.database().ref("settings/inquiry_daily_limit").set(inquiry_daily_limit);
    await clearTodayAlert();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[ADMIN SETTINGS POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
