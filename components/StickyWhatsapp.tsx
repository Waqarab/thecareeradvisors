"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export default function StickyWhatsApp() {
  const pathname = usePathname();
  const [isHiddenByMenu, setIsHiddenByMenu] = useState(false);

  // Listen for the ultra-fast custom event dispatched by the Navbar
  useEffect(() => {
    const handleMenuToggle = (e: Event) => {
      setIsHiddenByMenu((e as CustomEvent).detail);
    };

    window.addEventListener("mobileMenuToggle", handleMenuToggle);
    return () => window.removeEventListener("mobileMenuToggle", handleMenuToggle);
  }, []);

  // Completely unmount the component to save memory when in the Admin dashboard
  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.div
      className="fixed bottom-6 left-6 z-[90] cursor-grab active:cursor-grabbing"
      drag
      dragConstraints={{ left: 0, right: 300, top: -500, bottom: 0 }} 
      dragElastic={0.1} 
      initial={{ scale: 0, opacity: 0 }}
      // Dynamically animate out of the way if the mobile menu is opened
      animate={
        isHiddenByMenu 
          ? { scale: 0.8, opacity: 0, y: 40, pointerEvents: "none" } 
          : { scale: 1, opacity: 1, y: 0, pointerEvents: "auto" }
      }
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        // Remove the 1-second delay if it's just hiding for the menu
        delay: isHiddenByMenu ? 0 : 1 
      }}
    >
      <motion.a
        href="https://wa.me/+916005152350"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_8px_30px_rgba(37,211,102,0.4)] relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
      >
        <span className="absolute w-full h-full bg-[#25D366] rounded-full animate-ping opacity-30"></span>
        
        {/* OFFICIAL WHATSAPP LOGO SVG */}
        <svg 
          viewBox="0 0 24 24" 
          fill="currentColor" 
          className="w-5 h-5 relative z-10 ml-0.5 mt-0.5" // Slight offset for optical balance
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </motion.a>
    </motion.div>
  );
}