"use client";

import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="relative w-full flex items-center justify-center py-10 md:py-14 overflow-hidden">
      
      {/* Left Line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="origin-right h-[2px] w-1/3 md:w-1/4 rounded-full 
        bg-gradient-to-r from-primary/10 via-primary/80 to-primary/10
        shadow-[0_0_18px_rgba(66,99,235,0.45)]"
      />

      {/* Center Glow */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.25 }}
        className="relative mx-5"
      >
        {/* Pulsing Ring */}
        <div className="absolute inset-0 rounded-full animate-ping bg-primary/30 blur-sm" />

        {/* Main Dot */}
        <div
          className="relative w-3 h-3 rounded-full bg-primary
          shadow-[0_0_25px_rgba(66,99,235,0.9)]"
        />
      </motion.div>

      {/* Right Line */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="origin-left h-[2px] w-1/3 md:w-1/4 rounded-full 
        bg-gradient-to-l from-primary/10 via-primary/80 to-primary/10
        shadow-[0_0_18px_rgba(66,99,235,0.45)]"
      />
    </div>
  );
}