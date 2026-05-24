"use client";

import { useState, useEffect } from "react";

// Helper to forcefully load images into browser cache
const preloadImage = (src: string) => {
  return new Promise((resolve) => {
    if (!src) return resolve(true);
    const img = new window.Image();
    img.src = src;
    img.onload = () => resolve(true);
    img.onerror = () => resolve(true); // Always resolve to prevent hanging the site
  });
};

export default function Preloader({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const startTime = Date.now();
    const minLoadTime = 2500; // Minimum time to show your branding video
    const CACHE_KEY = "tca_preloader_timestamp";
    const CACHE_EXPIRY_HOURS = 2; // Reduced to 2 hours for fresher data

    const finishLoading = () => {
      if (!isMounted) return;
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        setIsLoading(false);
        onLoadingComplete();
        window.dispatchEvent(new Event("app-ready"));
      }, remainingTime);
    };

    const executeHeavyPreload = async () => {
      try {
        // 1. PREFETCH DATA FIRST
        const res = await fetch("/api/universities");
        const data = await res.json();
        
        // Save to LocalStorage (NOT sessionStorage) so it survives tab closes
        if (data && data.length > 0) {
          localStorage.setItem("tca_universities_cache", JSON.stringify(data));
        }

        // 2. EXTRACT & PRELOAD CRITICAL IMAGES
        const imageUrlsToPreload: string[] = [
          // Hardcode Hero Images so the top of the page is buttery smooth
          "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto,f_auto,w_800/v1779545094/copy_of_img-20250920-wa0013jpg_nar0fd.webp",
          "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto,f_auto,w_800/v1779551416/20251110_151107.jpg_tca5p1.jpg",
          "/logo.png"
        ];

        // Safely extract thumbnails from the database (Limit to top 15 to prevent network choking)
        if (Array.isArray(data)) {
          data.slice(0, 15).forEach((uni: any) => {
            if (uni.thumbnail) imageUrlsToPreload.push(uni.thumbnail);
            else if (uni.image) imageUrlsToPreload.push(uni.image);
            else if (uni.logo) imageUrlsToPreload.push(uni.logo);
          });
        }

        // 3. FIRE ALL REQUESTS IN PARALLEL
        const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();
        const imagePromises = imageUrlsToPreload.filter(Boolean).map(preloadImage);

        await Promise.all([...imagePromises, fontPromise]);

      } catch (error) {
        console.warn("Preloader data fetch interrupted:", error);
      } finally {
        finishLoading();
      }
    };

    // CACHE LOGIC: Only skip preload if time hasn't expired AND data actually exists in storage
    const cachedTime = localStorage.getItem(CACHE_KEY);
    const hasCachedData = localStorage.getItem("tca_universities_cache");
    let shouldRunFullPreload = true;

    if (cachedTime && hasCachedData) {
      const hoursPassed = (Date.now() - parseInt(cachedTime, 10)) / (1000 * 60 * 60);
      if (hoursPassed < CACHE_EXPIRY_HOURS) {
        shouldRunFullPreload = false;
      }
    }

    if (shouldRunFullPreload) {
      localStorage.setItem(CACHE_KEY, Date.now().toString());
      executeHeavyPreload();
    } else {
      // Data is cached and fresh. Just wait out the video timer.
      finishLoading();
    }

    // Safety Fallback: NEVER trap the user on the loading screen for more than 7 seconds
    const fallbackTimeout = setTimeout(finishLoading, 7000); 

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimeout);
    };
  }, [onLoadingComplete]);

  if (!isLoading) return null; 

  return (
    <div className="fixed inset-0 z-[9999] bg-[#F2F3F4] flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline 
        className="w-80 md:w-[400px] lg:w-[500px] h-auto pointer-events-none"
        style={{ mixBlendMode: "multiply", filter: "contrast(1.05) brightness(1.02)" }}
      >
        <source src="https://res.cloudinary.com/drytpdpx3/video/upload/v1/mp__wdjltm.webm" type="video/webm" />
        <source src="https://res.cloudinary.com/drytpdpx3/video/upload/v1/mp__wdjltm.mp4" type="video/mp4" />
      </video>
    </div>
  );
}