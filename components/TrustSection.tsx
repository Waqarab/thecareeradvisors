"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { Heart, Star, GraduationCap, Landmark, Globe, Trophy } from "lucide-react";

export default function TrustSection() {
  const reasons = [
    { 
      icon: "/icons/transparency.png", 
      title: "Transparency First", 
      desc: "No hidden fees, no false promises. Clear, honest guidance always." 
    },
    { 
      icon: "/icons/mastery.png", 
      title: "Decades of Mastery", 
      desc: "Years of experience, countless success stories, and deep knowledge you can trust." 
    },
    { 
      icon: "/icons/onetoone.png", 
      title: "1-on-1 Mentorship", 
      desc: "You're not a number. Dedicated, personalized attention just for you." 
    },
    { 
      icon: "/icons/proven.png", 
      title: "Proven Placements", 
      desc: "Hundreds of students successfully placed in top global universities." 
    },
    { 
      icon: "/icons/free.png", 
      title: "Free Consultation", 
      desc: "Expert advice, tailored to you—completely free, with no obligations." 
    },
    { 
      icon: "/icons/honesty.png", 
      title: "Honesty Always", 
      desc: "We tell it like it is—what's best for you, even if it's not what you expect." 
    },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section className="pt-4 pb-20 md:pt-8 md:pb-24 bg-gray-50 overflow-hidden font-sans relative">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-gradient-to-b from-blue-100/30 to-transparent pointer-events-none"></div>
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* --- TOP AREA: HEADINGS --- */}
        <div className="flex flex-col items-center text-center mb-12 lg:mb-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-6 shadow-sm"
          >
            <Heart className="w-3.5 h-3.5 text-orange-400" fill="currentColor" /> 
            Why Families Choose Us
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-[54px] font-extrabold text-gray-900 leading-tight tracking-tight mb-6"
          >
            Trusted by Families...
            <span className="text-blue-600 relative inline-block">
               Proven by Results...
              {/* Hand-drawn Orange Underline */}
              <svg className="absolute w-full h-4 -bottom-2 left-0 text-orange-500 overflow-visible" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 7C50 2 150 2 198 7" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
              </svg>
            </span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg md:text-xl max-w-2xl font-medium"
          >
            We go beyond promises—delivering real guidance, genuine support, and successful futures.
          </motion.p>
        </div>

        {/* --- MIDDLE AREA: 2-COLUMN LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-16 items-stretch">
          
          {/* LEFT SIDE: TRUST VISUAL CARD */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 relative flex flex-col h-full min-h-[500px] group cursor-default"
          >
            <div className="bg-blue-600 rounded-[40px] pt-12 px-6 pb-24 relative overflow-hidden flex-1 flex flex-col justify-end shadow-lg group-hover:shadow-blue-600/20 group-hover:shadow-2xl transition-all duration-500">
              
              {/* Decorative Airplane Dashed Path */}
              <svg className="absolute top-8 left-0 w-full h-32 opacity-30 text-white" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M-10 80 C 40 80, 60 20, 120 40 S 180 10, 220 20" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" strokeLinecap="round"/>
              </svg>
              
              {/* Family Placeholder Image - Replace src with your actual image path */}
              <div className="relative z-10 w-full h-full min-h-[300px] mt-8">
                {/* 
                  NOTE: Ensure you have a cropped PNG with a transparent background of a family here 
                  For now, leaving a placeholder div that mimics the space.
                */}
                <Image 
                  src="https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1780322654/Happy_students_nd_parents-Photoroom_qepbce.png" // Update this path
                  alt="Happy Student and Family if choosing thecareeradvisors"
                  fill
                  className="object-contain object-bottom scale-[1.25] origin-bottom group-hover:scale-[1.3] transition-transform duration-700 ease-out"
                  sizes="(max-width: 768px) 100vw, 40vw"
                />
              </div>
            </div>

            {/* Orange Overlay Card */}
            <div className="absolute -bottom-6 left-4 lg:left-8 bg-orange-500 rounded-3xl p-6 md:p-8 text-white w-[90%] shadow-xl border-4 border-gray-50 z-20 overflow-hidden group-hover:-translate-y-2 group-hover:shadow-orange-500/30 transition-all duration-500">
              {/* Floating Star Badge */}
              <div className="absolute -top-4 -left-4 bg-gray-50 rounded-full p-1.5 shadow-sm">
                <div className="bg-orange-500 rounded-full p-2">
                  <Star className="w-5 h-5 text-white" fill="currentColor" />
                </div>
              </div>
              
              {/* Decorative Accents */}
              <div className="absolute top-4 right-4 flex flex-col gap-1 opacity-40">
                <div className="w-6 h-0.5 bg-white rounded-full"></div>
                <div className="w-4 h-0.5 bg-white rounded-full ml-auto"></div>
              </div>
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-white/40 rounded-br-xl"></div>

              <h3 className="text-xl md:text-2xl font-bold mb-2 leading-tight">Your Success,<br/>Our Commitment</h3>
              <p className="text-white/90 text-sm font-medium leading-relaxed max-w-[250px]">
                We're with you at every step, from dream to destination.
              </p>
            </div>
          </motion.div>

          {/* RIGHT SIDE: 6 REASONS GRID */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6 mt-12 lg:mt-0"
          >
            {reasons.map((r, i) => (
              <motion.div 
                key={i} 
                variants={cardVariants}
                className="bg-white rounded-[24px] p-6 lg:p-7 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-200 flex flex-col items-center text-center hover:border-blue-400 hover:shadow-[0_15px_40px_-10px_rgba(30,64,175,0.2)] hover:bg-gradient-to-b hover:from-white hover:to-blue-50/50 hover:-translate-y-2 transition-all duration-300 group"
              >
                {/* Circular Icon Wrapper - Alternating Colors */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${
                  i % 2 === 0 ? 'bg-blue-600' : 'bg-orange-500'
                }`}>
                  <div className="relative w-8 h-8">
                    <Image 
                      src={r.icon} 
                      alt={r.title} 
                      fill
                      className="object-contain brightness-0 invert" 
                      sizes="32px"
                    />
                  </div>
                </div>
                
                <h3 className="text-gray-900 font-bold text-base lg:text-lg mb-3">
                  {r.title}
                </h3>
                
                <p className="text-gray-500 text-xs lg:text-sm font-medium leading-relaxed">
                  {r.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* --- BOTTOM AREA: SOCIAL PROOF BAR --- */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-blue-600 rounded-[24px] md:rounded-full py-8 px-6 md:px-12 flex flex-col md:flex-row flex-wrap items-center justify-between gap-8 shadow-xl relative overflow-hidden"
        >
          {/* Subtle Decorative Airplane on Right */}
          <svg className="absolute right-0 bottom-0 opacity-10 text-white w-48 h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0 100 C 30 80, 70 80, 100 0" stroke="currentColor" strokeWidth="4" strokeDasharray="8 8" fill="none" strokeLinecap="round"/>
          </svg>

          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-center md:justify-start hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-default">
            <GraduationCap className="w-10 h-10 text-white/90 drop-shadow-md" />
            <div className="text-left">
              <div className="text-3xl font-extrabold text-white leading-none mb-1">5000+</div>
              <div className="text-blue-100 text-sm font-medium">Students Guided</div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-center md:justify-start hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-default">
            <Landmark className="w-10 h-10 text-white/90 drop-shadow-md" />
            <div className="text-left">
              <div className="text-3xl font-extrabold text-white leading-none mb-1">500+</div>
              <div className="text-blue-100 text-sm font-medium">Students Placed</div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-center md:justify-start hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-default">
            <Globe className="w-10 h-10 text-white/90 drop-shadow-md" />
            <div className="text-left">
              <div className="text-3xl font-extrabold text-white leading-none mb-1">10+</div>
              <div className="text-blue-100 text-sm font-medium">Years Experience</div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10 w-full md:w-auto justify-center md:justify-start hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-default">
            <Trophy className="w-10 h-10 text-white/90 drop-shadow-md" />
            <div className="text-left">
              <div className="text-3xl font-extrabold text-white leading-none mb-1">High</div>
              <div className="text-blue-100 text-sm font-medium">Success Rate</div>
            </div>
          </div>
          
        </motion.div>

      </div>
    </section>
  );
}