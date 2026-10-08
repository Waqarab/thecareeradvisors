"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BadgeCheck, Quote, ChevronLeft, ChevronRight, Play } from "lucide-react";

// --- DUMMY DATA ---
const textTestimonials = [
  {
    id: 1,
    name: "Rounak Showkat",
    handle: "rounak.showkat",
    text: "I recommend The Career Advisors for any type of guidance, because they helped me at the every step of my MBBS journey.",
    img: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779608772/Rounak_mq8nuv.jpg",
    initials: "AM"
  },
  {
    id: 2,
    name: "Zoha Zahid",
    handle: "zoha",
    text: "I honestly didn’t know where to start, but The Career Advisors helped me at every single step patiently.",
    img: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779614310/Zoha_dyibtn.jpg",
    initials: "RS"
  },
  {
    id: 3,
    name: "Mudabir",
    handle: "mudabir",
    text: "I’m thankful to The Career Advisors for helping me choose the right university according to my budget and goals.",
    img: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779614309/Mudabir_yojhit.jpg",
    initials: "MR"
  },
  {
    id: 4,
    name: "Muskan",
    handle: "muskan",
    text: "What I liked most was their honest guidance. They explained everything clearly without making false promises.",
    img: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779614310/Muskan_w6t3qf.jpg",
    initials: "MT"
  }
];

// Replace the videoUrl with your actual Cloudinary/Storage video links
const videoTestimonials = [
  { 
    id: 1, 
    studentName: "Anzila Tariq", 
    collegeName: "AMU Astana. Kazakhstan",
    videoUrl: "https://res.cloudinary.com/drytpdpx3/video/upload/q_auto/f_auto/v1780111369/Vid01_wq194s.mp4" 
  },
  { 
    id: 2, 
    studentName: "Qasim Shamim", 
    collegeName: "Alexandria University, Egypt",
    videoUrl: "https://res.cloudinary.com/drytpdpx3/video/upload/q_auto/f_auto/v1780234554/qasim_xhwdnx.mp4" 
  },
  { 
    id: 3, 
    studentName: "Rounak Showkat", 
    collegeName: "Astana Kazakhstan",
    videoUrl: "https://res.cloudinary.com/drytpdpx3/video/upload/q_auto/f_auto/v1780111365/Vis02_sogqi6.mp4" 
  },
];

