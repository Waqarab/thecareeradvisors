"use client";

import { motion } from "framer-motion";
import { ArrowRight, Globe2, BookOpen, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ScholarshipsSection() {
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
    <section className="py-10 lg:py-16 bg-slate-50 relative overflow-hidden z-10 border-y border-slate-200/60">
      
      {/* Background Brand Accent */}
      <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[30vw] h-[30vw] bg-indigo-100/40 rounded-full blur-[100px] pointer-events-none -z-10"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-12">
          
          {/* LEFT: Title & Intro */}
          <div className="lg:w-1/2 w-full text-center lg:text-left relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-widest mb-6 shadow-sm"
            >
              <Banknote className="w-4 h-4" /> Financial Aid
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading text-slate-900 mb-6 tracking-tight leading-[1.15]">
              Unlock Your <br className="hidden md:block" /> Global <br className="md:hidden" />
              <span className="relative inline-block mt-2">
                <span className="relative z-10 text-blue-600">Scholarships</span>
                {/* Clean Blue Highlight Animation */}
                <motion.span 
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "circOut" }}
                  className="absolute bottom-1 md:bottom-2 left-0 right-0 h-3 md:h-4 bg-blue-200/50 -z-10 rounded-sm origin-left"
                />
              </span>
            </h2>

            <p className="text-base md:text-lg text-slate-600 font-medium leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
              Talent shouldn't be limited by budget. Discover high-value funding, tuition concessions, and fully-funded pathways across Europe and Asia.
            </p>

            <Link href="/scholarships" className="inline-block">
              <Button size="lg" className="bg-slate-900 hover:bg-blue-600 text-white text-sm md:text-base px-8 py-6 rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 font-bold group">
                View All Scholarships
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* RIGHT: Fast Highlight Cards */}
          <div className="lg:w-1/2 w-full grid gap-4 relative z-10">
            {teasers.map((teaser, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl md:rounded-3xl flex items-start gap-4 md:gap-5 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 group cursor-default"
              >
                <div className="bg-slate-50 border border-slate-100 p-3 md:p-4 rounded-xl md:rounded-2xl shrink-0 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors duration-300 shadow-sm">
                  <teaser.icon className="w-6 h-6 md:w-7 md:h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg md:text-xl font-black font-heading text-slate-900 mb-1.5 tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                    {teaser.title}
                  </h3>
                  <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed group-hover:text-slate-700 transition-colors duration-300">
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