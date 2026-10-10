import { admin } from "@/lib/firebase-admin";

function getUtcDateKey() {
  return new Date().toISOString().split("T")[0];
}

export async function getDailyLimit(): Promise<number> {
  const ref = admin.database().ref("settings/inquiry_daily_limit");
  const snap = await ref.get();
  if (snap.exists()) {
    const val = snap.val();
    if (typeof val === "number") {
      return val;
    }
  }
  return 150;
}

export async function getTodayCount(): Promise<number> {
  const dateKey = getUtcDateKey();
  const ref = admin.database().ref(`inquiry_counts/${dateKey}`);
  const snap = await ref.get();
  if (snap.exists()) {
    const val = snap.val();
    if (typeof val === "number") {
      return val;
    }
  }
  return 0;
}

export async function incrementTodayCount(): Promise<number> {
  const dateKey = getUtcDateKey();
  const ref = admin.database().ref(`inquiry_counts/${dateKey}`);
  
  const result = await ref.transaction((currentValue) => {
    return (currentValue || 0) + 1;
  });
  
  if (result.committed) {
    return result.snapshot.val() as number;
  }
  
  // Fallback in case of an issue
  const snap = await ref.get();
  return (snap.val() as number) || 0;
}

export async function recordCapAlert(level: "warning" | "full"): Promise<void> {
  const dateKey = getUtcDateKey();
  const ref = admin.database().ref(`inquiry_alerts/${dateKey}`);
  
  await ref.transaction((current) => {
    // Only write if it doesn't already exist for this level (or worse level).
    // If 'full' exists, don't overwrite with 'warning'.
    if (current && current.level === "full") {
      return; // abort transaction
    }
    if (current && current.level === level) {
      return; // abort transaction
    }
    return { level, triggeredAt: Date.now() };
  });
}

export async function clearTodayAlert(): Promise<void> {
  const dateKey = getUtcDateKey();
  const ref = admin.database().ref(`inquiry_alerts/${dateKey}`);
  await ref.remove();
}
