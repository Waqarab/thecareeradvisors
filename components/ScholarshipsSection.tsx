"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe2, BookOpen, Banknote, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ScholarshipsSection() {
  // Fast, hardcoded teasers to avoid network delays on old phones
  const teasers = [
    {
      title: "SAARC Quota Grants",
      desc: "Special tuition concessions for Indian students in premium Bangladesh colleges.",
      icon: BookOpen
    },
    {
      title: "European Pathway",
      desc: "Access regional Italian scholarships covering tuition, meals, and hostel expenses.",
      icon: Globe2
    },
    {
      title: "Merit-Based Waivers",
      desc: "Up to 50% tuition discounts in top universities across Egypt, Kazakhstan, and China.",
      icon: Banknote
    }
  ];

  return (
    <section className="py-20 md:py-28 bg-[#F2F3F4] relative overflow-hidden z-10 border-y border-[#AEC6CF]/30">
      
      {/* 🌟 GOLDEN STAMP (Pure CSS for max performance) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
        className="absolute top-6 left-4 md:top-12 md:left-12 z-20 w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl"
      >
         <div className="relative w-full h-full flex items-center justify-center">
            {/* Rotating Outer Dashed Seal */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] rounded-full shadow-[0_0_20px_rgba(191,149,63,0.4)] border-2 border-dashed border-white"
            ></motion.div>
            {/* Inner Solid Gold Circle */}
            <div className="absolute inset-1.5 md:inset-2 bg-gradient-to-tr from-[#B38728] to-[#BF953F] rounded-full flex flex-col items-center justify-center border border-[#FCF6BA] shadow-inner">
               <Award className="w-7 h-7 md:w-10 md:h-10 text-[#FCF6BA] mb-0.5" />
               <span className="text-[8px] md:text-xs font-black uppercase text-[#FCF6BA] tracking-wider leading-none px-1 text-center">Scholarship</span>
            </div>
         </div>
      </motion.div>

      {/* Background Brand Accent */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-[#6082B6]/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      {/* Container - Added top padding on mobile so stamp doesn't overlap text */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl pt-16 md:pt-0">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* LEFT: Title & Intro */}
          <div className="lg:w-1/2 w-full text-center lg:text-left relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3A5F8B]/10 border border-[#3A5F8B]/20 text-[#3A5F8B] text-[10px] md:text-xs font-bold uppercase tracking-widest mb-6"
            >
              <Banknote className="w-3 h-3 md:w-4 md:h-4" /> Financial Aid
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#22354a] mb-5 tracking-tight leading-[1.2] md:leading-[1.1]">
              Unlock Your <br className="hidden md:block" /> Global <br className="md:hidden" />
              <span className="relative inline-block mt-1 md:mt-2 px-2">
                <span className="relative z-10 text-[#1b2f45]">Scholarships</span>
                {/* 🌟 GOLDEN HIGHLIGHT ANIMATION */}
                <motion.span 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "circOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-[#FCF6BA] to-[#BF953F]/40 -z-10 rounded-lg origin-left border-b-4 border-[#BF953F]"
                />
              </span>
            </h2>

            {/* Smaller Text As Requested */}
            <p className="text-sm md:text-base text-[#3A5F8B]/80 font-medium leading-relaxed mb-8 max-w-md mx-auto lg:mx-0">
              Talent shouldn't be limited by budget. Discover high-value funding, tuition concessions, and fully-funded pathways across Europe and Asia.
            </p>

            {/* Highly Responsive Button */}
            <Link href="/scholarships" className="inline-block">
              <Button size="lg" className="bg-[#D85C34] hover:bg-[#b84c2a] text-white text-sm md:text-base px-6 py-5 md:px-8 md:py-6 rounded-full shadow-[0_8px_20px_rgba(216,92,52,0.3)] hover:shadow-[0_12px_25px_rgba(216,92,52,0.4)] active:scale-95 hover:scale-105 transition-all duration-300 font-bold group">
                View All Scholarships
                <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* RIGHT: Fast Highlight Cards (UPGRADED WITH GOLD OUTLINES & HOVER EFFECTS) */}
          <div className="lg:w-1/2 w-full grid gap-3 md:gap-4 relative z-10">
            {teasers.map((teaser, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                // Golden Outline & Color Changing Hover Effect added below
                className="bg-white border-2 border-[#BF953F]/40 p-4 md:p-5 rounded-2xl flex items-start gap-3 md:gap-4 shadow-[0_4px_15px_rgba(191,149,63,0.08)] hover:shadow-[0_8px_25px_rgba(191,149,63,0.25)] hover:border-[#BF953F] hover:bg-[#FCF6BA]/20 transition-all duration-300 group active:scale-[0.98] cursor-default"
              >
                <div className="bg-[#BF953F]/15 p-2.5 md:p-3 rounded-xl shrink-0 group-hover:bg-[#BF953F] transition-colors duration-300">
                  <teaser.icon className="w-5 h-5 md:w-6 md:h-6 text-[#B38728] group-hover:text-[#FCF6BA] transition-colors duration-300" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-black text-[#22354a] mb-0.5 md:mb-1 tracking-tight group-hover:text-[#B38728] transition-colors duration-300">{teaser.title}</h3>
                  <p className="text-[#3A5F8B]/80 font-medium text-xs md:text-sm leading-snug group-hover:text-[#22354a] transition-colors duration-300">
                    {teaser.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}