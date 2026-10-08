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
    <section className="py-10 lg:py-16 bg-background border-t border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Mobile Header (Hidden on Desktop) */}
        <div className="flex flex-col mb-8 lg:hidden">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-extrabold text-xs mb-4 shadow-sm w-max"
          >
            <Trophy className="w-3.5 h-3.5 text-yellow-500" /> Counselled 5000+ Students
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-black font-heading text-slate-900 leading-tight"
          >
            Meet The Experts Behind Your Success
          </motion.h2>
        </div>

        {/* Unified Desktop Grid Layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
          
          {/* FOUNDER CARD - Spans 2 Rows on Desktop */}
          {coreTeam.filter(m => m.id === 1).map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "50px" }}
              className="col-span-2 lg:row-span-2 relative overflow-hidden group bg-slate-100 flex flex-col rounded-2xl md:rounded-3xl border-[3px] border-[#D4AF37] shadow-[0_10px_40px_-10px_rgba(212,175,55,0.4)] h-full aspect-[4/5] lg:aspect-auto"
            >
              <img 
                src={member.image} 
                alt={member.name} 
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex flex-col justify-end p-4 md:p-6 lg:p-8">
                <h3 className="font-black text-white font-heading leading-tight truncate drop-shadow-md text-xl md:text-2xl lg:text-3xl mb-1 lg:mb-2">
                  {member.name}
                </h3>
                <p className="font-bold uppercase tracking-wider truncate drop-shadow-md text-[#D4AF37] text-[10px] md:text-xs">
                  {member.role}
                </p>
              </div>
              <div className="absolute inset-0 border border-white/20 rounded-[inherit] pointer-events-none mix-blend-overlay"></div>
            </motion.div>
          ))}

          {/* DESKTOP HEADER - Placed in Grid Row 1, Col 3-6 */}
          <div className="col-span-4 hidden lg:flex flex-col justify-end pb-4 lg:pr-12">
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-extrabold text-sm mb-4 shadow-sm w-max"
            >
              <Trophy className="w-4 h-4 text-yellow-500" /> Counselled 5000+ Students
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-5xl font-black font-heading text-slate-900 leading-tight"
            >
              Meet The Experts Behind Your Success
            </motion.h2>
          </div>

          {/* OTHER TEAM MEMBERS - Placed in Grid Row 2, Col 3-6 */}
          {coreTeam.filter(m => m.id !== 1).map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="col-span-1 relative overflow-hidden group bg-slate-100 flex flex-col rounded-2xl md:rounded-3xl border border-slate-200 shadow-sm aspect-[3/4] h-full"
            >
              <img 
                src={member.image} 
                alt={member.name} 
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent flex flex-col justify-end p-4 md:p-5">
                <h3 className="font-black text-white font-heading leading-tight truncate drop-shadow-md text-sm md:text-base mb-0.5">
                  {member.name}
                </h3>
                <p className="font-bold uppercase tracking-wider truncate drop-shadow-md text-blue-400 text-[9px] md:text-[10px]">
                  {member.role}
                </p>
              </div>
            </motion.div>
          ))}

          {/* VIEW FULL TEAM BUTTON */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "50px" }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="col-span-1 rounded-2xl md:rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 aspect-[3/4] h-full flex flex-col items-center justify-center p-4"
          >
            <Link href="/team" className="w-full flex justify-center text-center">
              <Button className="w-full rounded-full bg-slate-900 hover:bg-blue-600 text-white group h-12 md:h-14 px-2 md:px-4 text-xs font-bold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                <span className="truncate">View Full Team</span>
                <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform shrink-0" />
              </Button>
            </Link>
          </motion.div>

        </div>

      </div>
    </section>
  );
}