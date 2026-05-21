"use client";

import { useState, useEffect } from "react";

export default function Preloader({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // --- 1. CACHE CHECK: Do we need to show the preloader? ---
    const CACHE_KEY = "tca_preloader_timestamp";
    const CACHE_EXPIRY_HOURS = 24; // Show the preloader only once per day
    
    const cachedTime = localStorage.getItem(CACHE_KEY);
    
    if (cachedTime) {
      const hoursPassed = (Date.now() - parseInt(cachedTime, 10)) / (1000 * 60 * 60);
      
      // If they visited within the last 24 hours, the site is already cached locally.
      // Skip the preloader instantly!
      if (hoursPassed < CACHE_EXPIRY_HOURS) {
        setIsLoading(false);
        onLoadingComplete();
        // A tiny timeout ensures the DOM is ready before we unleash the animations
        setTimeout(() => window.dispatchEvent(new Event("app-ready")), 50);
        return; // Stop running the rest of the preloader logic
      }
    }

    // --- 2. RUN FULL PRELOADER: (First visit or cache expired) ---
    const minLoadTime = 2500; 
    const startTime = Date.now();
    let isMounted = true;

    const finishLoading = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        if (!isMounted) return;
        
        // Save the current time so they don't see it again for 24 hours
        localStorage.setItem(CACHE_KEY, Date.now().toString());
        
        setIsLoading(false);
        onLoadingComplete();
        
        // Unleash the animations
        window.dispatchEvent(new Event("app-ready"));
      }, remainingTime);
    };

    // Actively wait for images and fonts to download
    const preloadAssets = async () => {
      try {
        const images = Array.from(document.images);
        const imagePromises = images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve; // Continue even if an image fails to load
          });
        });

        const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();
        
        await Promise.all([...imagePromises, fontPromise]);
      } catch (error) {
        console.warn("Preload interrupted:", error);
      } finally {
        if (document.readyState === "complete") {
          finishLoading();
        } else {
          window.addEventListener("load", finishLoading);
        }
      }
    };

    preloadAssets();

    // Fallback safety net: never show preloader for more than 6 seconds
    const fallbackTimeout = setTimeout(finishLoading, 6000); 

    return () => {
      isMounted = false;
      window.removeEventListener("load", finishLoading);
      clearTimeout(fallbackTimeout);
    };
  }, [onLoadingComplete]);

  // INSTANT CUT: Renders nothing if bypassed or finished
  if (!isLoading) return null; 

  return (
    <div className="fixed inset-0 z-[9999] bg-[#F2F3F4] flex items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline 
        className="w-80 md:w-[400px] lg:w-[500px] h-auto pointer-events-none"
        style={{ 
          mixBlendMode: "multiply", 
          filter: "contrast(1.05) brightness(1.02)" 
        }}
      >
        <source src="https://res.cloudinary.com/drytpdpx3/video/upload/v1/mp__wdjltm.webm" type="video/webm" />
        <source src="https://res.cloudinary.com/drytpdpx3/video/upload/v1/mp__wdjltm.mp4" type="video/mp4" />
      </video>
    </div>
  );
}