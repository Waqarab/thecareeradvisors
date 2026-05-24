"use client";

import { motion } from "framer-motion";
import { FileText, Download, Eye, ShieldAlert, BookOpen, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Define the Resource Type
type Resource = {
  id: string;
  title: string;
  description: string;
  category: "Guidelines" | "Scholarships" | "Admissions" | "General";
  type: "PDF" | "Link" | "Document";
  size?: string;
  url: string; // Cloudinary URLs go here
  downloadable: boolean;
};

// Mock Data
const resources: Resource[] = [
  {
    id: "1",
    title: "NMC Guidelines for FMGs",
    description: "Official rules and eligibility criteria for Foreign Medical Graduates.",
    category: "Guidelines",
    type: "PDF",
    size: "2.4 MB",
    url: "#", 
    downloadable: true,
  },
  /*
  {
    id: "2",
    title: "WHO Recognized Universities",
    description: "World Health Organization list of approved medical institutions.",
    category: "Guidelines",
    type: "PDF",
    size: "1.1 MB",
    url: "#",
    downloadable: true,
  },
  {
    id: "3",
    title: "Scholarship Application",
    description: "Guide and forms for securing merit-based scholarships.",
    category: "Scholarships",
    type: "Document",
    size: "800 KB",
    url: "#",
    downloadable: true,
  },
  {
    id: "4",
    title: "Visa Interview Checklist",
    description: "Checklist to ensure you have all required documents organized.",
    category: "Admissions",
    type: "PDF",
    size: "450 KB",
    url: "#",
    downloadable: true,
  },
  {
    id: "5",
    title: "Pre-Departure Briefing",
    description: "Essential rules and packing lists to review before your flight.",
    category: "General",
    type: "PDF",
    size: "3.2 MB",
    url: "#",
    downloadable: true,
  },
  {
    id: "6",
    title: "Terms & Conditions",
    description: "Legal guidelines and official terms of service for consultations.",
    category: "General",
    type: "Document",
    size: "150 KB",
    url: "#",
    downloadable: false,
  },
  */
];

// Modern UI Config for Categories
const categoryConfig = {
  Guidelines: { icon: ShieldAlert, color: "text-sky-600", bg: "bg-sky-100/50", border: "border-sky-200" },
  Scholarships: { icon: BookOpen, color: "text-amber-600", bg: "bg-amber-100/50", border: "border-amber-200" },
  Admissions: { icon: GraduationCap, color: "text-emerald-600", bg: "bg-emerald-100/50", border: "border-emerald-200" },
  General: { icon: FileText, color: "text-slate-600", bg: "bg-slate-200/50", border: "border-slate-200" },
};

export default function ResourcesPage() {
  return (
    // Replaced min-h-screen with relative height calculation so it fits tight to the window
    <div className="relative flex flex-col font-sans selection:bg-sky-200 pb-8 min-h-[calc(100vh-80px)]">
      
      {/* Soft Sprayed Sky Blue Background */}
      <div className="absolute inset-0 -z-10 bg-[#f4f9ff] overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[800px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200/40 via-sky-100/20 to-transparent blur-3xl opacity-80 pointer-events-none"></div>
      </div>

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col justify-start pt-12 sm:pt-20">
        
        {/* COMPACT HEADER SECTION */}
        <div className="text-center mb-6 sm:mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight text-balance mb-2"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            View Guidelines<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-500">  & other Documents</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto font-medium"
          >
            Access all necessary guidelines, policies, and scholarship applications in one place.
          </motion.p>
        </div>

        {/* ULTRA-COMPACT RESOURCES GRID (Ensures 6 fit above the fold) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
          {resources.map((resource, index) => {
            const config = categoryConfig[resource.category];
            const Icon = config.icon;

            return (
              <motion.div 
                key={resource.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-[0_4px_15px_-4px_rgba(14,165,233,0.1)] border border-white/60 hover:bg-white hover:shadow-[0_8px_25px_-5px_rgba(14,165,233,0.15)] hover:-translate-y-0.5 transition-all duration-300 flex flex-col"
              >
                {/* Top Row: Icon + Title inline to save space */}
                <div className="flex items-start gap-3 mb-2">
                  <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${config.bg} ${config.color} border border-white/50 shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest ${config.color} bg-white/80 shadow-sm`}>
                        {resource.category}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight group-hover:text-sky-600 transition-colors line-clamp-1" style={{ fontFamily: "var(--font-heading)" }}>
                      {resource.title}
                    </h3>
                  </div>
                </div>

                {/* Description - Clamped to 2 lines */}
                <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2 ml-13">
                  {resource.description}
                </p>

                {/* Bottom Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100/80 mt-auto ml-13">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                    <span className="bg-slate-100/80 px-1.5 py-0.5 rounded uppercase">{resource.type}</span>
                    {resource.size && <span>• {resource.size}</span>}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <a href={resource.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-lg border-sky-100 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-600 shadow-sm text-xs transition-colors">
                        <Eye className="w-3 h-3 sm:mr-1.5" />
                        <span className="hidden sm:inline">View</span>
                      </Button>
                    </a>
                    
                    {resource.downloadable && (
                      <a href={resource.url} download>
                        <Button size="sm" className="h-7 px-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white shadow-md shadow-sky-600/20 text-xs">
                          <Download className="w-3 h-3 sm:mr-1.5" />
                          <span className="hidden sm:inline">Save</span>
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
        
      </main>
    </div>
  );
}