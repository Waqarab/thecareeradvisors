"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, useInView, animate } from "framer-motion";
import { 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Users, 
  FileText, 
  Headset, 
  Plane,
  GraduationCap,
  Briefcase,
  Globe2
} from "lucide-react";

// Components
import Preloader from "@/components/Preloader";
import InquiryModal from "@/components/InquiryModal";
import SectionDivider from "@/components/SectionDivider";
import CountriesSection from "@/components/CountriesSection";
import TrustSection from "@/components/TrustSection";
import TestimonialSection from "@/components/TestimonialSection";
import TeamSection from "@/components/TeamSection";
import FaqSection from "@/components/FaqSection";
import ScholarshipsSection from "@/components/ScholarshipsSection";

// --- CUSTOM ANIMATED COUNTER COMPONENT ---
function AnimatedCounter({ from = 0, to, duration = 2.5, suffix = "" }: { from?: number, to: number, duration?: number, suffix?: string }) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  // Trigger animation when the element comes 50px into the viewport
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration: duration,
        ease: "easeOut",
        onUpdate(value) {
          if (nodeRef.current) {
            // Update the DOM directly for extreme performance (no React state re-renders)
            nodeRef.current.textContent = Math.round(value).toString() + suffix;
          }
        },
      });
      return () => controls.stop();
    }
  }, [inView, from, to, duration, suffix]);

  return <span ref={nodeRef}>{from}{suffix}</span>;
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Pre-optimized Cloudinary images
  const heroImages = [
    "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto,f_auto,w_800/v1779545094/copy_of_img-20250920-wa0013jpg_nar0fd.webp",
    "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto,f_auto,w_800/v1779551416/20251110_151107.jpg_tca5p1.jpg",
    "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto,f_auto,w_800/v1779550304/20260424_121718.jpg_kzrzqy.jpg"
  ];

  const handleLoadingComplete = useCallback(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    fetch('/api/track-visit').catch(() => {});
  }, []);

  // Image Slider Timer
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500); 
    return () => clearInterval(timer);
  }, [heroImages.length, isLoaded]);

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
      <Preloader onLoadingComplete={handleLoadingComplete} />

      <div className="flex flex-col min-h-screen bg-[#f8fafc] font-sans selection:bg-blue-100">
        
        {/* PREMIUM SAAS HERO SECTION (OPTIMIZED FOR LOW RAM) */}
        <section className="relative pt-6 pb-6 lg:pt-8 lg:pb-8 overflow-hidden z-0 flex-1 flex flex-col justify-center">
          
          <div className="absolute inset-0 pointer-events-none -z-10 bg-gradient-to-b from-[#f0f5fa] via-[#f8fafc] to-white"></div>
          <div className="absolute top-[-5%] right-[15%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-blue-200/30 blur-[80px] md:blur-[120px] -z-10"></div>
          <div className="absolute bottom-[5%] left-[-5%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] rounded-full bg-orange-100/40 blur-[80px] md:blur-[100px] -z-10"></div>

          <div className="absolute top-8 left-[40%] w-[35%] hidden xl:block -z-10 pointer-events-none">
            <svg viewBox="0 0 300 100" fill="none" className="w-full overflow-visible text-blue-200/80">
                <path 
                  d="M0,80 C80,60 150,20 280,0" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeDasharray="5 5"
                />
                <Plane className="text-blue-500 w-7 h-7" fill="currentColor" x="270" y="-14" transform="rotate(45 284 -2)" />
            </svg>
          </div>

          <div className="container max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-6">

              {/* LEFT COLUMN: Content */}
              <div className="w-full lg:w-[55%] xl:w-[50%] flex flex-col justify-center text-left space-y-5 lg:space-y-6">
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-slate-200 shadow-sm w-max"
                >
                  <span className="text-yellow-500 text-sm leading-none">⭐</span>
                  <span className="text-[11px] sm:text-xs font-semibold text-slate-700">J&K's Top Education Consultancy</span>
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="text-[2.25rem] sm:text-5xl lg:text-[3.75rem] xl:text-[4.25rem] font-extrabold text-slate-900 leading-[1.05] tracking-tight"
                >
                  Your Dream <br />
                  <span className="relative inline-block mt-1">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500">
                      MBBS ABROAD
                    </span>
                    <svg className="absolute w-full h-2 sm:h-3 -bottom-1 left-0 text-orange-400" viewBox="0 0 100 10" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                        <path d="M2,8 Q50,0 98,8" />
                    </svg>
                  </span> <br />
                  <span className="mt-1 block">Starts Here.</span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-sm sm:text-base text-slate-600 max-w-lg leading-relaxed"
                >
                  <strong className="text-slate-800 font-semibold">The Career Advisors</strong> is the most trusted medical education consultancy since 2016. With a decade of expertise, we have secured guaranteed admissions for 500+ students worldwide.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 w-full xl:max-w-2xl"
                >
                  {[
                    { icon: ShieldCheck, title: "NMC & WHO", sub: "Recognized", color: "text-blue-600", bg: "bg-blue-50" },
                    { icon: FileText, title: "Zero Hidden", sub: "Charges", color: "text-orange-500", bg: "bg-orange-50" },
                    { icon: ShieldCheck, title: "Guaranteed", sub: "Admissions", color: "text-green-600", bg: "bg-green-50" },
                    { icon: Headset, title: "End-to-End", sub: "Visa Support", color: "text-purple-600", bg: "bg-purple-50" }
                  ].map((feat, idx) => (
                    <div 
                      key={idx} 
                      className="group flex flex-col items-center justify-center text-center p-2.5 bg-white rounded-xl sm:rounded-2xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] border border-slate-100 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:scale-[1.03] hover:border-amber-400/80 hover:shadow-[0_8px_20px_-4px_rgba(251,191,36,0.3)] hover:ring-1 hover:ring-amber-400/50 cursor-pointer"
                    >
                      <div className={`w-8 h-8 rounded-full ${feat.bg} ${feat.color} flex items-center justify-center mb-1.5 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                        <feat.icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-slate-700 leading-tight transition-colors duration-300 group-hover:text-amber-600">{feat.title}<br/>{feat.sub}</span>
                    </div>
                  ))}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 10 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex flex-col space-y-5 pt-1"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                    <InquiryModal>
                      <Button className="w-full sm:w-auto bg-gradient-to-r from-[#ff7a00] to-[#ff5e00] hover:from-blue-600 hover:to-blue-500 text-white font-semibold text-sm sm:text-base h-12 px-6 sm:px-8 rounded-full shadow-[0_6px_15px_-4px_rgba(255,122,0,0.4)] hover:shadow-[0_8px_20px_-4px_rgba(59,130,246,0.5)] transition-all duration-500 flex items-center justify-center gap-2 group cursor-pointer">
                        Get Free Counselling
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </InquiryModal>
                    
                    <a href="https://wa.me/916005152350" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                      <Button variant="outline" className="w-full h-12 text-sm sm:text-base font-semibold px-6 sm:px-8 rounded-full border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-300 hover:border-green-400 hover:bg-green-50 hover:text-green-700 flex items-center justify-center gap-2 group cursor-pointer">
                        <svg className="w-4 h-4 text-green-500 transition-transform duration-300 group-hover:scale-110" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                        Chat on WhatsApp
                      </Button>
                    </a>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 mt-1">
                    <div className="flex -space-x-2.5">
                      <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" src="https://i.pravatar.cc/100?img=11" alt="Student 1" loading="lazy" />
                      <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" src="https://i.pravatar.cc/100?img=12" alt="Student 2" loading="lazy" />
                      <img className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" src="https://i.pravatar.cc/100?img=13" alt="Student 3" loading="lazy" />
                    </div>
                    
                    <div className="text-[11px] sm:text-xs lg:text-sm text-slate-600 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-0.5 text-center sm:text-left">
                      
                      <div className="relative inline-flex items-center justify-center group cursor-default">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-yellow-400 opacity-40 blur-sm animate-pulse rounded-full" style={{ animationDuration: '2.5s' }}></div>
                        <div className="relative bg-white border border-orange-100 px-3 py-1 rounded-full shadow-sm">
                          <strong className="text-orange-600 font-extrabold tracking-tight">5000+</strong> <span className="font-medium text-slate-700">Counselled</span>
                        </div>
                      </div>

                      <span className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></span>

                      <div className="relative inline-flex items-center justify-center group cursor-default">
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 opacity-40 blur-sm animate-pulse rounded-full" style={{ animationDuration: '2.5s', animationDelay: '1.25s' }}></div>
                        <div className="relative bg-white border border-blue-100 px-3 py-1 rounded-full shadow-sm">
                          <strong className="text-blue-600 font-extrabold tracking-tight">500+</strong> <span className="font-medium text-slate-700">Placed</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              </div>

              {/* RIGHT COLUMN: Image & Floating Highlight Cards */}
              <div className="w-full lg:w-[45%] relative flex justify-end items-center mt-6 lg:mt-0">
                
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-gradient-to-tr from-orange-300/20 to-blue-500/20 blur-[60px] rounded-full -z-10 pointer-events-none"></div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative w-full max-w-[420px] lg:max-w-[460px] aspect-[4/5] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.12)] group rounded-2xl sm:rounded-[2rem] rounded-tl-[3.5rem] sm:rounded-tl-[5rem] rounded-br-[3.5rem] sm:rounded-br-[5rem] mb-2 lg:mb-0 lg:-mt-4 bg-slate-200"
                >
                  <AnimatePresence>
                    <motion.img 
                      key={currentImageIndex}
                      src={heroImages[currentImageIndex]}
                      alt="Students Admitted"
                      initial={{ opacity: 0, scale: 1.05 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1.2, ease: "easeInOut" }} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </AnimatePresence>

                  {/* FLOATING NEON CARDS */}
                  <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-row items-center justify-between gap-3 z-10">
                    
                    <div className="flex-1 flex items-center gap-2 sm:gap-3 bg-slate-900/90 border border-orange-500/40 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-[0_0_15px_rgba(249,115,22,0.4)] relative overflow-hidden transition-transform duration-300 hover:scale-[1.02] cursor-default">
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent"></div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-500/20 rounded-lg sm:rounded-xl flex items-center justify-center text-orange-400 shrink-0 relative">
                        <div className="absolute inset-0 bg-orange-400 opacity-30 blur-[6px] animate-pulse" style={{ animationDuration: '2s' }}></div>
                        <Users className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-white font-extrabold text-[12px] sm:text-[15px] leading-tight">5000+</p>
                        <p className="text-orange-200/90 text-[9px] sm:text-[11px] font-medium uppercase tracking-wide">Counselled</p>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center gap-2 sm:gap-3 bg-slate-900/90 border border-blue-500/40 p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-[0_0_15px_rgba(59,130,246,0.4)] relative overflow-hidden transition-transform duration-300 hover:scale-[1.02] cursor-default">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent"></div>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg sm:rounded-xl flex items-center justify-center text-blue-400 shrink-0 relative">
                        <div className="absolute inset-0 bg-blue-400 opacity-30 blur-[6px] animate-pulse" style={{ animationDuration: '2s', animationDelay: '1s' }}></div>
                        <Award className="w-4 h-4 sm:w-5 sm:h-5 relative z-10" />
                      </div>
                      <div className="relative z-10">
                        <p className="text-white font-extrabold text-[12px] sm:text-[15px] leading-tight">500+</p>
                        <p className="text-blue-200/90 text-[9px] sm:text-[11px] font-medium uppercase tracking-wide">Placed</p>
                      </div>
                    </div>

                  </div>
                </motion.div>

                <div className="absolute -bottom-4 -right-2 sm:-right-4 bg-white px-3 py-2 rounded-2xl rounded-br-none shadow-xl border border-slate-100 hidden sm:flex items-center gap-1.5 z-20 animate-bounce">
                  <span className="text-sm">👋</span>
                  <span className="text-[11px] font-medium text-slate-700">How can we help?</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* BOTTOM PARTNERS BAR */}
        <section className="bg-white border-y border-slate-100 py-3 sm:py-4 overflow-hidden relative z-10">
          <div className="container max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-16">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
              <span className="text-slate-500 font-medium whitespace-nowrap text-[11px] sm:text-sm">
                Partnered with Top Medical Universities in
              </span>
              
              <div className="flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-2.5">
                {[
                  { name: "Russia", flagClass: "fi fi-ru" },
                  { name: "Kazakhstan", flagClass: "fi fi-kz" },
                  { name: "Uzbekistan", flagClass: "fi fi-uz" },
                  { name: "Bangladesh", flagClass: "fi fi-bd" },
                  { name: "Egypt", flagClass: "fi fi-eg" },
                  { name: "Tajikistan", flagClass: "fi fi-tj" },
                  { name: "Kyrgyzstan", flagClass: "fi fi-kg" }
                ].map((country) => (
                  <div key={country.name} className="flex items-center gap-1.5 transition-all duration-300 cursor-pointer group">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center overflow-hidden rounded-full border border-slate-200 shadow-sm bg-slate-50 transition-transform duration-300 group-hover:scale-110 group-hover:border-blue-400 group-hover:shadow-[0_4px_10px_-2px_rgba(59,130,246,0.3)]">
                      <span className={`${country.flagClass} !w-full !h-full object-cover scale-[1.35]`}></span>
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-700 transition-colors duration-300 group-hover:text-blue-600">{country.name}</span>
                  </div>
                ))}
                <div className="px-3 py-1 rounded-full border border-slate-200 text-[10px] sm:text-xs font-semibold text-slate-500 bg-slate-50">
                  & more
                </div>
              </div>
            </div>
          </div>
        </section>

{/* ========================================================================= */}
        {/* NEW SCROLL-TRIGGERED STATS SECTION (Compact, Premium Light Glassmorphism) */}
        {/* ========================================================================= */}
        <section className="relative py-10 lg:py-14 overflow-hidden z-10 bg-[#f8fafc] border-y border-slate-200/50">
          
          {/* Ambient Colorful Background Glows (Light Mode) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[120%] bg-blue-400/15 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s' }}></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[120%] bg-orange-400/15 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '8s', animationDelay: '4s' }}></div>
          </div>

          {/* Constrained max-width to make blocks explicitly smaller */}
          <div className="container max-w-[1100px] mx-auto px-4 sm:px-6 relative z-10">
            {/* Tighter gaps between smaller blocks */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              
              {/* Stat 1: Brand Orange */}
              <div className="relative group rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-8px_rgba(249,115,22,0.25)] cursor-default bg-white/60 shadow-sm border border-slate-200/60 hover:border-orange-300/60">
                <div className="relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-[15px] bg-white/80 backdrop-blur-xl h-full transition-colors duration-500">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ring-1 ring-orange-200/50 shadow-inner">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  {/* Unique Serif Italic Font for Numbers */}
                  <h3 className="text-3xl lg:text-4xl font-serif italic font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600 mb-0.5 tracking-tight">
                    <AnimatedCounter from={0} to={5000} duration={2.5} suffix="+" />
                  </h3>
                  {/* Unique Mono Spaced Font for Labels */}
                  <p className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.15em] mt-1 group-hover:text-orange-600 transition-colors">Students Counselled</p>
                </div>
              </div>

              {/* Stat 2: Brand Blue */}
              <div className="relative group rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-8px_rgba(59,130,246,0.25)] cursor-default bg-white/60 shadow-sm border border-slate-200/60 hover:border-blue-300/60">
                <div className="relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-[15px] bg-white/80 backdrop-blur-xl h-full transition-colors duration-500">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 ring-1 ring-blue-200/50 shadow-inner">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-serif italic font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600 mb-0.5 tracking-tight">
                    <AnimatedCounter from={0} to={500} duration={2.5} suffix="+" />
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.15em] mt-1 group-hover:text-blue-600 transition-colors">Students Placed</p>
                </div>
              </div>

              {/* Stat 3: Bright Amber */}
              <div className="relative group rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-8px_rgba(245,158,11,0.25)] cursor-default bg-white/60 shadow-sm border border-slate-200/60 hover:border-amber-300/60">
                <div className="relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-[15px] bg-white/80 backdrop-blur-xl h-full transition-colors duration-500">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 ring-1 ring-amber-200/50 shadow-inner">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-serif italic font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400 mb-0.5 tracking-tight">
                    <AnimatedCounter from={0} to={10} duration={2} suffix="+" />
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.15em] mt-1 group-hover:text-amber-600 transition-colors">Years Experience</p>
                </div>
              </div>

              {/* Stat 4: Emerald */}
              <div className="relative group rounded-2xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_-8px_rgba(16,185,129,0.25)] cursor-default bg-white/60 shadow-sm border border-slate-200/60 hover:border-emerald-300/60">
                <div className="relative flex flex-col items-center justify-center text-center p-4 sm:p-5 rounded-[15px] bg-white/80 backdrop-blur-xl h-full transition-colors duration-500">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 ring-1 ring-emerald-200/50 shadow-inner">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="text-3xl lg:text-4xl font-serif italic font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-emerald-600 mb-0.5 tracking-tight">
                    <AnimatedCounter from={0} to={15} duration={2} suffix="+" />
                  </h3>
                  <p className="text-[9px] sm:text-[10px] font-mono font-bold text-slate-500 uppercase tracking-[0.15em] mt-1 group-hover:text-emerald-600 transition-colors">Team Members</p>
                </div>
              </div>

            </div>
          </div>
        </section>
        <SectionDivider />
        <CountriesSection />
        
        <SectionDivider />
        <ScholarshipsSection />
        
        <SectionDivider />
        <TrustSection />

        <SectionDivider />
        <TestimonialSection />
        
        <SectionDivider />
        <TeamSection />
        
        <SectionDivider />
        <FaqSection />
        <SectionDivider />
        
      </div>
    </>
  );
}