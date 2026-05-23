"use client";

import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Highly Optimized Data: 
// 1. Reduced image width in URL (w=400) to save bandwidth.
// 2. Ordered by hierarchy.
const coreTeam = [
  { 
    id: 1, 
    name: "Waqar Abdullah", 
    role: "Founder & CEO", 
    image: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779560322/waqarportrait_ktr3dd.png" 
  },
  { 
    id: 2, 
    name: "Mr. Salman Yousuf", 
    role: "Manager", 
    image: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779570304/WhatsApp_Image_2026-05-24_at_02.30.20_rzydzz.jpg" 
  },
  { 
    id: 3, 
    name: "Ms. Sadiya Sofi", 
    role: "Student Relationship Manager", 
    image: "https://cdn.vectorstock.com/i/500p/60/84/faceless-woman-in-blue-hijab-vector-61316084.jpg" 
  },
  { 
    id: 4, 
    name: "Mr. Danish Shafi", 
    role: "Head Counsellor", 
    image: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779570304/WhatsApp_Image_2026-05-24_at_02.33.29_yxfwdt.jpg" 
  },
];

export default function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-background border-t border-border/40">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header with Stats */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 md:mb-16 gap-5">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-extrabold text-xs md:text-sm mb-4 shadow-sm"
            >
              <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4" /> Counselled 5000+ Students
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black font-heading text-foreground leading-tight"
            >
              Meet The Experts Behind Your Success
            </motion.h2>
          </div>
        </div>

        {/* Dense Mobile-Optimized Grid (2x2 on Mobile, 4x1 on Desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {coreTeam.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
              className="relative rounded-2xl md:rounded-3xl overflow-hidden group shadow-sm border border-border/50 bg-muted aspect-[3/4] md:aspect-[4/5]"
            >
              {/* Native lazy loading for performance */}
              <img 
                src={member.image} 
                alt={member.name} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              
              {/* Dark Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-3 md:p-6">
                <h3 className="font-black text-white font-heading leading-tight mb-0.5 text-sm md:text-2xl truncate">
                  {member.name}
                </h3>
                <p className="text-primary font-bold text-[10px] md:text-sm uppercase tracking-wider truncate">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}