export default function TestimonialSection() {
  const [textIndex, setTextIndex] = useState(0);
  const [vidIndex, setVidIndex] = useState(0);
  
  // --- VIDEO CONTROLS STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // --- NAVIGATION CONTROLS ---
  const nextText = () => setTextIndex((prev) => (prev === textTestimonials.length - 1 ? 0 : prev + 1));
  const prevText = () => setTextIndex((prev) => (prev === 0 ? textTestimonials.length - 1 : prev - 1));

  const nextVid = () => setVidIndex((prev) => (prev === videoTestimonials.length - 1 ? 0 : prev + 1));
  const prevVid = () => setVidIndex((prev) => (prev === 0 ? videoTestimonials.length - 1 : prev - 1));

  // Auto-Play for Text Testimonials
  useEffect(() => {
    const timer = setTimeout(nextText, 7000);
    return () => clearTimeout(timer);
  }, [textIndex]);

  // Reset video state when switching slides
  useEffect(() => {
    setIsPlaying(false);
  }, [vidIndex]);

  // Video play/pause handler
  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <section id="testimonials" className="py-12 md:py-20 lg:py-28 bg-background relative overflow-hidden border-t border-border/40">
      
      {/* Background Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* ========================================= */}
          {/* LEFT SIDE: Content & Text Slider          */}
          {/* ========================================= */}
          <div className="lg:col-span-6 flex flex-col justify-center h-full pb-8 lg:pb-0">
            
            <div className="text-center lg:text-left mb-8">
              <span className="text-primary font-bold tracking-wider uppercase text-xs md:text-sm mb-3 block">
                Verified Placements
              </span>
              
              <h2 className="text-4xl md:text-5xl lg:text-[54px] font-black font-heading leading-[1.1] mb-4">
                Real Students.<br />
                <span className="text-primary relative inline-block mt-1">
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
              
              <p className="text-foreground/70 text-base md:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                Don't just take our word for it. Join hundreds of students who trusted us with their medical careers.
              </p>
            </div>

            {/* Text Testimonial Slider */}
            <div className="relative w-full max-w-xl mx-auto lg:mx-0">
              <div className="w-full relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={textIndex}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.3 }}
                    className="w-full"
                  >
                    <div className="bg-card/80 backdrop-blur-sm rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-border/50 flex flex-col p-6 md:p-8 relative overflow-hidden">
                      <Quote className="absolute -top-2 -right-2 w-20 h-20 text-primary/5 -z-0 rotate-180" />
                      
                      <p className="text-base md:text-lg text-foreground/90 font-medium leading-relaxed relative z-10">
                        "{textTestimonials[textIndex].text}"
                      </p>

                      <div className="flex items-center gap-4 mt-6 pt-4 border-t border-border/40 relative z-10">
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-muted border-2 border-background shadow-sm">
                          <img src={textTestimonials[textIndex].img} alt="Student" className="w-full h-full object-cover blur-[0.5px]" onError={(e) => e.currentTarget.style.display = 'none'} />
                        </div>
                        <div>
                          <h4 className="font-bold font-heading flex items-center gap-1.5 text-base leading-none text-foreground">
                            {textTestimonials[textIndex].name} <BadgeCheck className="w-4 h-4 fill-blue-500 text-white" />
                          </h4>
                          <p className="text-xs text-foreground/60 font-medium mt-1">@{textTestimonials[textIndex].handle}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Integrated Controls & Google Badge */}
              <div className="flex items-center justify-between mt-6 px-1">
                
                {/* Google Professional Badge - Compact */}
                <div className="flex items-center gap-3">
                  <svg viewBox="0 0 24 24" className="w-7 h-7 shrink-0">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <div>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                    </div>
                    <p className="text-xs font-bold text-foreground/80 font-heading">
                      4.9/5 on Google
                    </p>
                  </div>
                </div>

                {/* Arrows */}
                <div className="flex items-center gap-2">
                  <button onClick={prevText} className="w-9 h-9 rounded-full bg-background border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all active:scale-90">
                    <ChevronLeft className="w-4 h-4 -ml-0.5" />
                  </button>
                  <button onClick={nextText} className="w-9 h-9 rounded-full bg-background border border-border shadow-sm flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all active:scale-90">
                    <ChevronRight className="w-4 h-4 -mr-0.5" />
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ========================================= */}
          {/* RIGHT SIDE: Vertical Video Slider         */}
          {/* ========================================= */}
          <div className="lg:col-span-6 w-full mx-auto lg:max-w-none text-center mt-12 lg:mt-0 flex flex-col items-center justify-center">
            <h3 className="text-2xl font-black font-heading mb-6 lg:hidden">Watch Their Journeys</h3>
            
            {/* 
              By setting max-w-[300px] or max-w-[340px], the vertical video looks like a sleek phone frame
              instead of becoming a gigantic 75vh box on desktop.
            */}
            <div className="flex items-center justify-center relative w-full max-w-[280px] md:max-w-[340px] mx-auto">
              
              {/* Left Video Arrow */}
              <button onClick={prevVid} className="absolute -left-12 md:-left-16 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/90 md:bg-background border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90 backdrop-blur-md md:backdrop-blur-none">
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 -ml-0.5" />
              </button>

              {/* Vertical Video Frame */}
              <div className="relative flex-1 w-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-black/90 bg-black group aspect-[9/16] cursor-pointer" onClick={togglePlay}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={vidIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative flex items-center justify-center"
                  >
                    
                    {/* PLAY BUTTON OVERLAY */}
                    {!isPlaying && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 pointer-events-none transition-all duration-300">
                        <div className="w-14 h-14 md:w-16 md:h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-2xl scale-100 group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-6 h-6 md:w-8 md:h-8 ml-1 fill-current" />
                        </div>
                      </div>
                    )}

                    {/* USER CONTROLLED VIDEO */}
                    <video 
                      ref={videoRef}
                      src={videoTestimonials[vidIndex].videoUrl}
                      loop
                      playsInline
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      className="w-full h-full object-cover"
                    />

                    {/* Text Overlay (Bottom Left) */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-4 md:p-6 pt-16 flex flex-col items-start text-left pointer-events-none">
                      <h4 className="text-white font-black text-base md:text-lg font-heading drop-shadow-lg flex items-center gap-1.5">
                        {videoTestimonials[vidIndex].studentName}
                        <BadgeCheck className="w-4 h-4 fill-blue-500 text-white shrink-0" />
                      </h4>
                      <p className="text-white/80 font-medium text-xs mt-1 truncate w-full">
                        📍 {videoTestimonials[vidIndex].collegeName}
                      </p>
                    </div>

                    {/* Brand Watermark (Bottom Right) */}
                    <img 
                      src="/logo.png" 
                      alt="TCA Logo" 
                      className="absolute bottom-4 right-4 h-4 w-auto opacity-[0.8] z-20 pointer-events-none drop-shadow-md brightness-0 invert" 
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Video Arrow */}
              <button onClick={nextVid} className="absolute -right-12 md:-right-16 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/90 md:bg-background border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-90 backdrop-blur-md md:backdrop-blur-none">
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 -mr-0.5" />
              </button>

            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-1.5 mt-6">
              {videoTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setVidIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${idx === vidIndex ? "w-6 bg-primary" : "w-2 bg-primary/20 hover:bg-primary/50"}`}
                />
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}