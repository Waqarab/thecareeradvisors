import { NextResponse } from "next/server";
import { admin } from "@/lib/firebase-admin";
import { validateInquiry } from "@/lib/inquiry-validation";
import {
  getDailyLimit,
  getTodayCount,
  incrementTodayCount,
  recordCapAlert,
} from "@/lib/inquiry-limits";

export async function POST(req: Request) {
  try {

    if (process.env.INQUIRY_REQUIRE_APPCHECK === "true") {
      const appCheckToken = req.headers.get("X-Firebase-AppCheck");
      if (!appCheckToken) {
        return NextResponse.json(
          { error: "Security check failed. Please refresh the page." },
          { status: 403 }
        );
      }
      try {
        await admin.appCheck().verifyToken(appCheckToken);
      } catch {
        return NextResponse.json(
          { error: "Security check failed. Please refresh the page." },
          { status: 403 }
        );
      }
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    const validationResult = validateInquiry(body);
    if (!validationResult.ok) {
      return NextResponse.json({ error: validationResult.error }, { status: 400 });
    }

    const limit = await getDailyLimit();
    const currentCount = await getTodayCount();

    if (currentCount >= limit) {
      return NextResponse.json(
        { error: "Daily inquiry limit reached. Please try again tomorrow." },
        { status: 429 }
      );
    }

    const docRef = await admin.firestore().collection("inquiries").add({
      ...validationResult.data,
      status: "New",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const newCount = await incrementTodayCount();

    if (newCount >= limit) {
      await recordCapAlert("full");
    } else if (newCount >= Math.ceil(limit * 0.9)) {
      await recordCapAlert("warning");
    }

    return NextResponse.json({ ok: true, id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error("[INQUIRY POST]", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
