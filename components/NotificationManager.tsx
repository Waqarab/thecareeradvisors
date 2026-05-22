"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { BellRing, X } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { usePathname } from "next/navigation";

// Utility to recursively play sound X times flawlessly
const playNotificationAudio = (fileUrl: string, count: number) => {
  let playCount = 0;
  
  const playNext = () => {
    if (playCount >= count) return;
    
    try {
      const audio = new Audio(fileUrl);
      audio.volume = 0.8;
      
      audio.onended = () => {
        playCount++;
        if (playCount < count) {
          // Add a slight 200ms delay between rings so they don't overlap awkwardly
          setTimeout(playNext, 200);
        }
      };
      
      audio.play().catch(e => {
        // Browsers block autoplay if user hasn't interacted with page yet. Ignore safely.
      });
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  };

  playNext();
};

export default function NotificationManager() {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    if (isAdminRoute) return;

    const q = query(collection(db, "notifications"), where("isActive", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const seenIds = JSON.parse(localStorage.getItem("seenNotifications") || "[]");
      let updatedSeenIds = [...seenIds];
      
      let hasNewAlerts = false;
      let latestAlertConfig: any = null;

      // Scan for any NEW notifications
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const id = change.doc.id;
          if (!seenIds.includes(id)) {
            updatedSeenIds.push(id);
            hasNewAlerts = true;
            latestAlertConfig = change.doc.data();
          }
        }
      });

      if (hasNewAlerts && latestAlertConfig) {
        // 1. Play Sound (if admin hasn't muted it)
        // Checks explicitly against 'false', defaults to true.
        if (latestAlertConfig.playSound !== false) {
          const soundToPlay = latestAlertConfig.soundFile || "/notificationtca.mp3";
          const timesToRing = latestAlertConfig.soundCount || 2;
          
          playNotificationAudio(soundToPlay, timesToRing);
        }

        // 2. Tiny Toast directing user to the Navbar (Syncs exactly with audio)
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

        // Save progress so we don't alert the user again on page reload
        localStorage.setItem("seenNotifications", JSON.stringify(updatedSeenIds));
      }
    });

    return () => unsubscribe();
  }, [isAdminRoute]);

  // Renders nothing visually.
  return null; 
}