"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Info, CheckCircle2, MapPin, Sparkles, BookOpen, Building2, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import InquiryModal from "@/components/InquiryModal";
import Lottie from "lottie-react";

// --- HARDCODED DATA FOR INSTANT LOADING ---
const scholarshipsData = [
  {
    id: "bangladesh",
    country: "Bangladesh",
    title: "SAARC Quota Scholarship",
    description: "Bangladesh offers special tuition fee concessions and scholarship opportunities for students from SAARC countries, especially for MBBS programs in selected private medical colleges.",
    benefits: ["Reduced tuition fees", "Affordable MBBS education", "Lower overall study cost", "High-quality medical education", "NMC-recognized universities"],
    eligibility: ["NEET qualification mandatory", "Good academic performance", "Limited scholarship seats", "Subject to university approval", "Availability may vary every academic session"],
    support: ["University selection guidance", "SAARC quota application support", "Documentation assistance", "Admission processing", "Visa & travel support"]
  },
  {
    id: "egypt",
    country: "Egypt",
    title: "Undergraduate Scholarship Programs",
    description: "Egypt provides merit-based scholarship opportunities and tuition fee discounts for international students in selected public universities and programs.",
    benefits: ["Merit-based tuition discounts", "Partial tuition fee scholarships", "International student grants", "University-specific scholarship offers"],
    eligibility: ["Strong academic profile", "Good NEET/academic performance", "University selection criteria", "Limited scholarship quota"],
    support: ["Scholarship applications", "University selection", "Documentation support", "Admission procedures", "Student visa guidance"]
  },
  {
    id: "italy",
    country: "Italy",
    title: "IMAT Scholarship & European Pathway",
    description: "Through the IMAT, students apply for English-medium universities across Italy. Students receive globally recognized European degrees and access to scholarships that significantly reduce the overall cost of education.",
    benefits: ["European lifestyle and exposure", "Advanced research opportunities", "International career pathways", "English-medium medical programs", "Opportunities for residency in Europe"],
    eligibility: ["Public universities in Italy are comparatively affordable", "Regional scholarships can cover tuition and living expenses", "Students may receive hostel and meal benefits", "Degrees are recognized across Europe"],
    support: ["IMAT preparation guidance", "University shortlisting", "Scholarship counseling", "Visa and documentation support", "Accommodation assistance"]
  },
  {
    id: "china",
    country: "China",
    title: "Fully Funded & Partial Scholarships",
    description: "China has emerged as one of the world’s largest education hubs for international students due to its massive government-funded scholarship system.",
    benefits: ["Full tuition coverage", "Free hostel accommodation", "Monthly stipends", "Medical insurance", "Research grants for postgraduate students"],
    eligibility: ["Chinese Government Scholarships", "Provincial Scholarships", "University Scholarships", "Belt & Road Scholarship Programs", "Research Scholarships"],
    support: ["Scholarship applications", "SOP & documentation preparation", "University selection", "Admission processing", "Visa guidance"]
  },
  {
    id: "kazakhstan",
    country: "Kazakhstan",
    title: "Scholarship & Tuition Support Programs",
    description: "Kazakhstan is becoming increasingly popular among international students because of its modern universities, affordable tuition structures, and growing scholarship opportunities.",
    benefits: ["Merit-based scholarships", "Tuition fee concessions", "International student support programs", "Academic performance grants"],
    eligibility: ["Modern infrastructure & affordable education", "Internationally recognized universities", "English-medium programs", "Strong student safety environment", "Practical academic training"],
    support: ["Scholarship counseling", "University applications", "Admission procedures", "Documentation support", "Visa processing", "Student settlement assistance"]
  }
];

// --- METALLIC CARD THEMES ---
const metallicThemes = [
  { // 0: GOLD
    cardClasses: "border-[#BF953F] hover:border-[#B38728] shadow-[0_4px_20px_rgba(191,149,63,0.1)] hover:shadow-[0_8px_30px_rgba(191,149,63,0.25)] bg-gradient-to-br from-white to-[#FCF6BA]/10",
    iconBg: "bg-[#BF953F]/10",
    iconColor: "text-[#B38728]",
    tagClasses: "bg-[#BF953F]/10 border-[#BF953F]/30 text-[#B38728]"
  },
  { // 1: SILVER
    cardClasses: "border-[#A8A9AD] hover:border-[#8A8D91] shadow-[0_4px_20px_rgba(168,169,173,0.1)] hover:shadow-[0_8px_30px_rgba(168,169,173,0.25)] bg-gradient-to-br from-white to-[#F5F5F5]",
    iconBg: "bg-[#A8A9AD]/15",
    iconColor: "text-[#73767A]",
    tagClasses: "bg-[#A8A9AD]/10 border-[#A8A9AD]/30 text-[#5c5f63]"
  },
  { // 2: BRONZE / COPPER
    cardClasses: "border-[#CD7F32] hover:border-[#B87333] shadow-[0_4px_20px_rgba(205,127,50,0.1)] hover:shadow-[0_8px_30px_rgba(205,127,50,0.25)] bg-gradient-to-br from-white to-[#E3A869]/10",
    iconBg: "bg-[#CD7F32]/10",
    iconColor: "text-[#B87333]",
    tagClasses: "bg-[#CD7F32]/10 border-[#CD7F32]/30 text-[#A0522D]"
  }
];

