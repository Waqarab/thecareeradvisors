import { NextResponse } from "next/server";
import * as admin from "firebase-admin";

// 1. Initialize Firebase Admin (Only once)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Fixes the newline formatting issue in environment variables
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, message, linkUrl } = body;

    if (!title || !message) {
      return NextResponse.json({ error: "Missing title or message" }, { status: 400 });
    }

    const db = admin.firestore();
    
    // 2. Fetch all saved user device tokens from Firestore
    const tokensSnapshot = await db.collection("fcm_tokens").get();
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    if (tokens.length === 0) {
      return NextResponse.json({ success: true, message: "No tokens found to notify." });
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
    });

  } catch (error) {
    console.error("Error sending push:", error);
    return NextResponse.json({ error: "Failed to send push notification" }, { status: 500 });
  }
}