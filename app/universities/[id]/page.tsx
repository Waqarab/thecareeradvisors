"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, Banknote, Calendar, CheckCircle2, ShieldAlert, 
  Building2, GraduationCap, ArrowLeft, Phone,
  FileText, Coffee, HeartPulse, Loader2, Landmark, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import InquiryModal from "@/components/InquiryModal";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

// 1. Expanded Interface to support new bulk data fields
interface UniversityData {
  name: string;
  country: string;
  location: string;
  fees: string;
  established?: string;
  image: string;
  description?: string; // Used for "About the University"
  courseDuration?: string;
  medium?: string;
  recognition?: string[]; // Used for "Rankings & Recognition"
  hostelFees?: string; // Used for "Hostel & Mess"
  historicalBackground?: string; // NEW
  hospitalFacilities?: string; // NEW
  whyChoose?: string[]; // NEW
}

export default function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [university, setUniversity] = useState<UniversityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchUniversityDetails() {
      try {
        const docRef = doc(db, "universities", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUniversity(docSnap.data() as UniversityData);
        } else {
          console.error("No such university document found!");
        }
      } catch (error) {
        console.error("Error fetching university details:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUniversityDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!university) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-3xl font-bold font-heading mb-2">University Not Found</h2>
        <p className="text-foreground/60 mb-6">The requested institution profile could not be loaded or doesn't exist.</p>
        <Link href="/universities">
          <Button className="bg-primary text-primary-foreground rounded-full">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  const duration = university.courseDuration || "6 Years (Including Internship)";
  const instructionMedium = university.medium || "100% English Medium";
  const recognitions = university.recognition && university.recognition.length > 0 
    ? university.recognition 
    : ["WHO Recognized", "NMC / MCI Approved", "Ministry of Education Approved"];
  const aboutText = university.description || `${university.name} is a premier institution offering world-class medical education.`;
  const hostelCost = university.hostelFees || "Standard Hostel Facilities Available";

  return (
    <div className="min-h-screen bg-porcelain pb-24 font-sans">
      
      {/* HERO BANNER */}
      <section className="relative h-[45vh] min-h-[350px] bg-gray-950 overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent z-10" />
            {university?.image && university.image.trim() !== "" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={university.image} 
                alt={university.name || "University"} 
                className="w-full h-full object-cover opacity-60 scale-105"
              />
            ) : (
              <div className="w-full h-full bg-[#1b2f45] opacity-80 flex items-center justify-center">
                <span className="text-white/20 font-bold tracking-widest uppercase">No Image Available</span>
              </div>
            )}
        </div>

        <div className="container mx-auto px-4 md:px-8 pb-10 relative z-20 text-white">
          <Link href="/universities" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 text-sm font-bold bg-white/10 backdrop-blur-md px-4 py-2 rounded-full active:scale-95 transition-all shadow-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-destructive text-destructive-foreground px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 inline-block shadow-md">
              {university.country}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-heading leading-tight tracking-tight max-w-4xl text-ivory">
              {university.name}
            </h1>
            <p className="flex items-center gap-2 text-white/80 font-medium text-sm md:text-base mt-3">
              <MapPin className="w-4 h-4 text-destructive" /> {university.location}
            </p>
          </motion.div>
        </div>
      </section>

      {/* CORE PROFILE INTERACTIVE BARS */}
      <section className="container mx-auto px-4 md:px-8 mt-12">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT 2 COLUMNS: Main Educational Data */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-card p-5 rounded-2xl border border-border/40 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0"><Banknote className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-wider">Tuition Fee</p>
                  <p className="font-bold text-sm text-foreground">{university.fees}</p>
                </div>
              </div>
              
              <div className="bg-card p-5 rounded-2xl border border-border/40 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent shrink-0"><Calendar className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-wider">Established</p>
                  <p className="font-bold text-sm text-foreground">{university.established || "N/A"}</p>
                </div>
              </div>

              <div className="bg-card p-5 rounded-2xl border border-border/40 shadow-sm col-span-2 md:col-span-1 flex items-center gap-4">
                <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center text-destructive shrink-0"><GraduationCap className="w-6 h-6" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-foreground/40 tracking-wider">Instruction</p>
                  <p className="font-bold text-sm text-foreground truncate">{instructionMedium.split(" ")[1] || instructionMedium}</p>
                </div>
              </div>
            </div>

            {/* About Institution Card */}
            <div className="bg-card p-8 rounded-3xl border border-border/40 shadow-sm space-y-4">
              <h2 className="text-2xl font-bold font-heading text-foreground">About the University</h2>
              <div className="w-16 h-1 bg-destructive rounded-full" />
              <p className="text-foreground/80 leading-relaxed font-medium pt-2 text-base whitespace-pre-line">
                {aboutText}
              </p>
            </div>

            {/* Historical Background Card (Conditionally Rendered) */}
            {university.historicalBackground && (
              <div className="bg-card p-8 rounded-3xl border border-border/40 shadow-sm space-y-4">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <Landmark className="w-6 h-6 text-primary" /> Historical Background
                </h2>
                <div className="w-16 h-1 bg-primary rounded-full" />
                <p className="text-foreground/80 leading-relaxed font-medium pt-2 text-base whitespace-pre-line">
                  {university.historicalBackground}
                </p>
              </div>
            )}

            {/* Hospital & Clinical Facilities (Conditionally Rendered) */}
            {university.hospitalFacilities && (
              <div className="bg-card p-8 rounded-3xl border border-border/40 shadow-sm space-y-4">
                <h2 className="text-2xl font-bold font-heading text-foreground flex items-center gap-3">
                  <HeartPulse className="w-6 h-6 text-destructive" /> Hospital & Clinical Facilities
                </h2>
                <div className="w-16 h-1 bg-destructive rounded-full" />
                <p className="text-foreground/80 leading-relaxed font-medium pt-2 text-base whitespace-pre-line">
                  {university.hospitalFacilities}
                </p>
              </div>
            )}

            {/* Complete Specifications Grid */}
            <div className="bg-card p-8 rounded-3xl border border-border/40 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold font-heading text-foreground">Infrastructure & Essentials</h2>
              <div className="w-16 h-1 bg-destructive rounded-full" />

              <div className="grid sm:grid-cols-2 gap-6 pt-2">
                <div className="flex gap-4 items-start">
                  <Calendar className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-foreground/50">Course Duration</h4>
                    <p className="font-bold text-foreground mt-0.5">{duration}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Building2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-foreground/50">Medium of Instruction</h4>
                    <p className="font-bold text-foreground mt-0.5">{instructionMedium}</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <Coffee className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-foreground text-sm uppercase tracking-wider text-foreground/50">Hostel & Mess</h4>
                    <p className="font-bold text-foreground mt-0.5">{hostelCost}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose This University (Conditionally Rendered) */}
            {university.whyChoose && university.whyChoose.length > 0 && (
              <div className="bg-[#f0f4f8] p-8 rounded-3xl border border-[#6082B6]/30 shadow-sm space-y-6">
                <h2 className="text-2xl font-bold font-heading text-[#22354a] flex items-center gap-3">
                  <HelpCircle className="w-6 h-6 text-[#6082B6]" /> Why Choose {university.name}?
                </h2>
                <div className="w-16 h-1 bg-[#6082B6] rounded-full" />
                <ul className="space-y-3 pt-2">
                  {university.whyChoose.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-[#6082B6]/20 rounded-full flex items-center justify-center text-[#6082B6] shrink-0 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-[#22354a]/80 font-medium">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* RIGHT 1 COLUMN: Conversions Box & Approvals */}
          <div className="space-y-6 sticky top-28">
            
            {/* The Direct Action Conversion Box */}
            <div className="bg-card p-8 rounded-3xl border border-border/40 shadow-xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-destructive" />
              
              <div>
                <p className="text-xs font-bold text-foreground/40 uppercase tracking-wider mb-1">Approximate Tuition Fee</p>
                <h3 className="text-3xl font-black font-heading text-primary">{university.fees}</h3>
                <p className="text-xs text-foreground/50 font-medium mt-1">Direct official fee structured payments</p>
              </div>

              <div className="space-y-3 pt-2">
                <InquiryModal>
                  <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 text-base font-bold py-6 rounded-xl active:scale-95 transition-transform shadow-md shadow-destructive/10 cursor-pointer">
                    Apply for Admission Now
                  </Button>
                </InquiryModal>
                
                <a href="tel:+916005152350" className="block w-full">
                  <Button variant="outline" className="w-full border-primary/30 text-primary font-bold py-6 rounded-xl active:scale-95 transition-transform bg-background">
                    <Phone className="w-4 h-4 mr-2" /> Call Academic Expert
                  </Button>
                </a>
              </div>
            </div>

            {/* Global Legal Certifications List */}
            <div className="bg-card p-6 rounded-2xl border border-border/40 shadow-sm space-y-4">
              <h4 className="font-bold font-heading text-sm uppercase tracking-wider text-foreground/60 flex items-center gap-2">
                <FileText className="w-4 h-4 text-destructive" /> Rankings & Recognition
              </h4>
              <div className="space-y-2.5">
                {recognitions.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm font-bold text-foreground/80">
                    <div className="w-5 h-5 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 shrink-0 mt-0.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}