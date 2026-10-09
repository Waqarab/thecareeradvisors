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
import { maybeRunCleanup } from "./rate-limit-cleanup";

export async function requireSuperAdmin(req: Request) {
  maybeRunCleanup();
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

export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown-ip";
}

export const rateLimitByIp = {
  check: async (ip: string, layer: string, max: number, windowMs: number) => {
    const key = `ip_${ip}:${layer}`.replace(/[.#$\[\]\/]/g, "_");
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
  commit: async (ip: string, layer: string, windowMs: number) => {
    const key = `ip_${ip}:${layer}`.replace(/[.#$\[\]\/]/g, "_");
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

export const rateLimitByEmail = {
  check: async (email: string, layer: string, max: number, windowMs: number) => {
    const safeEmail = email.toLowerCase().trim();
    const key = `email_${safeEmail}:${layer}`.replace(/[.#$\[\]\/]/g, "_");
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
  commit: async (email: string, layer: string, windowMs: number) => {
    const safeEmail = email.toLowerCase().trim();
    const key = `email_${safeEmail}:${layer}`.replace(/[.#$\[\]\/]/g, "_");
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
  reset: async (email: string, layer: string) => {
    const safeEmail = email.toLowerCase().trim();
    const key = `email_${safeEmail}:${layer}`.replace(/[.#$\[\]\/]/g, "_");
    await admin.database().ref(`rate_limits/${key}`).remove();
  },
};

// Cumulative failure lockout.
// The failure count NEVER resets by time — only on successful login.
// Thresholds: 5→1m, 10→5m, 15→30m, and every 5 after 20 → 60m cap.
function getLockDurationMs(failCount: number): number {
  if (failCount === 5) return 1 * 60 * 1000;
  if (failCount === 10) return 5 * 60 * 1000;
  if (failCount === 15) return 30 * 60 * 1000;
  if (failCount >= 20 && failCount % 5 === 0) return 60 * 60 * 1000;
  return 0;
}

type LockoutState = {
  failCount: number;    // cumulative failures since last successful login
  lockedUntil: number;  // epoch ms; 0 = not locked
  lastAttemptAt: number;
};

function lockoutKey(email: string): string {
  const safeEmail = email.toLowerCase().trim();
  return `email_${safeEmail}:auth_lockout`.replace(/[.#$\[\]\/]/g, "_");
}

export const emailLockout = {
  /**
   * Returns { locked: false } if not currently locked,
   * or { locked: true, retryAfter: <seconds> } if locked.
   */
  check: async (email: string) => {
    const ref = admin.database().ref(`rate_limits/${lockoutKey(email)}`);
    const snap = await ref.get();
    const now = Date.now();
    const state = snap.val() as LockoutState | null;

    if (!state?.lockedUntil || state.lockedUntil <= now) {
      return { locked: false as const };
    }

    return {
      locked: true as const,
      retryAfter: Math.max(0, Math.ceil((state.lockedUntil - now) / 1000)),
    };
  },

  /**
   * Record a failed attempt. Returns { locked: true, retryAfter } if this
   * failure triggered or extended a lock, else { locked: false }.
   * Uses an RTDB transaction to prevent race conditions.
   */
  recordFailure: async (email: string) => {
    const ref = admin.database().ref(`rate_limits/${lockoutKey(email)}`);
    const now = Date.now();

    const result = await ref.transaction((current: LockoutState | null) => {
      const state: LockoutState = current ?? {
        failCount: 0,
        lockedUntil: 0,
        lastAttemptAt: 0,
      };

      state.failCount += 1;
      state.lastAttemptAt = now;

      const lockMs = getLockDurationMs(state.failCount);
      if (lockMs > 0) {
        state.lockedUntil = now + lockMs;
      }

      return state;
    });

    const finalState = result.snapshot.val() as LockoutState | null;
    if (finalState?.lockedUntil && finalState.lockedUntil > now) {
      return {
        locked: true as const,
        retryAfter: Math.ceil((finalState.lockedUntil - now) / 1000),
        failCount: finalState.failCount,
      };
    }
    return { locked: false as const, failCount: finalState?.failCount ?? 0 };
  },

  /**
   * Reset the lockout state after a successful login.
   */
  reset: async (email: string) => {
    await admin.database().ref(`rate_limits/${lockoutKey(email)}`).remove();
  },
};
