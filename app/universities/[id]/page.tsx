"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { 
  MapPin, Banknote, Calendar, CheckCircle2, ShieldAlert, 
  Building2, GraduationCap, ArrowLeft, Phone,
  FileText, Coffee, HeartPulse, Loader2, Landmark, HelpCircle
} from "lucide-react";

import { Button } from "@/components/ui/button";
import InquiryModal from "@/components/InquiryModal";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

// --- EXPANDED INTERFACE ---
interface UniversityData {
  name: string;
  country: string;
  location: string;
  fees: string;
  established?: string;
  image?: string; 
  description?: string; 
  courseDuration?: string;
  medium?: string;
  recognition?: string[]; 
  hostelFees?: string; 
  historicalBackground?: string; 
  hospitalFacilities?: string; 
  whyChoose?: string[]; 
}

export default function UniversityDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [university, setUniversity] = useState<UniversityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true; 

    async function fetchUniversityDetails() {
      try {
        setLoading(true);
        setError(null);
        
        const docRef = doc(db, "universities", id);
        const docSnap = await getDoc(docRef);

        if (isMounted) {
          if (docSnap.exists()) {
            setUniversity(docSnap.data() as UniversityData);
          } else {
            setError("No such university document found!");
            setUniversity(null);
          }
        }
      } catch (err) {
        console.error("Error fetching university details:", err);
        if (isMounted) setError("Failed to load university data. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchUniversityDetails();
    return () => { isMounted = false; };
  }, [id]);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-foreground/60 font-medium animate-pulse">Loading details...</p>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !university) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h2 className="text-3xl font-bold font-heading mb-2">University Not Found</h2>
        <p className="text-foreground/60 mb-6">{error || "The requested institution profile could not be loaded."}</p>
        <Link href="/universities">
          <Button className="bg-primary text-primary-foreground rounded-full active:scale-95 transition-transform">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
          </Button>
        </Link>
      </div>
    );
  }

  // --- SAFE FALLBACKS ---
  const duration = university.courseDuration || "6 Years (Including Internship)";
  const instructionMedium = university.medium || "100% English Medium";
  const recognitions = university.recognition?.length 
    ? university.recognition 
    : ["WHO Recognized", "NMC / MCI Approved", "Ministry of Education Approved"];
  const aboutText = university.description || `${university.name} is a premier institution offering world-class medical education.`;
  const hostelCost = university.hostelFees || "Standard Hostel Facilities Available";
  const hasValidImage = typeof university.image === 'string' && university.image.trim() !== "";

  return (
    <div className="min-h-screen bg-porcelain pb-24 font-sans">
      
      {/* HERO BANNER - Optimized for zero-lag mobile rendering */}
      <section className="relative h-[45vh] min-h-[350px] bg-[#0f172a] overflow-hidden flex items-end">
        <div className="absolute inset-0 z-0">
          {/* Replaced complex gradients with a highly performant flat overlay */}
          <div className="absolute inset-0 bg-black/60 z-10" />
            {hasValidImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={university.image} 
                alt={university.name || "University"} 
                fetchPriority="high"
                decoding="async"
                className="w-full h-full object-cover" // Removed scale-105 which causes repaint lag
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                <span className="text-white/20 font-bold tracking-widest uppercase">No Image Available</span>
              </div>
            )}
        </div>

        <div className="container mx-auto px-4 md:px-8 pb-10 relative z-20 text-white">
          {/* Removed backdrop-blur-md, used solid black with opacity and border */}
          <Link href="/universities" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 text-sm font-bold bg-black/40 border border-white/20 px-4 py-2 rounded-full active:scale-95 transition-transform">
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </Link>

          {/* Removed Framer Motion JS. Used native GPU-accelerated Tailwind CSS animations */}
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both">
            <span className="bg-destructive text-destructive-foreground px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3 inline-block">
              {university.country || "Global"}
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-heading leading-tight tracking-tight max-w-4xl text-white">
              {university.name}
            </h1>
            <p className="flex items-center gap-2 text-white/80 font-medium text-sm md:text-base mt-3">
              <MapPin className="w-4 h-4 text-destructive shrink-0" /> {university.location || "Location not specified"}
            </p>
          </div>
        </div>
      </section>

      {/* CORE PROFILE */}
      <section className="container mx-auto px-4 md:px-8 mt-10">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT 2 COLUMNS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Quick Summary Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary shrink-0"><Banknote className="w-5 h-5" /></div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider">Tuition</p>
                  <p className="font-bold text-sm text-foreground truncate">{university.fees || "Contact"}</p>
                </div>
              </div>
              
              <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent shrink-0"><Calendar className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider">Est.</p>
                  <p className="font-bold text-sm text-foreground">{university.established || "N/A"}</p>
                </div>
              </div>

              <div className="bg-card p-4 rounded-xl border border-border shadow-sm col-span-2 md:col-span-1 flex items-center gap-3">
                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center text-destructive shrink-0"><GraduationCap className="w-5 h-5" /></div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold text-foreground/50 tracking-wider">Medium</p>
                  <p className="font-bold text-sm text-foreground truncate">{instructionMedium.split(" ")[1] || instructionMedium}</p>
                </div>
              </div>
            </div>

            {/* About Institution */}
            <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-3">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">About the University</h2>
              <div className="w-12 h-1 bg-destructive rounded-full" />
              <p className="text-foreground/80 leading-relaxed font-medium text-sm md:text-base whitespace-pre-line">
                {aboutText}
              </p>
            </div>

            {/* Historical Background */}
            {university.historicalBackground && (
              <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-3">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-primary" /> History
                </h2>
                <div className="w-12 h-1 bg-primary rounded-full" />
                <p className="text-foreground/80 leading-relaxed font-medium text-sm md:text-base whitespace-pre-line">
                  {university.historicalBackground}
                </p>
              </div>
            )}

            {/* Hospital & Clinical Facilities */}
            {university.hospitalFacilities && (
              <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-3">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-destructive" /> Hospitals
                </h2>
                <div className="w-12 h-1 bg-destructive rounded-full" />
                <p className="text-foreground/80 leading-relaxed font-medium text-sm md:text-base whitespace-pre-line">
                  {university.hospitalFacilities}
                </p>
              </div>
            )}

            {/* Infrastructure */}
            <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm space-y-5">
              <h2 className="text-xl md:text-2xl font-bold font-heading text-foreground">Infrastructure</h2>
              <div className="w-12 h-1 bg-destructive rounded-full" />

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="flex gap-3 items-start">
                  <Calendar className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider text-foreground/50">Duration</h4>
                    <p className="font-bold text-foreground text-sm mt-0.5">{duration}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Building2 className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider text-foreground/50">Medium</h4>
                    <p className="font-bold text-foreground text-sm mt-0.5">{instructionMedium}</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <Coffee className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider text-foreground/50">Hostel</h4>
                    <p className="font-bold text-foreground text-sm mt-0.5">{hostelCost}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose This University */}
            {university.whyChoose && university.whyChoose.length > 0 && (
              <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-800 flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-slate-500" /> Why Choose {university.name}?
                </h2>
                <div className="w-12 h-1 bg-slate-400 rounded-full" />
                <ul className="space-y-3">
                  {university.whyChoose.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-slate-700 font-medium text-sm md:text-base">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          </div>

          {/* RIGHT 1 COLUMN: Conversions Box */}
          <div className="space-y-6 lg:sticky lg:top-24 pb-12">
            
            {/* Removed shadow-xl and colored shadows for pure flat styling */}
            <div className="bg-card p-6 md:p-8 rounded-2xl border-2 border-border shadow-sm space-y-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-destructive" />
              
              <div>
                <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Tuition Fee</p>
                <h3 className="text-2xl md:text-3xl font-black font-heading text-primary">{university.fees || "TBD"}</h3>
                <p className="text-xs text-foreground/60 font-medium mt-1">Official structured payments</p>
              </div>

              <div className="space-y-3 pt-2">
                <InquiryModal>
                  {/* Removed shadow-destructive/10 */}
                  <Button className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90 text-base font-bold py-6 rounded-xl active:scale-95 transition-transform">
                    Apply for Admission Now
                  </Button>
                </InquiryModal>
                
                <a href="tel:+916005152350" className="block w-full">
                  <Button variant="outline" className="w-full border-border text-primary font-bold py-6 rounded-xl active:scale-95 transition-transform bg-background">
                    <Phone className="w-4 h-4 mr-2" /> Call Expert
                  </Button>
                </a>
              </div>
            </div>

            {/* Global Legal Certifications List */}
            <div className="bg-card p-5 md:p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-bold font-heading text-sm uppercase tracking-wider text-foreground/60 flex items-center gap-2">
                <FileText className="w-4 h-4 text-destructive" /> Approvals
              </h4>
              <div className="space-y-3">
                {recognitions.map((rec, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm font-bold text-foreground/80">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center text-green-700 shrink-0">
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