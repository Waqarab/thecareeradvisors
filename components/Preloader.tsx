"use client";

import { useState, useEffect } from "react";

export default function Preloader({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Keeps the animation on screen for at least 2.5 seconds so it plays beautifully
    const minLoadTime = 2500; 
    const startTime = Date.now();
    let isMounted = true;

    const handleLoadComplete = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minLoadTime - elapsedTime);

      setTimeout(() => {
        if (!isMounted) return;
        setIsLoading(false);
        onLoadingComplete();
      }, remainingTime);
    };

    if (document.readyState === "complete") {
      handleLoadComplete();
    } else {
      window.addEventListener("load", handleLoadComplete);
      const fallbackTimeout = setTimeout(handleLoadComplete, 6000); 

      return () => {
        isMounted = false;
        window.removeEventListener("load", handleLoadComplete);
        clearTimeout(fallbackTimeout);
      };
    }
    
    return () => {
      isMounted = false;
    }
  }, [onLoadingComplete]);

  // INSTANT CUT: Renders nothing when loading is done
  if (!isLoading) return null; 

  return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center overflow-hidden">
      
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