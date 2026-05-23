"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Globe2, CheckCircle2, Banknote, MapPin, Sparkles, BookOpen, Building2, MousePointerClick, Eye, ArrowRight } from "lucide-react";

const countries = [
  { id: "bangladesh", name: "Bangladesh", icon: MapPin },
  { id: "egypt", name: "Egypt", icon: MapPin },
  { id: "italy", name: "Italy", icon: MapPin },
  { id: "china", name: "China", icon: MapPin },
  { id: "kazakhstan", name: "Kazakhstan", icon: MapPin },
];

export default function ScholarshipsSection() {
  const [activeTab, setActiveTab] = useState("bangladesh");

  return (
    <section className="py-16 md:py-20 relative z-10 bg-background overflow-hidden">
      {/* PERFORMANCE UPDATE: Removed heavy blur background object that caused mobile lag */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none -z-10"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Section Intro */}
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Banknote className="w-4 h-4" /> Global Opportunities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-black text-foreground mb-6 tracking-tight font-heading"
          >
            International Scholarships & <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Grants</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-sm md:text-lg text-foreground/75 font-medium space-y-4 leading-relaxed px-2 md:px-0"
          >
            <p>
              At The Career Advisors, we believe that talented students should never miss international education opportunities because of financial limitations. That is why we actively guide students for scholarships, tuition fee concessions, and international grants.
            </p>
          </motion.div>
        </div>

        {/* NEW: Simple Interactive Tutorial/Guide */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-10 text-sm font-bold text-foreground/80 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-2xl border border-blue-200 dark:border-blue-900/50 max-w-3xl mx-auto shadow-sm"
        >
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <MousePointerClick className="w-5 h-5"/> 1. Select a Country
          </div>
          <ArrowRight className="hidden sm:block w-4 h-4 text-blue-300 dark:text-blue-800" />
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Eye className="w-5 h-5"/> 2. View Benefits
          </div>
          <ArrowRight className="hidden sm:block w-4 h-4 text-blue-300 dark:text-blue-800" />
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <Sparkles className="w-5 h-5"/> 3. Claim with Us
          </div>
        </motion.div>

        {/* Interactive Tabs Component */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-12 items-start">
          
          {/* Left Side: Country Selection Pills */}
          <div className="w-full lg:w-1/3 flex flex-col sticky top-24 z-20">
            <div className="flex flex-wrap lg:flex-col gap-2 md:gap-3 w-full">
              {countries.map((country) => (
                <button
                  key={country.id}
                  onClick={() => setActiveTab(country.id)}
                  className={`flex items-center justify-center lg:justify-start gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm md:text-base text-left transition-all duration-200 flex-grow lg:flex-grow-0 lg:w-full ${
                    activeTab === country.id 
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)] scale-[1.02] border-none" 
                      : "bg-white dark:bg-zinc-900 border border-border/50 text-foreground/70 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30"
                  }`}
                >
                  <country.icon className={`w-4 h-4 md:w-5 md:h-5 shrink-0 ${activeTab === country.id ? "text-white" : "text-blue-500"}`} />
                  {country.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Side: Tab Content Area */}
          <div className="w-full lg:w-2/3 min-h-[500px]">
            <AnimatePresence mode="wait">
              {/* PERFORMANCE UPDATE: Removed blur filters which lag lower-end phones */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-white dark:bg-zinc-900/80 border border-blue-100 dark:border-blue-900/30 rounded-3xl p-5 sm:p-6 md:p-10 shadow-lg h-full"
              >
                {/* 1. BANGLADESH */}
                {activeTab === "bangladesh" && (
                  <div className="space-y-6 md:space-y-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3 md:mb-4">Bangladesh – SAARC Quota Scholarship</h3>
                      <p className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed">Bangladesh offers special tuition fee concessions and scholarship opportunities for students from SAARC countries, especially for MBBS programs in selected private medical colleges.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 md:w-5 md:h-5"/> Key Benefits</h4>
                        <ul className="space-y-2">
                          {["Reduced tuition fees", "Affordable MBBS education", "Lower overall study cost", "High-quality medical education", "NMC-recognized universities"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 md:w-5 md:h-5"/> Scholarship Eligibility</h4>
                        <ul className="space-y-2">
                          {["NEET qualification mandatory", "Good academic performance", "Limited scholarship seats", "Subject to university approval"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 p-4 md:p-5 rounded-2xl">
                      <h4 className="text-base md:text-lg font-bold text-foreground mb-3">Scholarship Support by The Career Advisors</h4>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {["University selection guidance", "SAARC quota application support", "Documentation assistance", "Admission processing", "Visa & travel support"].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-foreground/80 text-sm font-medium"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2. EGYPT */}
                {activeTab === "egypt" && (
                  <div className="space-y-6 md:space-y-8">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3 md:mb-4">Egypt – Undergraduate Scholarship Programs</h3>
                      <p className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed">Egypt provides merit-based scholarship opportunities and tuition fee discounts for international students in selected public universities and programs.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6 md:gap-8">
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2"><Banknote className="w-4 h-4 md:w-5 md:h-5"/> Available Types</h4>
                        <ul className="space-y-2">
                          {["Merit-based tuition discounts", "Partial tuition scholarships", "International student grants", "University-specific offers"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 md:w-5 md:h-5"/> Key Advantages</h4>
                        <ul className="space-y-2">
                          {["Study in high QS-ranked universities", "Globally recognized degrees", "Affordable tuition after benefits", "Strong clinical exposure"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 md:gap-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 p-4 md:p-5 rounded-2xl">
                      <div>
                         <h4 className="text-base md:text-lg font-bold text-foreground mb-3">Eligibility</h4>
                         <ul className="space-y-1.5">
                           {["Strong academic profile", "Good NEET performance", "University selection criteria", "Limited quota availability"].map((item, i) => (
                             <li key={i} className="flex items-center gap-2 text-foreground/80 text-sm font-medium"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}</li>
                           ))}
                         </ul>
                      </div>
                      <div>
                         <h4 className="text-base md:text-lg font-bold text-foreground mb-3">Guidance Services</h4>
                         <ul className="space-y-1.5">
                           {["Scholarship applications", "University selection", "Documentation support", "Admission procedures"].map((item, i) => (
                             <li key={i} className="flex items-center gap-2 text-foreground/80 text-sm font-medium"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}</li>
                           ))}
                         </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. ITALY */}
                {activeTab === "italy" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3">Italy – IMAT Scholarship Pathway</h3>
                      <p className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed">Italy has become one of the most desired destinations for students looking for affordable European medical education. Through the IMAT, students can apply for English-medium medical universities.</p>
                      <p className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed mt-2">What makes Italy unique is that students gain access to regional scholarship opportunities that can significantly reduce the overall cost of education.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2"><Globe2 className="w-4 h-4 md:w-5 md:h-5"/> Many are unaware that:</h4>
                        <ul className="space-y-2">
                          {["Public universities are highly affordable", "Scholarships cover tuition & living", "Hostel and meal benefits included", "Degrees recognized across Europe"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 md:w-5 md:h-5"/> Italy offers:</h4>
                        <ul className="space-y-2">
                          {["European lifestyle and exposure", "Advanced research opportunities", "International career pathways", "English-medium medical programs"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 p-4 md:p-5 rounded-2xl">
                      <h4 className="text-base md:text-lg font-bold text-foreground mb-3">The Career Advisors provides:</h4>
                      <ul className="flex flex-wrap gap-x-4 gap-y-2">
                        {["IMAT preparation guidance", "University shortlisting", "Scholarship counseling", "Visa support", "Accommodation assistance"].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-foreground/80 text-sm font-medium"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 4. CHINA */}
                {activeTab === "china" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3">China – Fully Funded & Partial Scholarships</h3>
                      <p className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed">China has emerged as one of the world’s largest education hubs due to its massive government-funded scholarship system and globally growing universities.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">Scholarships Include:</h4>
                        <ul className="space-y-2">
                          {["Full tuition coverage", "Free hostel accommodation", "Monthly stipends", "Medical insurance"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">Students are attracted to:</h4>
                        <ul className="space-y-2">
                          {["Modern smart campuses", "Advanced laboratories", "Affordable cost of living", "International student environment"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 p-4 md:p-5 rounded-2xl">
                       <h4 className="text-base md:text-lg font-bold text-foreground mb-3">Scholarships are offered through:</h4>
                       <div className="flex flex-wrap gap-2 mb-4">
                         {["Chinese Government Scholarships", "Provincial Scholarships", "University Scholarships", "Belt & Road Programs"].map((item, i) => (
                           <span key={i} className="px-3 py-1 bg-white dark:bg-zinc-800 rounded-lg text-xs font-bold border border-blue-100 dark:border-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm">{item}</span>
                         ))}
                       </div>
                    </div>
                  </div>
                )}

                {/* 5. KAZAKHSTAN */}
                {activeTab === "kazakhstan" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-black text-foreground mb-3">Kazakhstan – Scholarship & Tuition Support</h3>
                      <p className="text-sm md:text-base text-foreground/80 font-medium leading-relaxed">Kazakhstan is becoming increasingly popular among international students because of its modern universities, affordable tuition structures, and growing scholarship opportunities.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">Universities Offer:</h4>
                        <ul className="space-y-2">
                          {["Merit-based scholarships", "Tuition fee concessions", "International student support programs", "Academic performance grants"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-base md:text-lg font-bold text-blue-600 dark:text-blue-400 mb-3">Students Prefer Kazakhstan for:</h4>
                        <ul className="space-y-2">
                          {["Modern infrastructure", "Internationally recognized universities", "English-medium programs", "Strong student safety"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 p-4 md:p-5 rounded-2xl">
                      <h4 className="text-base font-bold text-foreground mb-2">The Career Advisors guides students throughout:</h4>
                      <ul className="flex flex-wrap gap-x-4 gap-y-2">
                        {["Scholarship counseling", "University applications", "Admission procedures", "Documentation support", "Visa processing", "Settlement assistance"].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-foreground/80 text-xs font-bold uppercase tracking-wider"><div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Why Students Trust Us Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="mt-12 md:mt-16 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[2rem] p-6 md:p-12 shadow-2xl border border-blue-500/20"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-black mb-4 font-heading">Why Students Trust The Career Advisors for <span className="text-blue-400">Scholarships</span></h3>
              <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed mb-6">
                Many students miss international scholarship opportunities simply because they are unaware of available programs or proper procedures. Our goal is to secure admissions while helping students access global education affordably.
              </p>
              <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
                We ensure students receive updated guidance regarding:
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 md:gap-4">
               {[
                 "Available scholarship categories", 
                 "Country-wise opportunities", 
                 "University-specific benefits", 
                 "Tuition reduction programs", 
                 "Merit-based admissions", 
                 "Documentation procedures"
               ].map((item, i) => (
                 <div key={i} className="flex items-start gap-3 bg-white/5 p-3 md:p-4 rounded-xl border border-white/10 hover:border-blue-500/50 transition-colors">
                   <GraduationCap className="w-4 h-4 md:w-5 md:h-5 text-blue-400 shrink-0 mt-0.5" />
                   <span className="text-xs md:text-sm font-bold text-slate-200 leading-tight">{item}</span>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}