"use client";

import { motion } from "framer-motion";

export default function SectionDivider() {
  return (
    <div className="w-full flex items-center justify-center py-8 md:py-12 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-[1px] w-1/3 md:w-1/4 bg-gradient-to-r from-transparent to-primary/40"
      />
      
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-2 h-2 rounded-full bg-primary mx-4 shadow-[0_0_15px_rgba(66,99,235,0.6)]" // Glaucous blue glow
      />
      
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="h-[1px] w-1/3 md:w-1/4 bg-gradient-to-l from-transparent to-primary/40"
      />
    </div>
  );
}