import { NextResponse } from "next/server";
import { admin } from "@/lib/firebase-admin";
import { requireSuperAdmin, rateLimit, getOrCreateBrowserId } from "@/lib/api-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let finalSetCookie: string | null = null;
  try {
    const auth = await requireSuperAdmin(req);
    if (auth instanceof NextResponse) return auth;

    const { id: browserId, setCookie } = getOrCreateBrowserId(req);
    finalSetCookie = setCookie;
    
    const rl = await rateLimit.check(browserId, "send_push_1min", 5, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429, headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    }
    await rateLimit.commit(browserId, "send_push_1min", 60 * 1000);

    const body = await req.json();
    let { title, message, linkUrl } = body;

    if (!title || !message || typeof title !== "string" || typeof message !== "string") {
      return NextResponse.json({ error: "Missing or invalid title or message" }, { status: 400, headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    }

    title = title.replace(/<[^>]*>?/gm, '').substring(0, 200);
    message = message.replace(/<[^>]*>?/gm, '').substring(0, 200);

    const db = admin.firestore();
    
    // 2. Fetch all saved user device tokens from Firestore
    const tokensSnapshot = await db.collection("fcm_tokens").get();
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    if (tokens.length === 0) {
      return NextResponse.json({ success: true, message: "No tokens found to notify." }, { headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
    }

    // 3. Construct the Push Payload
    const payload = {
      notification: {
        title: title,
        body: message,
      },
      webpush: {
        fcmOptions: {
          link: linkUrl || "/", // Clicking the notification opens this link
        }
      },
      tokens: tokens, // Array of all user devices
    };

    // 4. Blast the notification to all devices (even closed browsers!)
    const response = await admin.messaging().sendEachForMulticast(payload);

    return NextResponse.json({ 
      success: true, 
      successCount: response.successCount,
      failureCount: response.failureCount 
    }, { headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });

  } catch (error) {
    console.error("Error sending push:", error);
    return NextResponse.json({ error: "Failed to send push notification" }, { status: 500, headers: { ...(finalSetCookie ? { "Set-Cookie": finalSetCookie } : {}) } });
  }
}