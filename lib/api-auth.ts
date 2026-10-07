import crypto from "crypto";

import { admin } from "@/lib/firebase-admin";

export const rateLimit = {
  check: async (id: string, layer: string, max: number, windowMs: number) => {
    const key = `${id}:${layer}`.replace(/[.#$\[\]\/]/g, "_");
    const ref = admin.database().ref(`rate_limits/${key}`);
    const snap = await ref.get();
    const now = Date.now();
    const data = snap.val() as { count: number; resetTime: number } | null;

    if (!data || now > data.resetTime) {
      return { success: true, retryAfter: 0, remaining: max };
    }
    const success = data.count < max;
    return {
      success,
      retryAfter: Math.max(0, Math.ceil((data.resetTime - now) / 1000)),
      remaining: Math.max(0, max - data.count),
    };
  },
  commit: async (id: string, layer: string, windowMs: number) => {
    const key = `${id}:${layer}`.replace(/[.#$\[\]\/]/g, "_");
    const ref = admin.database().ref(`rate_limits/${key}`);
    const snap = await ref.get();
    const now = Date.now();
    const data = snap.val() as { count: number; resetTime: number } | null;

    if (!data || now > data.resetTime) {
      await ref.set({ count: 1, resetTime: now + windowMs });
    } else {
      await ref.update({ count: data.count + 1 });
    }
  },
};

export function getOrCreateBrowserId(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/tca_browser_id=([^;]+)/);
  let browserId = match ? match[1] : null;
  let setCookie: string | null = null;

  if (!browserId) {
    browserId = crypto.randomUUID();
    const isProd = process.env.NODE_ENV === "production";
    setCookie = `tca_browser_id=${browserId}; Path=/; Max-Age=${365 * 24 * 60 * 60}; HttpOnly; SameSite=Lax${isProd ? "; Secure" : ""}`;
  }

  return { id: browserId, setCookie };
}

import { NextResponse } from "next/server";

export async function requireSuperAdmin(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/(?:^|;\s*)(?:__Host-)?tca_session=([^;]+)/);
  const sessionCookie = match ? match[1] : null;

  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized. Missing session." }, { status: 401 });
  }

  try {
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
    if (decodedClaims.email !== process.env.SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden. Super Admin only." }, { status: 403 });
    }
    return decodedClaims;
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized. Invalid session." }, { status: 401 });
  }
}
