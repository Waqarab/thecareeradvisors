"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users, Banknote, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import InquiryModal from "@/components/InquiryModal";
import Link from "next/link";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";

// TypeScript Interface for error-free data handling
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

export default function CountriesSection() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");

  // Fetch live universities from Firestore
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
        console.error("Error fetching universities", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUniversities();
  }, []);

  // Extract unique countries dynamically from the database
  const countries = ["All", ...Array.from(new Set(universities.map(u => u.country)))];

  // Filter based on selected pill, then SLICE to show only a maximum of 6 on the homepage
  const filteredUniversities = (
    activeFilter === "All" 
      ? universities 
      : universities.filter(uni => uni.country === activeFilter)
  ).slice(0, 6); 

  return (
    <section id="universities" className="py-24 bg-background border-t border-border/40 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block relative">
            <h2 className="text-3xl md:text-5xl font-bold font-heading text-foreground relative z-10 px-4">
              Top Universities We Guide You To
            </h2>
            <div className="absolute bottom-1 left-0 w-full h-4 bg-primary/20 -z-0 rounded-sm transform -rotate-1"></div>
          </div>
          <p className="mt-6 text-lg text-foreground/70 font-medium">
            Explore WHO & NMC approved institutions perfectly matched to your NEET score.
          </p>
        </div>

        {/* Dynamic Filter Pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setActiveFilter(country)}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-200 shadow-sm border active:scale-95 ${
                activeFilter === country 
                  ? "bg-primary text-primary-foreground border-primary" 
                  : "bg-card text-foreground/70 border-border/50 hover:border-primary/50 hover:text-primary"
              }`}
            >
              {country}
            </button>
          ))}
        </div>

        {/* Animated University Grid */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredUniversities.map((uni) => (
                <motion.div
                  key={uni.id} 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl transition-all group flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden bg-muted">
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
                    <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 text-white">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm font-medium drop-shadow-md">{uni.location}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold font-heading mb-4 text-foreground leading-tight group-hover:text-primary transition-colors">{uni.name}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
                      <div>
                        <p className="text-xs text-foreground/50 uppercase tracking-wider font-semibold mb-1">Avg Fees</p>
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-primary" />
                          <span className="font-bold text-sm">{uni.fees}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-foreground/50 uppercase tracking-wider font-semibold mb-1">Our Students</p>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-accent" />
                          <span className="font-bold text-sm">{uni.placed} Placed</span>
                        </div>
                      </div>
                    </div>
                    <InquiryModal>
                      <Button variant="outline" className="w-full border-primary/30 hover:bg-primary/5 text-primary font-bold group-hover:border-primary transition-colors cursor-pointer">
                        Know More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </InquiryModal>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Dynamic View All Button connecting to the Universities Page */}
        <div className="mt-16 text-center">
          <Link href="/universities">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full px-8 active:scale-95 transition-all">
              View All {universities.length} Universities <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}