"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function Preloader({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const CACHE_KEY = "tca_preloader_timestamp";
    const CACHE_EXPIRY_HOURS = 24; 
    const cachedTime = localStorage.getItem(CACHE_KEY);
    
    if (cachedTime) {
      const hoursPassed = (Date.now() - parseInt(cachedTime, 10)) / (1000 * 60 * 60);
      if (hoursPassed < CACHE_EXPIRY_HOURS) {
        setIsLoading(false);
        onLoadingComplete();
        setTimeout(() => window.dispatchEvent(new Event("app-ready")), 50);
        return; 
      }
    }

    const minLoadTime = 2500; 
    const startTime = Date.now();
    let isMounted = true;

    const finishLoading = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        if (!isMounted) return;
        localStorage.setItem(CACHE_KEY, Date.now().toString());
        setIsLoading(false);
        onLoadingComplete();
        window.dispatchEvent(new Event("app-ready"));
      }, remainingTime);
    };

    // 🚀 ASSET & DATA PRELOADING
    const preloadAssets = async () => {
      try {
        // 1. Preload Images
        const images = Array.from(document.images);
        const imagePromises = images.map((img) => {
          if (img.complete) return Promise.resolve();
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        });

        // 2. Preload Fonts
        const fontPromise = document.fonts ? document.fonts.ready : Promise.resolve();

       // 3. PREFETCH FROM VERCEL CACHE IN BACKGROUND (ZERO FIREBASE READS)
        const fetchUniversities = async () => {
          try {
            const res = await fetch("/api/universities");
            const data = await res.json();
            // Save to temporary session storage so pages can access it instantly
            sessionStorage.setItem("tca_universities_cache", JSON.stringify(data));
          } catch (err) {
            console.warn("Failed to prefetch data", err);
          }
        };

        // Wait for all 3 tasks to finish
        await Promise.all([...imagePromises, fontPromise, fetchUniversities()]);
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
    const fallbackTimeout = setTimeout(finishLoading, 6000); 

    return () => {
      isMounted = false;
      window.removeEventListener("load", finishLoading);
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