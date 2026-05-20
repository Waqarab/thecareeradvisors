"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Award, Users } from "lucide-react";

// Components
import InquiryModal from "@/components/InquiryModal";
import SectionDivider from "@/components/SectionDivider";
import CountriesSection from "@/components/CountriesSection";
import TrustSection from "@/components/TrustSection";
import TestimonialSection from "@/components/TestimonialSection";
import TeamSection from "@/components/TeamSection";
import FaqSection from "@/components/FaqSection";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      
      {/* 1. PREMIUM HERO SECTION (Fits on one screen) */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-12 overflow-hidden bg-background">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>

        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">

            {/* LEFT COLUMN: Hook & CTA */}
            <div className="max-w-2xl z-10">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6 border border-primary/20 shadow-sm">
                  <ShieldCheck className="w-4 h-4" />
                  Government Approved Consultancy
                </span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight text-foreground mb-4 leading-[1.1] font-heading">
                  Your Dream MBBS <br /> Journey Starts Here.
                </h1>
              </motion.div>

              {/* ANIMATED HIGHLIGHT HOOK */}
              <div className="relative inline-block mb-8 mt-2">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 0.8, delay: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0 bg-accent rounded-lg shadow-lg"
                ></motion.div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                  className="relative z-10 text-xl md:text-3xl font-bold text-accent-foreground px-5 py-2 font-heading whitespace-nowrap"
                >
                  The White Coat is Waiting.
                </motion.p>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                <p className="text-base md:text-lg text-foreground/70 mb-10 leading-relaxed font-medium max-w-lg">
                  We guide aspiring doctors to secure admissions in globally recognized medical universities with 100% transparency and end-to-end support.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-col sm:flex-row items-center gap-4">
                <InquiryModal>
                  <Button size="lg" className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 text-lg px-8 py-6 rounded-full shadow-xl shadow-destructive/20 group cursor-pointer active:scale-95 transition-all">
                    Get Free Counselling
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </InquiryModal>
                
                {/* Fixed WhatsApp Action Route */}
                <a href="https://wa.me/917889708059" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full text-lg px-8 py-6 rounded-full border-primary/30 hover:bg-primary/5 text-primary bg-background font-bold active:scale-95 transition-all">
                    Chat on WhatsApp
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Resized Image Frame & Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto w-full max-w-[320px] lg:max-w-[400px] mt-8 lg:mt-0"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/10 rounded-full blur-3xl -z-10"></div>

              {/* Smaller, square image frame to fit on screen */}
              <div className="relative rounded-3xl overflow-hidden border-[6px] border-card shadow-2xl bg-muted aspect-square">
                {/* Replace this div with an actual <img> tag when you have the team photo ready */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-secondary/20 text-foreground/50 p-6 text-center">
                   <Users className="w-16 h-16 mb-4 opacity-40 text-primary" />
                   <p className="font-heading font-bold text-lg text-primary">Team & Students Image</p>
                   <p className="text-xs mt-2 px-4">(Perfectly sized for a square photo)</p>
                </div>
              </div>

              {/* Floating Badge 2: Experience */}
              <motion.div
                initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}
                className="absolute top-1/3 -right-6 md:-right-10 bg-card p-3 rounded-2xl shadow-xl border border-border/50 flex items-center gap-3 z-10"
              >
                <div className="bg-primary/10 text-primary p-1.5 rounded-full">
                  <Award className="w-5 h-5" />
                </div>
                <div className="pr-2">
                  <p className="font-bold font-heading text-sm text-foreground leading-tight">10+ Years</p>
                  <p className="text-[10px] text-foreground/70 font-medium uppercase tracking-wider">Experience</p>
                </div>
              </motion.div>

              {/* Floating Badge 3: Students Placed */}
              <motion.div
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }}
                className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-card p-3 rounded-2xl shadow-xl border border-border/50 flex items-center gap-3 z-10 w-max"
              >
                 <div className="flex -space-x-2 pl-1">
                    <div className="w-8 h-8 rounded-full border-2 border-card bg-primary/20"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-card bg-accent/20"></div>
                    <div className="w-8 h-8 rounded-full border-2 border-card bg-destructive/20"></div>
                 </div>
                <div className="pr-2">
                  <p className="font-bold font-heading text-sm text-foreground leading-tight">500+ Students</p>
                  <p className="text-[10px] text-foreground/70 font-medium uppercase tracking-wider">Placed</p>
                </div>
              </motion.div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* 2. UNIVERSITIES PREVIEW */}
      <SectionDivider />
      <CountriesSection />
      
      {/* 3. TRUST SECTION */}
      <SectionDivider />
      <TrustSection />

      {/* 4. SUCCESS STORIES PREVIEW */}
      <SectionDivider />
      <TestimonialSection />
      
      {/* 5. TEAM SHOWCASE */}
      <SectionDivider />
      <TeamSection />
      
      {/* 6. FAQS */}
      <SectionDivider />
      <FaqSection />

    </div>
  );
}