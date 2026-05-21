"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BadgeCheck, Play, Quote, ChevronLeft, ChevronRight, Activity } from "lucide-react";

// --- DUMMY DATA ---
const textTestimonials = [
  {
    id: 1,
    name: "Ayesha Mir",
    handle: "ayesha_med",
    text: "Got my admission in Kazan effortlessly. The transparency is real! They handled all my visa stress and documentation without any hidden charges.",
    img: "/student1.jpg",
    initials: "AM"
  },
  {
    id: 2,
    name: "Rohit Sharma",
    handle: "rohit.doc",
    text: "Guided me 1-on-1 for my MBBS journey. I'm now in my 3rd year and the support is still there. Highly recommend their expert counselors.",
    img: "/student2.jpg",
    initials: "RS"
  },
  {
    id: 3,
    name: "Sania Rashid",
    handle: "sania_r",
    text: "Zero hidden charges. They didn't just help me with admission; they ensured I reached my hostel safely and settled in properly.",
    img: "/student3.jpg",
    initials: "SR"
  }
];

const videoTestimonials = [
  { id: 1, title: "Ayesha's Journey to Kazan", thumb: "https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?q=80&w=1000&auto=format&fit=crop" },
  { id: 2, title: "Rohit's Campus Tour", thumb: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1000&auto=format&fit=crop" },
  { id: 3, title: "Sania on First Day of Med School", thumb: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?q=80&w=1000&auto=format&fit=crop" },
];

export default function TestimonialSection() {
  const [textIndex, setTextIndex] = useState(0);
  const [vidIndex, setVidIndex] = useState(0);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  // --- NAVIGATION CONTROLS ---
  const nextText = () => setTextIndex((prev) => (prev === textTestimonials.length - 1 ? 0 : prev + 1));
  const prevText = () => setTextIndex((prev) => (prev === 0 ? textTestimonials.length - 1 : prev - 1));

  const nextVid = () => {
    setIsVideoLoading(true);
    setVidIndex((prev) => (prev === videoTestimonials.length - 1 ? 0 : prev + 1));
  };
  const prevVid = () => {
    setIsVideoLoading(true);
    setVidIndex((prev) => (prev === 0 ? videoTestimonials.length - 1 : prev - 1));
  };

  // Auto-Play for Text
  useEffect(() => {
    const timer = setTimeout(nextText, 7000);
    return () => clearTimeout(timer);
  }, [textIndex]);

  // Simulate Fast Video Loading
  useEffect(() => {
    if (isVideoLoading) {
      const loadTimer = setTimeout(() => setIsVideoLoading(false), 1200);
      return () => clearTimeout(loadTimer);
    }
  }, [vidIndex, isVideoLoading]);

  return (
    <section id="testimonials" className="py-24 md:py-32 bg-background relative overflow-hidden border-t border-border/40">
      
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* ========================================= */}
        {/* TOP SECTION: 2-COLUMN PRO LAYOUT          */}
        {/* ========================================= */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-32">
          
          {/* --- LEFT SIDE: Title & Google Trust --- */}
          <div className="lg:col-span-5 text-center lg:text-left flex flex-col justify-center h-full">
            <span className="text-destructive font-bold tracking-wider uppercase text-sm mb-4 block">
              Verified Placements
            </span>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading leading-[1.1] mb-6">
              Real Students.<br />
              <span className="text-primary relative inline-block mt-2">
                Real Results.
                <motion.span 
                  initial={{ width: 0 }} 
                  whileInView={{ width: "100%" }} 
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="absolute left-0 bottom-1 h-2 bg-primary/20 -z-10 rounded-sm"
                />
              </span>
            </h2>
            
            <p className="text-foreground/70 text-lg leading-relaxed mb-10 max-w-md mx-auto lg:mx-0">
              Don't just take our word for it. Join hundreds of students who trusted us with their medical careers and are now studying globally.
            </p>

            {/* Google Professional Badge */}
            <div className="bg-card border border-border/60 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow inline-flex flex-col items-center lg:items-start gap-4 max-w-sm mx-auto lg:mx-0">
              <div className="flex items-center gap-4">
                {/* Google G Logo SVG */}
                <svg viewBox="0 0 24 24" className="w-10 h-10 shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <div>
                  <div className="flex gap-1 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                  </div>
                  <p className="font-extrabold text-foreground font-heading text-lg">
                    4.9/5 Average Rating
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-foreground/60 tracking-wide uppercase">
                Based on 25+ Authentic Reviews
              </p>
            </div>
          </div>

          {/* --- RIGHT SIDE: Text Testimonial Slider --- */}
          <div className="lg:col-span-7 relative flex items-center group">
            
            {/* Arrows ON THE SIDES of the card */}
            <button onClick={prevText} className="absolute left-0 -ml-4 md:-ml-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90">
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 -ml-0.5" />
            </button>

            <div className="w-full relative h-[320px] md:h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={textIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 px-4 md:px-8"
                >
                  <div className="bg-card rounded-[2rem] shadow-xl border border-border/50 h-full flex flex-col justify-center p-8 md:p-12 relative overflow-hidden">
                    <Quote className="absolute -top-2 -right-2 w-32 h-32 text-primary/5 -z-0 rotate-180" />
                    
                    <p className="text-lg md:text-xl text-foreground/80 italic font-medium leading-relaxed relative z-10 line-clamp-4">
                      "{textTestimonials[textIndex].text}"
                    </p>

                    <div className="flex items-center gap-4 mt-8 border-t border-border/50 pt-6 relative z-10">
                      <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-muted">
                        <img src={textTestimonials[textIndex].img} alt="Student" className="w-full h-full object-cover blur-[0.5px]" onError={(e) => e.currentTarget.style.display = 'none'} />
                      </div>
                      <div>
                        <h4 className="font-bold font-heading flex items-center gap-1.5 text-lg leading-none">
                          {textTestimonials[textIndex].name} <BadgeCheck className="w-4 h-4 fill-blue-500 text-white" />
                        </h4>
                        <p className="text-xs text-foreground/50 font-medium mt-1">@{textTestimonials[textIndex].handle}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <button onClick={nextText} className="absolute right-0 -mr-4 md:-mr-6 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90">
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 -mr-0.5" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* BOTTOM SECTION: CINEMATIC VIDEO PLAYER    */}
        {/* ========================================= */}
        <div className="text-center max-w-5xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-black font-heading mb-10">Watch Their Journeys</h3>
          
          {/* Flex Container for Arrows OUTSIDE the Video Frame */}
          <div className="flex items-center justify-center gap-2 md:gap-6">
            
            {/* Left External Arrow */}
            <button onClick={prevVid} className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-background border-2 border-border shadow-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90">
              <ChevronLeft className="w-6 h-6 md:w-8 md:h-8 -ml-0.5" />
            </button>

            {/* Video Frame */}
            <div className="relative flex-1 aspect-video rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border border-border/50 bg-black group">
              
              {/* White Screen Loader */}
              <AnimatePresence>
                {isVideoLoading && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-background z-30 flex flex-col items-center justify-center"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="flex flex-col items-center"
                    >
                      <Activity className="w-8 h-8 text-primary mb-3" />
                      <h2 className="text-xl font-black font-heading tracking-widest text-foreground">TCA</h2>
                      <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mt-1">Loading Video</p>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Video Thumbnail & Overlays */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={vidIndex}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  {/* Thumbnail */}
                  <img 
                    src={videoTestimonials[vidIndex].thumb} 
                    alt={videoTestimonials[vidIndex].title} 
                    loading="lazy"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Highly Optimized Quick Play Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/90 hover:bg-primary backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 md:w-10 md:h-10 text-primary-foreground fill-primary-foreground ml-1" />
                    </div>
                  </div>

                  {/* Video Title (Bottom Left) */}
                  <div className="absolute bottom-4 md:bottom-8 left-4 md:left-8 z-20">
                    <h4 className="text-white font-bold text-lg md:text-2xl font-heading drop-shadow-md">
                      {videoTestimonials[vidIndex].title}
                    </h4>
                  </div>

                  {/* --- BRAND WATERMARK (Bottom Right) --- */}
                  <img 
                    src="/logo.png" 
                    alt="TCA Logo" 
                    className="absolute bottom-4 md:bottom-6 right-4 md:right-6 h-6 md:h-8 w-auto opacity-[0.65] z-20 pointer-events-none drop-shadow-md brightness-0 invert" 
                    // brightness-0 invert turns a normal dark logo purely white so it shows on video, remove if your logo is already white.
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right External Arrow */}
            <button onClick={nextVid} className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-background border-2 border-border shadow-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90">
              <ChevronRight className="w-6 h-6 md:w-8 md:h-8 -mr-0.5" />
            </button>

          </div>

          {/* Dots for Video */}
          <div className="flex justify-center gap-2 mt-8">
            {videoTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => { setIsVideoLoading(true); setVidIndex(idx); }}
                className={`h-2.5 rounded-full transition-all duration-300 ${idx === vidIndex ? "w-10 bg-primary" : "w-2.5 bg-primary/20 hover:bg-primary/50"}`}
              />
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}