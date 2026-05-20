"use client";

import { motion } from "framer-motion";
import { ArrowRight, Share2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const coreTeam = [
  {
    id: 1,
    name: "Dr. Tariq Ahmed",
    role: "Founder & Director",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Sarah Khan",
    role: "Co-Founder & Head of Admissions",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Rahul Verma",
    role: "Visa & Documentation Head",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop",
  },
];

export default function TeamSection() {
  return (
    <section className="py-24 bg-background overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.span 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-destructive font-bold tracking-wider uppercase text-sm mb-4 block"
          >
            The Experts Behind Your Success
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold font-heading text-foreground mb-6"
          >
            Meet Our Core Leadership
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-lg text-foreground/70 font-medium"
          >
            Guided by professionals with over a decade of experience in international medical education and student welfare.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {coreTeam.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="group relative"
            >
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6 bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                />
                {/* Social Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-colors cursor-pointer"><Share2 className="w-5 h-5" /></div>
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-primary transition-colors cursor-pointer"><Mail className="w-5 h-5" /></div>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold font-heading text-foreground group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-sm font-bold text-destructive uppercase tracking-wider mt-1">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-16 text-center">
          <Link href="/team">
            <Button size="lg" variant="outline" className="border-primary/30 text-primary hover:bg-primary/5 rounded-full px-8 font-bold active:scale-95 transition-all">
              Meet The Complete Team <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}