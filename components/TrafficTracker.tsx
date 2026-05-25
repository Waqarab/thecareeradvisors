"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function TrafficTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only run this once per session
    if (sessionStorage.getItem("tca_source_tracked")) return;

    let source = "Direct / Other";
    const utmSource = searchParams.get("utm_source")?.toLowerCase();
    const refParam = searchParams.get("ref")?.toLowerCase();
    const referrer = document.referrer.toLowerCase();

    // 1. Check Explicit URL Tags (Meta Ads, WhatsApp links you share)
    if (utmSource?.includes("meta") || utmSource?.includes("fb") || utmSource?.includes("facebook")) source = "Meta Ads";
    else if (utmSource?.includes("instagram") || utmSource?.includes("ig")) source = "Instagram Ads";
    else if (utmSource?.includes("google")) source = "Google Ads";
    else if (refParam?.includes("whatsapp") || utmSource?.includes("whatsapp")) source = "WhatsApp";
    
    // 2. Check Organic Referrer (They clicked a link on a website naturally)
    else if (referrer.includes("instagram.com")) source = "Instagram";
    else if (referrer.includes("facebook.com")) source = "Facebook";
    else if (referrer.includes("google.")) source = "Google Search";
    else if (referrer.includes("wa.me") || referrer.includes("whatsapp")) source = "WhatsApp";

    // Save to localStorage so it survives page navigation
    localStorage.setItem("tca_user_source", source);
    sessionStorage.setItem("tca_source_tracked", "true"); // Prevent running twice

    // Optional: If you have an API route to track visits to RTDB, call it here!
    // fetch('/api/track-visit', { method: 'POST', body: JSON.stringify({ source }) });

  }, [searchParams]);

  return null; // This component is invisible
}