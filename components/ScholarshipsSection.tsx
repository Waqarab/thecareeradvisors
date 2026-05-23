"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Globe2, CheckCircle2, Banknote, MapPin, Sparkles, BookOpen, Building2 } from "lucide-react";

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
    <section className="py-20 relative z-10 bg-background overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[800px] bg-orange-500/5 blur-[120px] rounded-[100%] pointer-events-none -z-10"></div>

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Section Intro */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Banknote className="w-4 h-4" /> Global Opportunities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight font-heading"
          >
            International Scholarships & <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Grants</span>
          </motion.h2>
          <motion.div 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
            className="text-base md:text-lg text-foreground/75 font-medium space-y-4 leading-relaxed"
          >
            <p>
              At The Career Advisors, we believe that talented students should never miss international education opportunities because of financial limitations. That is why we actively guide students for scholarships, tuition fee concessions, international grants, and special admission opportunities across multiple countries.
            </p>
            <p>
              Many students are unaware that countries like Bangladesh, Egypt, Italy, China, and Kazakhstan offer various scholarship pathways for deserving international students. Our team helps students understand these opportunities and apply strategically according to their academic profile, budget, and career goals.
            </p>
          </motion.div>
        </div>

        {/* Interactive Interactive Tabs Component */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          
          {/* Left Side: Country Selection Pills */}
          <div className="w-full lg:w-1/3 flex flex-row lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide sticky top-24">
            {countries.map((country) => (
              <button
                key={country.id}
                onClick={() => setActiveTab(country.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-left transition-all duration-300 whitespace-nowrap lg:whitespace-normal flex-shrink-0 lg:flex-shrink w-full ${
                  activeTab === country.id 
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_8px_30px_rgba(249,115,22,0.3)] scale-[1.02]" 
                    : "bg-white/5 border border-border/50 text-foreground/70 hover:bg-orange-500/10 hover:text-orange-500"
                }`}
              >
                <country.icon className={`w-5 h-5 ${activeTab === country.id ? "text-white" : "text-orange-500"}`} />
                {country.name}
              </button>
            ))}
          </div>

          {/* Right Side: Tab Content Area (Glassmorphism Panel) */}
          <div className="w-full lg:w-2/3 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20, filter: "blur(10px)" }}
                animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-border/50 rounded-3xl p-6 md:p-10 shadow-2xl h-full"
              >
                {/* 1. BANGLADESH */}
                {activeTab === "bangladesh" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-3xl font-black text-foreground mb-4">Bangladesh – SAARC Quota Scholarship</h3>
                      <p className="text-foreground/80 font-medium leading-relaxed">Bangladesh offers special tuition fee concessions and scholarship opportunities for students from SAARC countries, especially for MBBS programs in selected private medical colleges.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-bold text-orange-500 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5"/> Key Benefits</h4>
                        <ul className="space-y-2">
                          {["Reduced tuition fees", "Affordable MBBS education", "Lower overall study cost", "High-quality medical education", "NMC-recognized universities"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-orange-500 mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5"/> Scholarship Eligibility</h4>
                        <ul className="space-y-2">
                          {["NEET qualification mandatory", "Good academic performance", "Limited scholarship seats", "Subject to university approval", "Availability may vary every academic session"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-2xl">
                      <h4 className="text-lg font-bold text-foreground mb-3">Scholarship Support by The Career Advisors</h4>
                      <ul className="grid sm:grid-cols-2 gap-2">
                        {["University selection guidance", "SAARC quota application support", "Documentation assistance", "Admission processing", "Visa & travel support"].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-foreground/80 text-sm font-medium"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 2. EGYPT */}
                {activeTab === "egypt" && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-3xl font-black text-foreground mb-4">Egypt – Undergraduate Scholarship Programs</h3>
                      <p className="text-foreground/80 font-medium leading-relaxed">Egypt provides merit-based scholarship opportunities and tuition fee discounts for international students in selected public universities and programs.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-lg font-bold text-orange-500 mb-3 flex items-center gap-2"><Banknote className="w-5 h-5"/> Available Types</h4>
                        <ul className="space-y-2">
                          {["Merit-based tuition discounts", "Partial tuition fee scholarships", "International student grants", "University-specific scholarship offers"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-orange-500 mb-3 flex items-center gap-2"><Sparkles className="w-5 h-5"/> Key Advantages</h4>
                        <ul className="space-y-2">
                          {["Study in high QS-ranked universities", "Internationally recognized degrees", "Affordable tuition after scholarship benefits", "Strong academic and clinical exposure"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 bg-orange-500/5 border border-orange-500/20 p-5 rounded-2xl">
                      <div>
                         <h4 className="text-lg font-bold text-foreground mb-3">Eligibility</h4>
                         <ul className="space-y-1.5">
                           {["Strong academic profile", "Good NEET/academic performance", "University selection criteria", "Limited scholarship quota"].map((item, i) => (
                             <li key={i} className="flex items-center gap-2 text-foreground/80 text-sm font-medium"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {item}</li>
                           ))}
                         </ul>
                      </div>
                      <div>
                         <h4 className="text-lg font-bold text-foreground mb-3">Guidance Services</h4>
                         <ul className="space-y-1.5">
                           {["Scholarship applications", "University selection", "Documentation support", "Admission procedures", "Student visa guidance"].map((item, i) => (
                             <li key={i} className="flex items-center gap-2 text-foreground/80 text-sm font-medium"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {item}</li>
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
                      <h3 className="text-3xl font-black text-foreground mb-3">Italy – IMAT Scholarship & European Pathway</h3>
                      <p className="text-foreground/80 font-medium leading-relaxed">Italy has become one of the most desired destinations for students looking for affordable European medical education. Through the IMAT (International Medical Admissions Test), students can apply for English-medium medical universities across Italy.</p>
                      <p className="text-foreground/80 font-medium leading-relaxed mt-2">What makes Italy unique is that students not only receive globally recognized European degrees but also gain access to scholarship opportunities that can significantly reduce the overall cost of education.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-bold text-orange-500 mb-3 flex items-center gap-2"><Globe2 className="w-5 h-5"/> Many are unaware that:</h4>
                        <ul className="space-y-2">
                          {["Public universities in Italy are comparatively affordable", "Regional scholarships can cover tuition and living expenses", "Students may receive hostel and meal benefits", "Degrees are recognized across Europe and internationally"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-orange-500 mb-3 flex items-center gap-2"><Building2 className="w-5 h-5"/> Italy offers:</h4>
                        <ul className="space-y-2">
                          {["European lifestyle and exposure", "Advanced research opportunities", "International career pathways", "English-medium medical programs", "Opportunities for residency and future practice in Europe"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <p className="text-sm font-bold text-foreground italic border-l-2 border-orange-500 pl-3">The IMAT pathway is highly competitive but extremely rewarding for students aiming for a premium international education experience at an affordable budget.</p>

                    <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-2xl">
                      <h4 className="text-lg font-bold text-foreground mb-3">The Career Advisors provides:</h4>
                      <ul className="flex flex-wrap gap-x-6 gap-y-2">
                        {["IMAT preparation guidance", "University shortlisting", "Scholarship counseling", "Visa and documentation support", "Accommodation assistance"].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-foreground/80 text-sm font-medium"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* 4. CHINA */}
                {activeTab === "china" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-black text-foreground mb-3">China – Fully Funded & Partial Scholarships</h3>
                      <p className="text-foreground/80 font-medium leading-relaxed">China has emerged as one of the world’s largest education hubs for international students due to its massive government-funded scholarship system and globally growing universities.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-bold text-orange-500 mb-3">Scholarships Include:</h4>
                        <ul className="space-y-2">
                          {["Full tuition coverage", "Free hostel accommodation", "Monthly stipends", "Medical insurance", "Research grants for postgraduate students"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-orange-500 mb-3">Students are attracted to:</h4>
                        <ul className="space-y-2">
                          {["Modern smart campuses", "Advanced laboratories & research centers", "Affordable cost of living", "International student-friendly environment", "High investment in education and technology"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-2xl">
                       <h4 className="text-base font-bold text-foreground mb-3">Scholarships are offered through:</h4>
                       <div className="flex flex-wrap gap-2 mb-4">
                         {["Chinese Government Scholarships", "Provincial Scholarships", "University Scholarships", "Belt & Road Scholarship Programs", "Research Scholarships"].map((item, i) => (
                           <span key={i} className="px-3 py-1 bg-white dark:bg-black rounded-full text-xs font-bold border border-border text-foreground/80">{item}</span>
                         ))}
                       </div>
                       <p className="text-sm font-medium text-foreground/70">Students with strong academic records and proper documentation can significantly reduce their overall study expenses through these opportunities.</p>
                    </div>
                  </div>
                )}

                {/* 5. KAZAKHSTAN */}
                {activeTab === "kazakhstan" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-3xl font-black text-foreground mb-3">Kazakhstan – Scholarship & Tuition Support</h3>
                      <p className="text-foreground/80 font-medium leading-relaxed">Kazakhstan is becoming increasingly popular among international students because of its modern universities, affordable tuition structures, and growing scholarship opportunities.</p>
                    </div>
                    
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-lg font-bold text-orange-500 mb-3">Universities Offer:</h4>
                        <ul className="space-y-2">
                          {["Merit-based scholarships", "Tuition fee concessions", "International student support programs", "Academic performance grants"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-orange-500 mb-3">Students Prefer Kazakhstan for:</h4>
                        <ul className="space-y-2">
                          {["Modern infrastructure & Affordable education", "Internationally recognized universities", "English-medium programs", "Strong student safety environment", "Practical academic training"].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-foreground/80 text-sm font-medium"><CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" /> {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-orange-500/5 border border-orange-500/20 p-5 rounded-2xl">
                      <p className="text-sm font-medium text-foreground/80 mb-3">Kazakhstan is especially gaining popularity among students seeking <strong>Medical education, Engineering programs, Technical and management courses, and International exposure</strong> within affordable budgets.</p>
                      <h4 className="text-base font-bold text-foreground mb-2 mt-4">The Career Advisors guides students throughout:</h4>
                      <ul className="flex flex-wrap gap-x-4 gap-y-2">
                        {["Scholarship counseling", "University applications", "Admission procedures", "Documentation support", "Visa processing", "Student settlement assistance"].map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-foreground/80 text-xs font-bold uppercase tracking-wider"><div className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {item}</li>
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
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}
          className="mt-16 bg-gradient-to-br from-zinc-900 to-zinc-950 text-white rounded-[2rem] p-8 md:p-12 shadow-2xl border border-white/10"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-black mb-4 font-heading">Why Students Trust The Career Advisors for <span className="text-orange-500">Scholarships</span></h3>
              <p className="text-zinc-300 font-medium leading-relaxed mb-6">
                Many students miss international scholarship opportunities simply because they are unaware of available programs or proper procedures. Our goal is not only to secure admissions but also to help students access quality global education in the most affordable and practical way possible.
              </p>
              <p className="text-zinc-300 font-medium leading-relaxed">
                At The Career Advisors, we ensure students receive updated guidance regarding:
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
               {[
                 "Available scholarship categories", 
                 "Country-wise opportunities", 
                 "University-specific financial benefits", 
                 "Tuition reduction programs", 
                 "Merit-based admissions", 
                 "Scholarship documentation procedures"
               ].map((item, i) => (
                 <div key={i} className="flex items-start gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                   <GraduationCap className="w-5 h-5 text-orange-500 shrink-0" />
                   <span className="text-sm font-bold text-zinc-200 leading-tight">{item}</span>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}