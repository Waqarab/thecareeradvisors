"use client";

import { useEffect } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { getDatabase, ref, push, set } from "firebase/database";
import { app } from "@/firebase/config";

export default function TrafficTracker() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    // 1. DO NOT track if the user is in the admin panel
    if (pathname?.startsWith("/admin")) return;

    // 2. Check if this specific device has already been tracked
    // This will persist even if they close tabs or refresh, until cache is cleared.
    if (localStorage.getItem("tca_device_tracked") === "true") return;

    let source = "Direct / Other";
    const utmSource = searchParams.get("utm_source")?.toLowerCase();
    const refParam = searchParams.get("ref")?.toLowerCase();
    const referrer = document.referrer.toLowerCase() || "";

    if (utmSource?.includes("meta") || utmSource?.includes("fb") || utmSource?.includes("facebook")) source = "Meta Ads";
    else if (utmSource?.includes("instagram") || utmSource?.includes("ig")) source = "Instagram Ads";
    else if (utmSource?.includes("google")) source = "Google Ads";
    else if (refParam?.includes("whatsapp") || utmSource?.includes("whatsapp")) source = "WhatsApp";
    else if (referrer.includes("instagram.com")) source = "Instagram";
    else if (referrer.includes("facebook.com")) source = "Facebook";
    else if (referrer.includes("google.")) source = "Google Search";
    else if (referrer.includes("wa.me") || referrer.includes("whatsapp")) source = "WhatsApp";

    // Save source locally in case you want to attach it to a lead form submission later
    localStorage.setItem("tca_user_source", source);

    try {
      const rtdb = getDatabase(app);
      const today = new Date().toISOString().split("T")[0];
      
      const newVisitRef = push(ref(rtdb, `stats/page_views/${today}`));
      
      set(newVisitRef, {
        source: source,
        timestamp: new Date().toISOString(),
        userAgent: window.navigator.userAgent,
        landingPage: pathname
      }).then(() => {
        // 3. ONLY mark as tracked after successfully writing to the database
        localStorage.setItem("tca_device_tracked", "true");
      });

    } catch (error) {
      console.error("Traffic tracking failed:", error);
    }

  }, [searchParams, pathname]);

  return null;
}