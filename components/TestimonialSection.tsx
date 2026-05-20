"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ayesha Mir",
    university: "Tbilisi State Medical University, Georgia",
    text: "Thanks to The Career Advisors, I got admission in my dream university. Their support throughout the visa and documentation process was completely stress-free and highly transparent!",
    initials: "AM"
  },
  {
    id: 2,
    name: "Rohit Sharma",
    university: "Kazan Federal University, Russia",
    text: "I was confused about which country to choose, but their expert counsellors guided me based on my NEET score and budget. Today, I am in my 3rd year and loving the campus.",
    initials: "RS"
  },
  {
    id: 3,
    name: "Sania Rashid",
    university: "Dhaka National Medical College, Bangladesh",
    text: "They didn't just help me with admission; they ensured I reached my hostel safely and settled in. 100% genuine and the most trustworthy consultancy in J&K.",
    initials: "SR"
  }
];

export default function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Smart Navigation Functions
  const nextSlide = () => setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));

  // Smart Auto-play: Resets the timer whenever currentIndex changes manually
  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <section id="testimonials" className="py-24 bg-background relative overflow-hidden border-t border-border/40 z-0">
      
      {/* Subtle Background Animation */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] pointer-events-none -z-10"
      />

      <div className="container mx-auto px-4 md:px-8">
        
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          {/* LEFT SIDE: Context & Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="text-center lg:text-left z-10"
          >
            <span className="text-destructive font-bold tracking-wider uppercase text-sm mb-4 block">
              Student Stories
            </span>
            
            {/* Animated Highlight Heading */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground font-heading mb-6 leading-[1.2]">
              Real Students. <br className="hidden lg:block" />
              <div className="relative inline-block mt-2">
                {/* The Dark Highlight Overlay */}
                <motion.div
                  initial={{ width: "0%" }}
                  whileInView={{ width: "100%" }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.7, delay: 0.3, ease: "easeInOut" }}
                  className="absolute inset-0 bg-foreground rounded-lg shadow-lg"
                ></motion.div>
                {/* The Text that turns white */}
                <motion.span
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="relative z-10 text-background px-4 py-1 inline-block"
                >
                  Real Results.
                </motion.span>
              </div>
            </h2>
            
            <p className="text-lg text-foreground/70 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Don't just take our word for it. Hear from the hundreds of students who trusted us with their medical careers and are now studying across the globe.
            </p>
            
            {/* Professional Navigation Controls */}
            <div className="flex items-center justify-center lg:justify-start gap-6">
              {/* Arrows */}
              <div className="flex gap-2">
                <button 
                  onClick={prevSlide}
                  className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-95 bg-background"
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="w-6 h-6 -ml-0.5" />
                </button>
                <button 
                  onClick={nextSlide}
                  className="w-12 h-12 rounded-full border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-sm active:scale-95 bg-background"
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="w-6 h-6 -mr-0.5" />
                </button>
              </div>

              <div className="h-8 w-px bg-border"></div>

              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      idx === currentIndex ? "w-10 bg-primary" : "w-2.5 bg-primary/20 hover:bg-primary/50"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* RIGHT SIDE: Animated Slider Card */}
          <div className="relative h-[420px] sm:h-[350px] z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {/* Redesigned Card Container */}
                <div className="bg-card rounded-3xl shadow-xl border border-border/50 h-full flex flex-col relative group overflow-hidden">
                  
                  {/* Decorative Background Quote */}
                  <Quote className="absolute top-8 right-8 w-20 h-20 text-primary/5 rotate-180 group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Top Review Section */}
                  <div className="p-8 md:p-10 flex-1 flex flex-col justify-center">
                    {/* Rating Stars */}
                    <div className="flex gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-lg md:text-xl text-foreground/80 italic font-medium leading-relaxed relative z-10 line-clamp-4">
                      "{testimonials[currentIndex].text}"
                    </p>
                  </div>

                  {/* Bottom Profile Footer (Fixes the layout issue) */}
                  <div className="bg-muted/40 p-6 md:px-10 border-t border-border/50 flex items-center gap-4">
                    <div className="w-14 h-14 shrink-0 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold font-heading text-xl shadow-sm">
                      {testimonials[currentIndex].initials}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-bold text-foreground font-heading text-lg leading-tight truncate">
                        {testimonials[currentIndex].name}
                      </h4>
                      <p className="text-sm text-foreground/60 font-medium truncate mt-0.5">
                        {testimonials[currentIndex].university}
                      </p>
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}