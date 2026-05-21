"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

export default function TrustSection() {
  const reasons = [
    { 
      icon: "/icons/transparency.png", 
      title: "Transparency First", 
      desc: "No hidden fees, no false promises. Clear, honest pathways." 
    },
    { 
      icon: "/icons/mastery.png", 
      title: "Decades Mastery", 
      desc: "Navigating complex admissions with pinpoint accuracy." 
    },
    { 
      icon: "/icons/onetoone.png", 
      title: "1-on-1 Mentorship", 
      desc: "You are not a number. Dedicated, personalized attention." 
    },
    { 
      icon: "/icons/proven.png", 
      title: "Proven Placements", 
      desc: "Flawless track record in top-tier medical universities." 
    },
    { 
      icon: "/icons/free.png", 
      title: "Free Strategy", 
      desc: "Cost-free initial consultation to map your exact roadmap." 
    },
    { 
      icon: "/icons/honesty.png", 
      title: "Honesty Always", 
      desc: "We tell you exactly what you need to hear, always." 
    },
  ];

  // Properly typed Framer Motion variants to clear the TypeScript error
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 } // Fast stagger for mobile speed
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  };

  return (
    <section className="py-16 md:py-32 relative overflow-hidden bg-background">
      
      {/* Background Blobs for Depth */}
      <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-destructive/5 rounded-full blur-[80px] md:blur-[100px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* HEADER AREA */}
        <div className="text-center mb-12 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl lg:text-6xl font-black font-heading mb-4 md:mb-6 text-foreground leading-tight"
          >
            Why Families <br className="md:hidden" />
            <span className="relative inline-block px-3 mt-1 md:mt-0 text-white">
              {/* Sweeping Marker Highlight Animation */}
              <motion.span 
                initial={{ width: 0 }} 
                whileInView={{ width: "100%" }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "circOut", delay: 0.2 }}
                className="absolute inset-0 bg-primary -z-10 rounded-lg md:rounded-2xl shadow-lg"
              />
              Choose Us
            </span>
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="inline-block relative"
          >
            <p className="text-base md:text-2xl text-foreground/80 font-bold italic relative z-10 px-4 md:px-6 py-1 md:py-2">
              "We prove it by results, not just words."
            </p>
            {/* Subtle underline */}
            <div className="absolute bottom-0 md:bottom-1 left-1/2 -translate-x-1/2 w-[80%] h-1 md:h-1.5 bg-gradient-to-r from-transparent via-destructive/40 to-transparent rounded-full"></div>
          </motion.div>
        </div>

        {/* DENSE MOBILE GRID & DESKTOP HONEYCOMB */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          // grid-cols-2 forces 2 items per row on mobile to eliminate scroll fatigue
          className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-x-8 md:gap-y-12 pb-6 md:pb-12"
        >
          {reasons.map((r, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              // The staggered honeycomb effect ONLY applies to large desktop screens (lg:translate-y-12)
              className={`bg-card/60 backdrop-blur-md p-5 md:p-10 rounded-2xl md:rounded-[2.5rem] border border-border/60 shadow-sm hover:shadow-2xl hover:border-primary/40 transition-all duration-300 flex flex-col items-center text-center group relative overflow-hidden ${
                (i === 1 || i === 4) ? 'lg:translate-y-12' : ''
              }`}
            >
              
              {/* Internal Glow on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* RESPONSIVE CSS HEXAGON WRAPPER */}
              <div 
                className="w-12 h-12 md:w-24 md:h-24 mb-3 md:mb-6 bg-gradient-to-br from-muted to-muted border-2 border-transparent flex items-center justify-center group-hover:from-primary/10 group-hover:to-primary/5 group-hover:border-primary/30 transition-all duration-500 relative z-10"
                style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
              >
                <div className="w-6 h-6 md:w-12 md:h-12 relative group-hover:scale-110 transition-transform duration-500">
                  <Image 
                    src={r.icon} 
                    alt={r.title} 
                    fill
                    sizes="(max-width: 768px) 24px, 48px"
                    className="object-contain drop-shadow-sm group-hover:drop-shadow-md transition-all"
                  />
                </div>
              </div>
              
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className="font-black font-heading text-sm md:text-2xl leading-tight text-foreground mb-1.5 md:mb-3 group-hover:text-primary transition-colors duration-300">
                  {r.title}
                </h3>
                <p className="text-[10px] md:text-base font-medium text-foreground/70 leading-snug md:leading-relaxed group-hover:text-foreground/90 transition-colors duration-300 mt-auto">
                  {r.desc}
                </p>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}