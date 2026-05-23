"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShieldCheck, Award, Users, GraduationCap, CheckCircle2 } from "lucide-react";
// Components
import Preloader from "@/components/Preloader";
import InquiryModal from "@/components/InquiryModal";
import SectionDivider from "@/components/SectionDivider";
import CountriesSection from "@/components/CountriesSection";
import TrustSection from "@/components/TrustSection";
import TestimonialSection from "@/components/TestimonialSection";
import TeamSection from "@/components/TeamSection";
import FaqSection from "@/components/FaqSection";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const heroImages = [
    "https://res.cloudinary.com/drytpdpx3/image/upload/v1779545094/copy_of_img-20250920-wa0013jpg_nar0fd.webp",
    "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779551416/20251110_151107.jpg_tca5p1.jpg",
    "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779550304/20260424_121718.jpg_kzrzqy.jpg"
  ];

  // Silently track unique daily visitors in the background
  useEffect(() => {
    fetch('/api/track-visit').catch(() => {});
  }, []);

  // Image slider timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Crossfade every 4 seconds
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Lock scrolling while preloader is active
  useEffect(() => {
    if (!isLoaded) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isLoaded]);

  return (
    <>
      <Preloader onLoadingComplete={() => setIsLoaded(true)} />

      <div className="flex flex-col min-h-screen font-sans">
        
      {/* PREMIUM APPLE-STYLE HERO SECTION (SEO OPTIMIZED & BALANCED) */}
        <section className="relative min-h-[85vh] flex items-center pt-2 pb-12 lg:pt-4 lg:pb-20 overflow-hidden bg-background">
          
          {/* 1. Alive Ambient Background (Optimized for Speed) */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <motion.div 
              animate={isLoaded ? { scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] } : {}}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] rounded-full bg-orange-500/10 blur-[120px] mix-blend-normal will-change-transform"
            />
            <motion.div 
              animate={isLoaded ? { scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] } : {}}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] rounded-full bg-amber-500/10 blur-[120px] mix-blend-normal will-change-transform"
            />
          </div>

          <div className="container mx-auto px-6 md:px-12 relative z-10 mt-2 lg:mt-2">
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">

              {/* LEFT COLUMN: Strictly Balanced Typography & SEO Content */}
              <div className="lg:col-span-7 flex flex-col space-y-6 max-w-[42rem]">
                
                {/* Glassmorphism Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} 
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 dark:bg-green/20 backdrop-blur-md border border-orange-500/20 shadow-[0_4px_20px_rgba(249,115,22,0.1)] text-foreground/90 text-xs font-semibold tracking-widest uppercase">
                    <ShieldCheck className="w-[14px] h-[14px] text-orange-500" />
                    The Career Advisors - J&K's Top Education Consultancy
                  </span>
                </motion.div>

                {/* H1 Title */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} 
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                >
                  <h1 className="text-5xl lg:text-6xl xl:text-[4.2rem] font-bold tracking-[-0.02em] text-foreground leading-[1.08]" style={{ fontFamily: "Oregon, sans-serif" }}>
                    <span className="text-3xl lg:text-4xl text-foreground/80 align-middle mr-2">Your Dream-</span>
                    <span className="relative inline-block px-2 md:px-3 z-10">
                      <motion.span 
                        animate={isLoaded ? { opacity: [1, 0.85, 1], scale: [1, 1.015, 1] } : {}}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="relative z-10 uppercase inline-block text-foreground drop-shadow-sm"
                      >
                        MBBS ABROAD
                      </motion.span>
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={isLoaded ? { scaleX: 1 } : { scaleX: 0 }}
                        transition={{ duration: 0.8, ease: "circOut", delay: 0.4 }}
                        className="absolute inset-0 bg-primary/20 mix-blend-multiply dark:mix-blend-screen origin-left -z-10 rounded-md"
                      />
                    </span>
                    <br/> <span className="text-3xl lg:text-4xl text-foreground/80 align-middle">Starts Here.</span>
                  </h1>
                </motion.div>

                {/* Animated Darkening Overlay Hook */}
                <div className="flex">
                  <div className="relative inline-flex items-center overflow-hidden rounded-xl px-4 py-2 group">
                    <motion.div
                      initial={{ x: "-100%" }}
                      animate={isLoaded ? { x: 0 } : { x: "-100%" }}
                      transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute inset-0 bg-primary z-0 rounded-xl"
                    ></motion.div>
                    <motion.h2 
                      initial={{ opacity: 0, x: -10 }}
                      animate={isLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                      className="relative z-10 text-xl lg:text-2xl font-bold tracking-wide text-primary-foreground"
                    >
                      The White Coat is Waiting...
                    </motion.h2>
                  </div>
                </div>

                {/* Main Paragraph */}
                <motion.p 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} 
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                  className="text-base lg:text-lg text-foreground/75 leading-relaxed max-w-[95%] font-medium"
                >
                  <strong className="font-semibold text-foreground">The Career Advisors</strong> is the most trusted medical education consultancy since 2016. With a decade of expertise, we have secured guaranteed admissions for 500+ students worldwide.
                </motion.p>

                {/* SEO Feature Grid (Fills empty space beautifully) */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} 
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6 text-sm text-foreground/80 font-medium py-2"
                >
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span>NMC & WHO Recognized</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span>Guaranteed Admissions</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span>Zero Hidden Charges</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span>End-to-End Visa Support</span>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }} 
                  animate={isLoaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }} 
                  transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }} 
                  className="flex flex-col sm:flex-row items-center gap-4 pt-2"
                >
                  <InquiryModal>
                    <Button 
                      size="lg" 
                      className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-base h-14 px-8 rounded-full shadow-[0_8px_30px_rgba(249,115,22,0.25)] hover:shadow-[0_8px_40px_rgba(249,115,22,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 group"
                    >
                      Get Free Counselling
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </Button>
                  </InquiryModal>
                  
                  <a href="https://wa.me/916005152350" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="w-full h-14 text-base px-8 rounded-full border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10 text-foreground bg-background/50 backdrop-blur-md hover:scale-105 active:scale-95 transition-all duration-300"
                    >
                      Chat on WhatsApp
                    </Button>
                  </a>
                </motion.div>

                {/* Sub-text for SEO Optimization */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isLoaded ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="text-[22px] md:text-xs text-foreground/100 mt-8 max-w-xl leading-relaxed"
                >
                  * The Career Advisors features universities across Russia, Bangladesh, Kazakhstan, Egypt, Tajikistan, and more . Guidance by top experts for Indian students seeking affordable, high-quality MBBS education abroad with safe campus environments and happy journey. <br/> The Career Advisors is the most trusted medical education consultancy since 2016. With a decade of expertise, we have secured guaranteed admissions for 500+ students worldwide
                </motion.p>

              </div>

              {/* RIGHT COLUMN: Clean Framed Image with Details Overlay */}
              <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end mt-6 lg:-mt-12">
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={isLoaded ? { opacity: 1, scale: 1, y: [0, -12, 0] } : { opacity: 0, scale: 0.96 }}
                  transition={{ 
                    opacity: { duration: 0.8, delay: 0.2, ease: "easeOut" },
                    scale: { duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] },
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 } 
                  }}
                  className="relative w-full max-w-[460px] lg:max-w-[560px] xl:max-w-[620px] aspect-[814/695] rounded-3xl overflow-hidden shadow-2xl border border-border/50 group"
                >
                  {/* Image Slider */}
                  <AnimatePresence>
                    <motion.img 
                      key={currentImageIndex}
                      src={heroImages[currentImageIndex]}
                      alt="Medical Students Abroad"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </AnimatePresence>
                  
                  {/* Bottom Overlay with Details */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 sm:p-7 pt-32 flex flex-row flex-wrap items-center justify-start gap-x-5 gap-y-3 pointer-events-none z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-yellow-500/20 text-yellow-400 p-1.5 rounded-full shadow-inner backdrop-blur-md border border-yellow-500/30">
                        <Award className="w-4 h-4" />
                      </div>
                      <motion.span 
                        animate={isLoaded ? { backgroundPosition: ["0% 50%", "200% 50%"] } : {}}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="bg-[linear-gradient(to_right,#BF953F,#FCF6BA,#B38728,#FBF5B7,#BF953F)] bg-[length:200%_auto] bg-clip-text text-transparent font-extrabold text-sm sm:text-base leading-tight"
                      >
                        10+ Years Experience
                      </motion.span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <div className="bg-yellow-500/20 text-yellow-400 p-1.5 rounded-full shadow-inner backdrop-blur-md border border-yellow-500/30">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="bg-[linear-gradient(to_right,#BF953F,#FCF6BA,#B38728,#FBF5B7,#BF953F)] bg-clip-text text-transparent font-extrabold text-sm sm:text-base leading-tight">
                        500+ Students Admitted Globally
                      </span>
                    </div>
                  </div>

                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* The rest of the page components */}
        <SectionDivider />
        <CountriesSection />
        
        <SectionDivider />
        <TrustSection />

        <SectionDivider />
        <TestimonialSection />
        
        <SectionDivider />
        <TeamSection />
        
        <SectionDivider />
        <FaqSection />
      </div>
    </>
  );
}