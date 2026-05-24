"use client";

import SplashCursor from "@/components/SplashCursor";

export default function SplashCursorEffect() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[40]">
      <SplashCursor
        SIM_RESOLUTION={128}
        // Lower this slightly if you still get lag on laptops. 1024 is highly optimized.
        DYE_RESOLUTION={1024} 
        
        // Lower dissipation makes the fluid linger and blend smoothly instead of blinking out
        DENSITY_DISSIPATION={2.5} 
        VELOCITY_DISSIPATION={2.0} 
        PRESSURE={0.1}
        CURL={3}
        
        // CRITICAL FIX: Keep this very low for smooth, precise trailing lines
        SPLAT_RADIUS={0.005} 
        
        // Lower force keeps the fluid from "exploding" too violently
        SPLAT_FORCE={3000} 
        
        COLOR_UPDATE_SPEED={15}
      />
    </div>
  );
}