"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Banknote, Loader2, Image as ImageIcon, Search, ShieldCheck, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import InquiryModal from "@/components/InquiryModal";

interface University {
  id: string;
  name: string;
  country: string;
  location: string;
  fees: string;
  established?: string;
  image: string;
  isHidden?: boolean;
}

interface UniversitiesClientProps {
  initialUniversities?: University[];
}

export default function UniversitiesClient({ initialUniversities = [] }: UniversitiesClientProps) {
  const [universities, setUniversities] = useState<University[]>(initialUniversities);
  const [loading, setLoading] = useState(initialUniversities.length === 0);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadUniversities() {
      if (initialUniversities.length > 0) {
        setUniversities(initialUniversities.filter(u => !u.isHidden));
        setLoading(false);
        return;
      }

      try {
        const cached = sessionStorage.getItem("tca_universities_cache");
        if (cached) {
          const parsedData = JSON.parse(cached) as University[];
          setUniversities(parsedData.filter(u => !u.isHidden));
          setLoading(false);
          return; 
        }

        const res = await fetch("/api/universities");
        const data = await res.json();
        
        setUniversities(data);
        sessionStorage.setItem("tca_universities_cache", JSON.stringify(data));
      } catch (error) {
        console.error("Error fetching universities", error);
      } finally {
        setLoading(false);
      }
    }
    loadUniversities();
  }, [initialUniversities]);

  const countries = ["All", ...Array.from(new Set(universities.map(u => u.country)))];

  const filteredUniversities = universities.filter(uni => {
    const matchesCountry = activeFilter === "All" || uni.country === activeFilter;
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          uni.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F2F3F4] pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-heading text-[#22354a] mb-6 tracking-tight">
            Explore Global <span className="text-[#6082B6] font-serif italic font-normal">Universities</span>
          </h1>
          <p className="text-lg text-[#3A5F8B]/80 font-medium">
            Discover WHO and NMC approved medical institutions worldwide. Compare fees, locations, and track records.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-[#FFFFF0] p-4 md:p-6 rounded-3xl shadow-sm border border-[#AEC6CF]/30">
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#AEC6CF]" />
            <input 
              type="text" 
              placeholder="Search university or location..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#AEC6CF]/50 bg-[#F2F3F4] focus:outline-none focus:ring-2 focus:ring-[#6082B6]/50 transition-all font-medium text-[#22354a]"
            />
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {countries.map((country) => (
              <button
                key={country}
                onClick={() => setActiveFilter(country)}
                className={`px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all duration-200 active:scale-95 ${
                  activeFilter === country 
                    ? "bg-[#3A5F8B] text-white" 
                    : "bg-[#F2F3F4] text-[#3A5F8B] border border-[#AEC6CF]/30 hover:bg-[#AEC6CF]/20"
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-12 h-12 animate-spin text-[#6082B6]" /></div>
        ) : filteredUniversities.length === 0 ? (
          <div className="text-center py-20 text-[#3A5F8B]/60 font-medium text-lg">No universities found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredUniversities.map((uni, idx) => (
                <motion.div
                  key={uni.id} 
                  initial={{ opacity: 0, scale: 0.8, y: 50 }} 
                  whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ type: "spring", stiffness: 120, damping: 14, delay: (idx % 6) * 0.1 }}
                  style={{ willChange: "transform, opacity" }}
                  className="bg-[#FFFFF0] rounded-2xl overflow-hidden border border-[#AEC6CF]/30 shadow-sm hover:shadow-xl transition-all group flex flex-col"
                >
                  <Link href={`/universities/${uni.id}`} className="relative h-56 overflow-hidden bg-[#e2e8f0] flex items-center justify-center block">
                    <div className="absolute inset-0 bg-[#1b2f45]/20 z-10 group-hover:bg-transparent transition-colors"></div>
                    
                    {uni.image && uni.image.trim() !== "" ? (
                      <img 
                        src={uni.image} 
                        alt={uni.name} 
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F2F3F4] text-[#AEC6CF] z-0">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-wider">No Image</span>
                      </div>
                    )}

                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-[#FFFFF0]/90 backdrop-blur text-[#22354a] px-3 py-1 rounded-full text-xs font-bold shadow-sm">{uni.country}</span>
                    </div>

                    {/* Right Tag: WHO Approved */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-green-600/90 backdrop-blur text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-green-400/30">
                        <ShieldCheck className="w-3.5 h-3.5" /> WHO Approved
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                      <MapPin className="w-4 h-4 text-[#AEC6CF]" />
                      <span className="text-sm font-medium drop-shadow-md">{uni.location}</span>
                    </div>
                  </Link>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <Link href={`/universities/${uni.id}`}>
                      <h3 className="text-xl font-bold font-heading mb-4 text-[#22354a] leading-tight group-hover:text-[#6082B6] transition-colors">{uni.name}</h3>
                    </Link>
                    
                    {/* INFO GRID: Average Fees & Established Date */}
                    <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                      <div>
                        <p className="text-xs text-[#3A5F8B]/60 uppercase tracking-wider font-semibold mb-1">Avg Fees</p>
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-[#D85C34]" />
                          <span className="font-bold text-sm text-[#22354a]">{uni.fees}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-[#3A5F8B]/60 uppercase tracking-wider font-semibold mb-1">Established</p>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-[#6082B6]" />
                          <span className="font-bold text-sm text-[#22354a] truncate" title={uni.established || "N/A"}>
                            {uni.established || "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* BUTTONS: Explore & Inquiry */}
                    <div className="w-full mt-auto space-y-3">
                      <Link href={`/universities/${uni.id}`} className="block w-full">
                        <Button className="w-full bg-[#3A5F8B] hover:bg-[#22354a] text-white font-bold transition-colors shadow-sm h-10">
                          Explore University
                        </Button>
                      </Link>
                      
                      <InquiryModal>
                        <Button variant="outline" className="w-full border-[#6082B6]/30 hover:bg-[#6082B6]/10 text-[#6082B6] font-bold group-hover:border-[#6082B6] transition-colors cursor-pointer h-10">
                          Check Eligibility & Know More
                        </Button>
                      </InquiryModal>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

      </div>
    </div>
  );
}