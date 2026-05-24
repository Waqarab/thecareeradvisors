"use client";

import { motion } from "framer-motion";
import { ArrowRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Highly Optimized Data
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
    id: 5, 
    name: "Gurwinder singh", 
    role: "Punjab Office Head", 
    image: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779612288/Gurwinder_iueopx.jpg" 
  },
];

export default function TeamSection() {
  return (
    <section className="py-16 md:py-24 bg-background border-t border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header with Stats & Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 md:mb-16 gap-6">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-extrabold text-xs md:text-sm mb-4 shadow-sm"
            >
              <Trophy className="w-3.5 h-3.5 md:w-4 md:h-4 text-yellow-500" /> Counselled 5000+ Students
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 10 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.1 }}
              className="text-3xl md:text-5xl font-black font-heading text-slate-900 leading-tight"
            >
              Meet The Experts Behind Your Success
            </motion.h2>
          </div>
        </div>

        {/* Asymmetric Grid Layout:
          - Mobile: Founder takes full width (col-span-2), others are 1/2 width (col-span-1).
          - Desktop (lg): 4 columns. Founder takes 2 cols x 2 rows. Others take 1 col x 1 row.
        */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {coreTeam.map((member, i) => {
            const isFounder = member.id === 1;

            return (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "50px" }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className={`
                  relative overflow-hidden group bg-slate-100 flex flex-col
                  ${isFounder 
                    ? "col-span-2 lg:row-span-2 rounded-[2rem] md:rounded-[3rem] border-[3px] border-[#D4AF37] shadow-[0_10px_40px_-10px_rgba(212,175,55,0.4)] aspect-[4/5] lg:aspect-auto h-full min-h-[350px] lg:min-h-[600px]" 
                    : "col-span-1 rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm aspect-[3/4] md:aspect-[4/5] h-full"
                  }
                `}
              >
                {/* Native lazy loading image */}
                <img 
                  src={member.image} 
                  alt={member.name} 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
                {/* Dark Gradient Overlay for Text Readability */}
                <div className={`absolute inset-0 bg-gradient-to-t flex flex-col justify-end p-4 md:p-6 lg:p-8
                  ${isFounder 
                    ? "from-slate-900 via-slate-900/40 to-transparent" 
                    : "from-slate-900/90 via-slate-900/20 to-transparent"
                  }
                `}>
                  <h3 className={`font-black text-white font-heading leading-tight truncate drop-shadow-md
                    ${isFounder ? "text-2xl md:text-4xl mb-1 lg:mb-2" : "text-sm md:text-xl mb-0.5"}
                  `}>
                    {member.name}
                  </h3>
                  <p className={`font-bold uppercase tracking-wider truncate drop-shadow-md
                    ${isFounder ? "text-[#D4AF37] text-xs md:text-base" : "text-blue-400 text-[10px] md:text-xs"}
                  `}>
                    {member.role}
                  </p>
                </div>

                {/* Decorative Premium Glow for Founder */}
                {isFounder && (
                  <div className="absolute inset-0 border border-white/20 rounded-[inherit] pointer-events-none mix-blend-overlay"></div>
                )}
              </motion.div>
            );
          })}

          {/* View Full Team Button Cell */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ delay: coreTeam.length * 0.1, duration: 0.4 }}
            className="col-span-1 rounded-2xl md:rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 aspect-[3/4] md:aspect-[4/5] h-full flex flex-col items-center justify-center p-4 md:p-6"
          >
            <Link href="/team" className="w-full flex justify-center text-center">
              <Button className="w-full rounded-full bg-slate-900 hover:bg-blue-600 text-white group h-12 md:h-14 px-2 md:px-6 text-xs md:text-sm font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 break-normal sm:whitespace-nowrap">
                <span className="truncate">View Full Team</span>
                <ArrowRight className="ml-1.5 md:ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
              </Button>
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
}