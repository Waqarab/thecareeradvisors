"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Loader2, ArrowLeft, Save, Building2, Trophy, Stethoscope, GraduationCap, History, MapPin, Star, Info, ListChecks, Heart, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
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

  // 1-to-1 mapping with actual Firebase database fields
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    location: "",
    fees: "",
    established: "",
    image: "",
    featuredOrder: "",
    description: "",
    historicalBackground: "",
    hospitalFacilities: "",
    hostelFees: "",
    whyChoose: [] as string[],
    recognition: [] as string[],
    isHidden: true,
  });

  // Fetch the current data from Firebase
  useEffect(() => {
    async function fetchUniversity() {
      if (!id) return;
      if (id === "new") {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, "universities", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFormData((prev) => ({
            ...prev,
            ...data,
            // Ensure arrays exist even if empty in Firebase
            whyChoose: data.whyChoose || [],
            recognition: data.recognition || [],
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

  // Handlers for dynamic array fields (bullet points)
  const handleArrayChange = (field: "whyChoose" | "recognition", index: number, value: string) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: "whyChoose" | "recognition") => {
    setFormData({ ...formData, [field]: [...formData[field], ""] });
  };

  const removeArrayItem = (field: "whyChoose" | "recognition", index: number) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArray });
  };

  const handleSave = async (action: "draft" | "publish") => {
    if (!formData.name.trim()) {
      toast.error("University name is required!");
      return;
    }

    setIsSaving(true);
    
    // Clean up empty array strings before saving
    const cleanedData = {
      ...formData,
      whyChoose: formData.whyChoose.filter(item => item.trim() !== ""),
      recognition: formData.recognition.filter(item => item.trim() !== ""),
      isHidden: action === "draft",
    };
    
    try {
      if (id === "new") {
        const docRef = await addDoc(collection(db, "universities"), cleanedData);
        toast.success(action === "draft" ? "Draft saved successfully!" : "University published!");
        router.push(`/admin/colleges/${docRef.id}`);
      } else {
        const docRef = doc(db, "universities", id);
        await updateDoc(docRef, cleanedData);
        
        // FIRE THE REVALIDATOR TO UPDATE LIVE SITE INSTANTLY
        await fetch(`/api/revalidate?tag=universities`, { method: "POST" });
        sessionStorage.removeItem("tca_universities_cache");
        
        toast.success(action === "draft" ? "Draft updated successfully!" : "University published successfully!");
        setFormData(prev => ({ ...prev, isHidden: action === "draft" }));
      }
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
        
        <div className="flex flex-wrap gap-2">
          <Button type="button" onClick={() => router.push('/admin/colleges')} variant="outline" className="text-slate-600 bg-white shadow-sm">
            Cancel
          </Button>
          {id === "new" && (
            <Button type="button" onClick={() => handleSave("draft")} disabled={isSaving} variant="outline" className="text-slate-700 bg-slate-50 border-slate-300 shadow-sm">
              {isSaving && formData.isHidden ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save as Draft
            </Button>
          )}
          <Button type="button" onClick={() => handleSave("publish")} disabled={isSaving} className="bg-[#3A5F8B] text-white hover:bg-[#22354a] shadow-md px-6">
            {isSaving && (!formData.isHidden || id !== "new") ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : (id === "new" ? <Building2 className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />)}
            {id === "new" ? "Publish" : "Save All Details"}
          </Button>
        </div>
      </div>

      <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleSave(formData.isHidden ? "draft" : "publish"); }}>
        
        {/* SECTION 1: Top Bar Stats & Display */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Star className="w-5 h-5 text-amber-500" /> Basic Information & Display
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
            <div className="space-y-1 lg:col-span-2">
              <label className="text-sm font-semibold text-slate-700">University Name</label>
              <Input name="name" value={formData.name} onChange={handleInputChange} />
            </div>
            <div className="space-y-1 lg:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Country</label>
              <Input name="country" value={formData.country} onChange={handleInputChange} />
            </div>
            <div className="space-y-1 lg:col-span-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Location (City)</label>
              <Input name="location" value={formData.location} onChange={handleInputChange} />
            </div>
            <div className="space-y-1 lg:col-span-1">
              <label className="text-sm font-semibold text-slate-700">Established Year</label>
              <Input name="established" value={formData.established} onChange={handleInputChange} placeholder="e.g. 1930" />
            </div>
            <div className="space-y-1 lg:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Tuition Fee Text</label>
              <Input name="fees" value={formData.fees} onChange={handleInputChange} placeholder="e.g. 45,000 USD" />
            </div>
            <div className="space-y-1 lg:col-span-3 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-1"><ImageIcon className="w-4 h-4"/> Image URL</label>
              <Input name="image" value={formData.image} onChange={handleInputChange} placeholder="https://res.cloudinary.com/..." />
            </div>
          </div>
        </div>

        {/* SECTION 2: About & History */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Info className="w-5 h-5 text-blue-500" /> About & History
          </h2>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">About the University</label>
              <Textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                placeholder="General overview..." 
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">History</label>
              <Textarea 
                name="historicalBackground" 
                value={formData.historicalBackground} 
                onChange={handleInputChange} 
                placeholder="The university was established in..." 
                className="min-h-[120px]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Hospitals & Infrastructure */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5 text-indigo-500" /> Hospitals & Infrastructure
          </h2>
          <div className="space-y-6">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Hospitals</label>
              <Textarea 
                name="hospitalFacilities" 
                value={formData.hospitalFacilities} 
                onChange={handleInputChange} 
                placeholder="The Faculty of Medicine is associated with..." 
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Hostel (Infrastructure)</label>
              <Textarea 
                name="hostelFees" 
                value={formData.hostelFees} 
                onChange={handleInputChange} 
                placeholder="Separate hostel facilities are available..." 
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: Why Choose & Approvals (Dynamic Lists) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Why Choose */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <Heart className="w-5 h-5 text-rose-500" /> Why Choose {formData.name || "this University"}?
            </h2>
            <div className="space-y-3">
              {formData.whyChoose.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={item} 
                    onChange={(e) => handleArrayChange("whyChoose", index, e.target.value)}
                    placeholder={`Point ${index + 1}`}
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("whyChoose", index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addArrayItem("whyChoose")} className="w-full mt-2 border-dashed border-2">
                <Plus className="w-4 h-4 mr-2" /> Add Point
              </Button>
            </div>
          </div>

          {/* Approvals / Recognition */}
          <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
              <ListChecks className="w-5 h-5 text-emerald-500" /> Approvals / Recognition
            </h2>
            <div className="space-y-3">
              {formData.recognition.map((item, index) => (
                <div key={index} className="flex gap-2">
                  <Input 
                    value={item} 
                    onChange={(e) => handleArrayChange("recognition", index, e.target.value)}
                    placeholder="e.g. WHO Recognized"
                  />
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem("recognition", index)} className="text-red-500 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => addArrayItem("recognition")} className="w-full mt-2 border-dashed border-2">
                <Plus className="w-4 h-4 mr-2" /> Add Approval
              </Button>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
}