export default function ScholarshipsPage() {
  const [showTutorial, setShowTutorial] = useState(false);
  const [lottieData, setLottieData] = useState<any>(null);

  // Fetch the Lottie Animation JSON for the top-right corner
  useEffect(() => {
    fetch("/scholarship.json")
      .then((res) => res.json())
      .then((data) => setLottieData(data))
      .catch((err) => console.error("Failed to load Lottie animation:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#F2F3F4] font-sans relative pb-20">
      
      {/* 1. HEADER SECTION */}
      <div className="pt-12 md:pt-16 pb-12 bg-white border-b border-[#AEC6CF]/40 shadow-sm relative overflow-hidden">
        
        {/* CORNER LOTTIE ANIMATION */}
        <div className="absolute top-10 right-4 md:right-12 lg:right-24 w-[150px] h-[150px] md:w-[250px] md:h-[250px] lg:w-[350px] lg:h-[350px] opacity-20 md:opacity-100 pointer-events-none z-0">
          {lottieData && (
            <Lottie animationData={lottieData} loop={true} />
          )}
        </div>

        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <Link href="/" className="inline-flex items-center text-[#3A5F8B] hover:text-[#D85C34] font-bold mb-8 transition-colors bg-white/50 backdrop-blur-sm px-3 py-1 rounded-lg">
            <ChevronLeft className="w-5 h-5 mr-1" /> Back to Home
          </Link>

          <div className="max-w-3xl">
            {/* Bold Static Title with Subtle Gradient */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-6 leading-[1.1]">
              Explore <br className="md:hidden" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22354a] to-[#3A5F8B]">
                Scholarships..
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-[#3A5F8B]/80 font-medium leading-relaxed mb-8 max-w-2xl bg-white/50 backdrop-blur-sm rounded-xl py-2">
              At The Career Advisors, we believe that talented students should never miss international education opportunities because of financial limitations. We actively guide students for scholarships across multiple countries.
            </p>

            {/* Passes "Scholarship Application" as the source to auto-tag in Firebase */}
            <InquiryModal source="Scholarship Application">
              <Button size="lg" className="bg-[#D85C34] hover:bg-[#b84c2a] text-white text-base md:text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all font-black tracking-wide">
                Apply For Scholarships Today
              </Button>
            </InquiryModal>
          </div>
        </div>
      </div>

      {/* 2. MAIN METALLIC SCHOLARSHIPS GRID */}
      <div className="container mx-auto px-4 md:px-8 max-w-7xl mt-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {scholarshipsData.map((item: any, idx: number) => {
            // Cycle through Gold (0), Silver (1), Bronze (2)
            const theme = metallicThemes[idx % 3]; 

            return (
              <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: idx * 0.1 }}
                key={item.id} 
                className={`rounded-[2rem] p-6 md:p-8 border-2 transition-all duration-500 flex flex-col cursor-default ${theme.cardClasses}`}
              >
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#AEC6CF]/30">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${theme.iconBg}`}>
                    <MapPin className={`w-7 h-7 ${theme.iconColor}`} />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-black tracking-tight">{item.country}</h2>
                    <p className={`${theme.iconColor} font-bold text-sm uppercase tracking-wider`}>{item.title}</p>
                  </div>
                </div>

                <p className="text-[#3A5F8B]/80 font-medium mb-8 leading-relaxed">
                  {item.description}
                </p>

                <div className="space-y-6 flex-grow">
                  <div>
                    <h4 className="text-black font-bold mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-[#D85C34]"/> Key Benefits</h4>
                    <ul className="space-y-2">
                      {item.benefits.slice(0, 3).map((benefit: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-[#3A5F8B] text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#6082B6] shrink-0 mt-0.5" /> {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-black font-bold mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-[#D85C34]"/> Eligibility & Facts</h4>
                    <ul className="space-y-2">
                      {item.eligibility.slice(0, 3).map((elig: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-[#3A5F8B] text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#6082B6] shrink-0 mt-0.5" /> {elig}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#AEC6CF]/30">
                  <h4 className="text-black font-bold mb-3 flex items-center gap-2"><Building2 className="w-4 h-4 text-[#D85C34]"/> The Career Advisors Support</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.support.slice(0, 4).map((sup: string, i: number) => (
                      <span key={i} className={`px-3 py-1.5 text-xs font-bold rounded-lg border ${theme.tagClasses}`}>
                        {sup}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. ACCESSIBILITY / TUTORIAL FLOATING BUTTON */}
      <button 
        onClick={() => setShowTutorial(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#22354a] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#3A5F8B] transition-colors z-40 group border-2 border-white"
        aria-label="How to use this page"
      >
        <Info className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {/* 4. TUTORIAL MODAL */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#1b2f45]/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setShowTutorial(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 rounded-3xl max-w-md w-full relative shadow-2xl border border-[#AEC6CF]"
            >
              <button onClick={() => setShowTutorial(false)} className="absolute top-4 right-4 text-[#3A5F8B]/50 hover:text-black transition-colors">
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-16 h-16 bg-[#D85C34]/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                <Info className="w-8 h-8 text-[#D85C34]" />
              </div>
              
              <h3 className="text-2xl font-black text-black mb-4 text-center">How to Navigate</h3>
              <p className="text-[#3A5F8B] font-medium leading-relaxed mb-6 text-center">
                Review the cards above to see scholarship opportunities by country. The cards are categorized by <span className="text-[#B38728] font-bold">Gold</span>, <span className="text-[#8A8D91] font-bold">Silver</span>, and <span className="text-[#CD7F32] font-bold">Bronze</span> tiers. Each card highlights the <strong>Key Benefits</strong>, <strong>Eligibility</strong>, and how <strong>The Career Advisors</strong> will support your application for that region.
              </p>
              
              <Button onClick={() => setShowTutorial(false)} className="w-full bg-[#3A5F8B] hover:bg-[#22354a] text-white font-bold py-6 rounded-xl">
                I Understand
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}