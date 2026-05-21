"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { BellRing, X } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { usePathname } from "next/navigation";

export default function NotificationManager() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    // Ignore if in Admin Dashboard
    if (isAdminRoute) return;

    const q = query(collection(db, "notifications"), where("isActive", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const seenIds = JSON.parse(localStorage.getItem("seenNotifications") || "[]");
      let updatedSeenIds = [...seenIds];
      let hasNewAlerts = false;

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const id = change.doc.id;
          if (!seenIds.includes(id)) {
            updatedSeenIds.push(id);
            hasNewAlerts = true;
          }
        }
      });

      if (hasNewAlerts) {
        // 1. Play Sound Twice using the onended callback
        try {
          const audio = new Audio('/notificationtca.mp3');
          audio.volume = 0.8;
          audio.play().then(() => {
            audio.onended = () => {
              const audio2 = new Audio('/notificationtca.mp3');
              audio2.volume = 0.8;
              audio2.play().catch(() => {});
            };
          }).catch(() => {});
        } catch (e) {}

        // 2. Tiny Toast directing user to the Navbar
        toast.custom((t) => (
          <div className="bg-card border border-border/50 shadow-2xl rounded-2xl p-4 flex items-center gap-4 w-auto sm:w-80 pointer-events-auto">
            <div className="w-10 h-10 bg-primary/10 text-primary flex items-center justify-center rounded-full shrink-0">
              <BellRing className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-sm">New Announcement</h4>
              <p className="text-xs text-foreground/60">Check the bell icon in the menu!</p>
            </div>
            <button onClick={() => toast.dismiss(t)} className="p-1.5 hover:bg-muted rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        ), { duration: 6000, position: "top-center" });

        localStorage.setItem("seenNotifications", JSON.stringify(updatedSeenIds));
      }
    });

    return () => unsubscribe();
  }, [isAdminRoute]);

  // Renders nothing visually. The Navbar Bell handles the actual reading now.
  return null; 
}