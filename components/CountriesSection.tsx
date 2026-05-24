"use client";

import { useState, useEffect } from "react";
import { MapPin, Banknote, ArrowRight, Loader2, Image as ImageIcon, ShieldCheck, Calendar } from "lucide-react";
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
  image?: string; 
  isHidden?: boolean;
}

export default function CountriesSection() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  useEffect(() => {
    async function loadUniversities() {
      try {
        const cached = sessionStorage.getItem("tca_universities_cache");
        if (cached) {
          const parsedData = JSON.parse(cached) as University[];
          setUniversities(parsedData);
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
  }, []);

  const countries = ["All", ...Array.from(new Set(universities.map(u => u.country)))];
  const filteredUniversities = (activeFilter === "All" ? universities : universities.filter(uni => uni.country === activeFilter)).slice(0, 6); 

  return (
    <section id="universities" className="py-16 md:py-20 bg-[#F2F3F4] border-t border-[#AEC6CF]/30 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-black font-heading text-[#22354a]">
            Top Universities We Guide You To
          </h2>
          <p className="mt-4 text-lg text-[#3A5F8B]/80 font-medium">
            Explore WHO & NMC approved institutions perfectly matched to your NEET score.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setActiveFilter(country)}
              className={`px-5 md:px-6 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-bold transition-all duration-200 shadow-sm border active:scale-95 ${
                activeFilter === country 
                  ? "bg-[#6082B6] text-white border-[#6082B6]" 
                  : "bg-[#FFFFF0] text-[#3A5F8B] border-[#AEC6CF]/50 hover:border-[#6082B6] hover:text-[#6082B6]"
              }`}
            >
              {country}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-10 h-10 animate-spin text-[#6082B6]" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredUniversities.map((uni) => (
                <div
                  key={uni.id} 
                  className="bg-[#FFFFF0] rounded-2xl overflow-hidden border border-[#AEC6CF]/30 shadow-sm hover:shadow-xl transition-shadow group flex flex-col"
                >
                  <Link href={`/universities/${uni.id}`} className="relative h-56 overflow-hidden bg-[#e2e8f0] flex items-center justify-center block">
                    {/* OPTIMIZATION: Removed heavy background transitions */}
                    <div className="absolute inset-0 bg-[#1b2f45]/10 z-10"></div>
                    
                    {uni.image && typeof uni.image === 'string' && uni.image.trim() !== "" ? (
                      <img 
                        src={uni.image} 
                        alt={uni.name} 
                        loading="lazy"
                        /* OPTIMIZATION: Image scale hover ONLY on desktop (md:) to save mobile GPU */
                        className="w-full h-full object-cover md:group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-[#F2F3F4] text-[#AEC6CF] z-0">
                        <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs font-bold uppercase tracking-wider">No Image</span>
                      </div>
                    )}

                    {/* OPTIMIZATION: Removed GPU-heavy `backdrop-blur`. Using solid color. */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-[#FFFFF0] text-[#22354a] px-3 py-1 rounded-full text-xs font-bold shadow-sm">{uni.country}</span>
                    </div>

                    {/* OPTIMIZATION: Removed GPU-heavy `backdrop-blur`. Using solid color. */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-[#16a34a] text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1.5 border border-[#15803d]">
                        <ShieldCheck className="w-3.5 h-3.5" /> WHO Approved
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                      <MapPin className="w-4 h-4 text-[#FFFFF0]" />
                      <span className="text-sm font-semibold drop-shadow-lg">{uni.location}</span>
                    </div>
                  </Link>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <Link href={`/universities/${uni.id}`}>
                      <h3 className="text-xl font-bold font-heading mb-4 text-[#22354a] leading-tight hover:text-[#6082B6] transition-colors">{uni.name}</h3>
                    </Link>
                    
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
                          <span className="font-bold text-sm text-[#22354a]">{uni.established || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full">
                      <InquiryModal>
                        {/* OPTIMIZATION: Removed backdrop blur from the button */}
                        <Button variant="outline" size="sm" className="w-full h-10 border-[#E67E22]/30 bg-[#FFF5EC] hover:bg-[#FFE8D6] text-[#E67E22] font-bold hover:border-[#E67E22]/60 transition-colors cursor-pointer text-sm shadow-sm">
                          Check Eligibility & Know More
                        </Button>
                      </InquiryModal>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/universities">
            <Button size="lg" className="bg-[#3A5F8B] text-white hover:bg-[#2F4A70] rounded-full px-8 active:scale-95 transition-all">
              View All {universities.length} Universities <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}