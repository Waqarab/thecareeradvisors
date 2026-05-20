"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BellRing, X, ExternalLink, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export default function NotificationManager() {
  const [popup, setPopup] = useState<any | null>(null);
  const pathname = usePathname();
  
  // Detect if we are on the admin panel
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    // 🛑 STOP: If we are in the admin dashboard, completely ignore this file.
    // We don't want admins getting spammed by their own public notifications.
    if (isAdminRoute) return;

    // 1. Request Notification Permissions Silently (Only for public users)
    if ("Notification" in window && Notification.permission === "default") {
      setTimeout(() => Notification.requestPermission(), 5000);
    }

    const q = query(collection(db, "notifications"), where("isActive", "==", true));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const seenIds = JSON.parse(localStorage.getItem("seenNotifications") || "[]");
      let updatedSeenIds = [...seenIds];

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          const id = change.doc.id;

          // Only trigger if the public user hasn't seen it yet
          if (!seenIds.includes(id)) {
            
            updatedSeenIds.push(id);

            // TYPE 1: BOTTOM TOAST
            if (data.type === "toast") {
              try {
                const audio = new Audio('/notificationtca.mp3');
                audio.volume = 0.7;
                audio.play().catch(() => {});
              } catch (e) {}

              toast.custom((t) => (
                <div className={`relative overflow-hidden w-full sm:w-96 p-5 rounded-2xl shadow-2xl border flex flex-col gap-3 transition-all ${
                  data.theme === 'destructive' ? 'bg-destructive text-destructive-foreground border-red-400' :
                  data.theme === 'success' ? 'bg-green-600 text-white border-green-400' :
                  'bg-primary text-primary-foreground border-blue-400'
                }`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="mt-0.5 shrink-0">
                      {data.theme === 'destructive' ? <AlertTriangle className="w-5 h-5" /> :
                       data.theme === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                       <Info className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-extrabold font-heading text-sm tracking-wide leading-tight mb-1">{data.title}</h4>
                      <p className="text-xs opacity-90 leading-relaxed font-medium">{data.message}</p>
                    </div>
                    <button onClick={() => toast.dismiss(t)} className="shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"><X className="w-4 h-4" /></button>
                  </div>
                  {data.linkUrl && (
                    <a href={data.linkUrl} target="_blank" onClick={() => toast.dismiss(t)} className="relative z-10 flex items-center justify-center gap-2 w-full py-2.5 mt-1 bg-white/20 hover:bg-white/30 text-white text-xs font-bold rounded-xl transition-colors">
                      {data.linkText || "View Details"} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ), { duration: 10000 });
            }
            
            // TYPE 2: CENTER POPUP
            if (data.type === "popup") {
              setPopup({ id, ...data });
            }
          }
        }
      });

      // Save to local storage for public users
      localStorage.setItem("seenNotifications", JSON.stringify(updatedSeenIds));
    });

    return () => unsubscribe();
  }, [isAdminRoute]);

  // 🛑 STOP: If we are in the admin dashboard, render absolutely nothing.
  if (isAdminRoute) return null;

  return (
    <AnimatePresence>
      {popup && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"> 
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative border-t-8 bg-card ${
              popup.theme === 'destructive' ? 'border-destructive' : popup.theme === 'success' ? 'border-green-500' : 'border-primary'
            }`}
          >
            <button onClick={() => setPopup(null)} className="absolute top-4 right-4 text-foreground/50 hover:bg-muted p-1.5 rounded-full z-10"><X className="w-5 h-5" /></button>
            <div className="p-8 text-center mt-2">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ${
                popup.theme === 'destructive' ? 'bg-destructive/10 text-destructive' : 
                popup.theme === 'success' ? 'bg-green-500/10 text-green-500' : 
                'bg-primary/10 text-primary'
              }`}>
                <BellRing className="w-8 h-8 animate-bounce" style={{ animationIterationCount: 3 }} />
              </div>
              <h3 className="text-2xl font-extrabold font-heading mb-3 text-foreground">{popup.title}</h3>
              <p className="text-foreground/70 mb-6 font-medium">{popup.message}</p>
              {popup.linkUrl && (
                <a href={popup.linkUrl} target="_blank" onClick={() => setPopup(null)} className="flex items-center justify-center gap-2 w-full py-4 bg-background border-2 border-border/50 text-foreground font-bold rounded-xl mb-3 hover:bg-muted transition-colors">
                  {popup.linkText || "View Details"} <ExternalLink className="w-4 h-4" />
                </a>
              )}
              <button onClick={() => setPopup(null)} className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl active:scale-95 transition-all">
                Acknowledge Alert
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}