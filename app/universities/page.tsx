"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Banknote, Users, Search, Loader2, Filter, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import InquiryModal from "@/components/InquiryModal";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

// TypeScript Interface
interface University {
  id: string;
  name: string;
  country: string;
  location: string;
  fees: string;
  placed: string;
  image: string;
  isHidden?: boolean;
}

// --- NEW PREMIUM BLACK HIGHLIGHT REVEAL ---
function DarkHighlightReveal({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center justify-center px-6 py-2 mt-2 md:mt-0 rounded-xl overflow-hidden shadow-xl">
      {/* Deep Black Background Block that sweeps in */}
      <motion.span
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-gray-950 rounded-xl"
      />
      {/* Bold Orange Text that fades in over the black block */}
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="relative z-10 block text-destructive font-heading font-black tracking-wide"
      >
        {text}
      </motion.span>
    </span>
  );
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCountry, setActiveCountry] = useState("All");

  // BULLETPROOF SCROLL-TO-TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch all universities
  useEffect(() => {
    async function fetchUniversities() {
      try {
        const querySnapshot = await getDocs(collection(db, "universities"));
        const data: University[] = [];
        querySnapshot.forEach((doc) => {
          const uni = { id: doc.id, ...doc.data() } as University;
          if (!uni.isHidden) data.push(uni);
        });
        setUniversities(data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUniversities();
  }, []);

  const countries = ["All", ...Array.from(new Set(universities.map(u => u.country)))];

  // Mega-Filter Logic
  const filteredUniversities = universities.filter(uni => {
    const matchesCountry = activeCountry === "All" || uni.country === activeCountry;
    const searchString = `${uni.name} ${uni.location} ${uni.country}`.toLowerCase();
    const matchesSearch = searchTerm === "" || searchString.includes(searchTerm.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pb-24 font-sans">
      
      {/* ULTRA-COMPACT HEADER */}
      <section className="bg-primary pt-10 pb-10 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          
          {/* Impressive Bold Font & Black Highlight Animation */}
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 font-heading tracking-tight flex flex-col md:flex-row items-center justify-center gap-3">
            Explore <DarkHighlightReveal text="Global Institutions" />
          </h1>
          <p className="text-sm md:text-base text-primary-foreground/80 font-medium mb-6 max-w-2xl mx-auto">
            Find the perfect medical college tailored to your clinical goals and budget.
          </p>

          {/* Optimized Search Bar */}
          <div className="relative max-w-xl mx-auto shadow-xl">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search by university, city, or country..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3.5 rounded-2xl bg-background text-foreground border-2 border-transparent outline-none focus:border-destructive focus:ring-4 focus:ring-destructive/20 text-sm font-bold transition-all placeholder:text-foreground/40 shadow-inner"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-8 mt-8">
        
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-8 border-b border-border/50 pb-6">
          <Filter className="w-5 h-5 text-foreground/50 mr-2 hidden md:block" />
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setActiveCountry(country)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all border active:scale-95 ${
                activeCountry === country 
                  ? "bg-primary text-primary-foreground border-primary shadow-md" 
                  : "bg-card text-foreground/70 border-border/50 hover:border-primary/50 hover:text-primary"
              }`}
            >
              {country}
            </button>
          ))}
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
        ) : filteredUniversities.length === 0 ? (
          <div className="text-center py-20 text-foreground/60">
            <h3 className="text-2xl font-bold font-heading mb-2">No Universities Found</h3>
            <p>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredUniversities.map((uni) => (
                <motion.div
                  key={uni.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all group flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden bg-muted">
                    <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-black/20 transition-colors"></div>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={uni.image} 
                      alt={uni.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                    <div className="absolute top-4 left-4 z-20">
                      <span className="bg-background/90 backdrop-blur text-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">{uni.country}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold font-heading mb-3 text-foreground leading-tight group-hover:text-primary transition-colors">{uni.name}</h3>
                    <p className="flex items-center gap-2 text-sm text-foreground/70 mb-5 font-medium">
                      <MapPin className="w-4 h-4 text-primary" /> {uni.location}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6 mt-auto bg-muted/40 p-4 rounded-xl border border-border/50">
                      <div>
                        <p className="text-[10px] text-foreground/50 uppercase tracking-wider font-bold mb-1">Avg Fees</p>
                        <p className="font-bold text-sm flex items-center gap-1.5"><Banknote className="w-4 h-4 text-primary" />{uni.fees}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-foreground/50 uppercase tracking-wider font-bold mb-1">Our Students</p>
                        <p className="font-bold text-sm flex items-center gap-1.5"><Users className="w-4 h-4 text-accent" />{uni.placed}</p>
                      </div>
                    </div>
                    
                    {/* DUAL ACTION BUTTONS */}
                    <div className="flex flex-col gap-3">
                      <Link href={`/universities/${uni.id}`} className="w-full">
                        <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/5 font-bold active:scale-95 transition-all">
                          <BookOpen className="w-4 h-4 mr-2" /> Explore University
                        </Button>
                      </Link>
                      
                      <InquiryModal>
                        <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 font-bold cursor-pointer active:scale-95 transition-all">
                          Get Admission Details <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </InquiryModal>
                    </div>

                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}