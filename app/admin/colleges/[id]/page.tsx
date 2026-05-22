"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Loader2, ArrowLeft, Save, Building2, Trophy, Stethoscope, GraduationCap, History, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";

export default function UniversityDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // We group the data into logical sections for the UI
  const [formData, setFormData] = useState({
    // Basic Info (Auto-fetched)
    name: "",
    country: "",
    location: "",
    fees: "",
    // Deep Details (New Fields)
    history: "",
    rankingGlobal: "",
    rankingNational: "",
    rankingQS: "",
    facilities: "",
    hospitals: "",
    infrastructure: "",
    eligibility: "",
  });

  // Fetch the current data from Firebase
  useEffect(() => {
    async function fetchUniversity() {
      if (!id) return;
      try {
        const docRef = doc(db, "universities", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData((prev) => ({
            ...prev,
            ...data, // Merges existing basic data and any existing deep data
          }));
        } else {
          toast.error("University not found!");
          router.push("/admin/colleges");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error loading university data");
      } finally {
        setLoading(false);
      }
    }
    fetchUniversity();
  }, [id, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const docRef = doc(db, "universities", id);
      await updateDoc(docRef, formData);
      
      // FIRE THE REVALIDATOR TO UPDATE LIVE SITE INSTANTLY
      const secret = process.env.NEXT_PUBLIC_REVALIDATION_TOKEN;
      await fetch(`/api/revalidate?tag=universities&secret=${secret}`, { method: "POST" });
      sessionStorage.removeItem("tca_universities_cache");
      
      toast.success("University details updated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update details");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-slate-400" /></div>;
  }

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto w-full pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <Link href="/admin/colleges" className="text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-1 mb-2 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Database
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{formData.name || "Edit University"}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> {formData.location}, {formData.country}
          </p>
        </div>
        
        <Button onClick={handleSave} disabled={isSaving} className="bg-emerald-600 text-white hover:bg-emerald-700 shadow-md px-6">
          {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          {isSaving ? "Saving..." : "Save All Details"}
        </Button>
      </div>

      <form className="space-y-8" onSubmit={handleSave}>
        
        {/* SECTION 1: Rankings */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Trophy className="w-5 h-5 text-amber-500" /> Rankings & Reputation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">World Ranking</label>
              <Input name="rankingGlobal" value={formData.rankingGlobal || ""} onChange={handleInputChange} placeholder="e.g. Top 500" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">National Ranking</label>
              <Input name="rankingNational" value={formData.rankingNational || ""} onChange={handleInputChange} placeholder="e.g. 5th in Russia" />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">QS / Times Ranking</label>
              <Input name="rankingQS" value={formData.rankingQS || ""} onChange={handleInputChange} placeholder="e.g. 450 (QS 2024)" />
            </div>
          </div>
        </div>

        {/* SECTION 2: History & Legacy */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-blue-500" /> University History & Legacy
          </h2>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">About the University</label>
            <Textarea 
              name="history" 
              value={formData.history || ""} 
              onChange={handleInputChange} 
              placeholder="Enter the history, establishment year, and overall legacy of the university..." 
              className="min-h-[120px] resize-y"
            />
          </div>
        </div>

        {/* SECTION 3: Medical & Campus Facilities */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Stethoscope className="w-5 h-5 text-rose-500" /> Medical Facilities & Infrastructure
          </h2>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Associated Teaching Hospitals</label>
              <Textarea 
                name="hospitals" 
                value={formData.hospitals || ""} 
                onChange={handleInputChange} 
                placeholder="Details about clinical rotations, bed capacity, and hospital names..." 
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Campus Medical Facilities (Simulation Labs, etc.)</label>
              <Textarea 
                name="facilities" 
                value={formData.facilities || ""} 
                onChange={handleInputChange} 
                placeholder="Details about anatomy labs, simulation centers, research wings..." 
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" /> General Infrastructure (Hostels, Library, Sports)
              </label>
              <Textarea 
                name="infrastructure" 
                value={formData.infrastructure || ""} 
                onChange={handleInputChange} 
                placeholder="Details regarding student accommodation, library size, and sports facilities..." 
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Eligibility */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <GraduationCap className="w-5 h-5 text-indigo-500" /> Admission & Eligibility Criteria
          </h2>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700">Detailed Eligibility Rules</label>
            <Textarea 
              name="eligibility" 
              value={formData.eligibility || ""} 
              onChange={handleInputChange} 
              placeholder="e.g. 50% in PCB, NEET Qualification mandatory, Age limit details..." 
              className="min-h-[120px]"
            />
          </div>
        </div>

      </form>
    </div>
  );
}