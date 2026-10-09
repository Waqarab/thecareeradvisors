import { admin } from "@/lib/firebase-admin";

const CLEANUP_THROTTLE_MS = 6 * 60 * 60 * 1000; // 6 hours
const MARKER_PATH = "rate_limits_meta/last_cleanup";

/**
 * Fire-and-forget wrapper. Never awaits, never throws.
 * Safe to call from any request handler.
 */
export function maybeRunCleanup(): void {
  runCleanup().catch((err) => {
    console.error("[rate-limit-cleanup] failed:", err);
  });
}

async function runCleanup(): Promise<void> {
  const markerRef = admin.database().ref(MARKER_PATH);
  const now = Date.now();

  // Atomically claim the cleanup slot.
  const result = await markerRef.transaction((current) => {
    if (current === null || now - current > CLEANUP_THROTTLE_MS) {
      return now;
    }
    return undefined; // abort — another request cleaned recently
  });

  if (!result.committed) {
    return; // someone else handled it, or it ran recently
  }

  // We won the claim — do the actual cleanup.
  const snap = await admin.database().ref("rate_limits").get();
  if (!snap.exists()) return;

  const deletions: Promise<void>[] = [];
  snap.forEach((child) => {
    const data = child.val();
    if (data && typeof data.resetTime === "number" && data.resetTime < now) {
      deletions.push(child.ref.remove());
    }
  });

  await Promise.all(deletions);

  console.log(
    `[rate-limit-cleanup] deleted ${deletions.length} expired entries`
  );
}
