"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; 

interface College {
  id: string;
  name: string;
  country: string;
  location: string;
  fees: string;
  placed: string;
  image: string;
  isHidden: boolean;
}

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", country: "", location: "", fees: "", placed: "", image: "", isHidden: false });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // --- TEMPORARY BULK UPLOAD SCRIPT ---
  const [isBulkUploading, setIsBulkUploading] = useState(false);

  const BULK_UNIVERSITIES = [
    // BANGLADESH
    { name: "Bangladesh Medical College", country: "Bangladesh", location: "Dhaka", fees: "$49,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Bangladesh Medical College (Women's)", country: "Bangladesh", location: "Uttara, Dhaka", fees: "$47,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Kumudini Women's Medical College", country: "Bangladesh", location: "Tangail", fees: "$45,300 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "East West Medical College", country: "Bangladesh", location: "Dhaka", fees: "$45,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Anwer Khan Modern Medical College", country: "Bangladesh", location: "Dhaka", fees: "$45,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Shahabuddin Medical College", country: "Bangladesh", location: "Dhaka", fees: "$45,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "International Medical College", country: "Bangladesh", location: "Gazipur", fees: "$44,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Ad-din Women's Medical College", country: "Bangladesh", location: "Dhaka", fees: "$43,500 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Prime Medical College", country: "Bangladesh", location: "Rangpur", fees: "$42,500 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Tairunnessa Memorial Medical College", country: "Bangladesh", location: "Gazipur", fees: "$42,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "IAHS (Institute of Applied Health Sciences)", country: "Bangladesh", location: "Chittagong", fees: "$42,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Diabetic Association Medical College", country: "Bangladesh", location: "Faridpur", fees: "$42,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Popular Medical College", country: "Bangladesh", location: "Dhaka", fees: "$42,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Jahurul Islam Medical College", country: "Bangladesh", location: "Kishoreganj", fees: "$42,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Z.H. Sikder Women's Medical College", country: "Bangladesh", location: "Dhaka", fees: "$42,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Central Medical College", country: "Bangladesh", location: "Comilla", fees: "$41,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Barind Medical College", country: "Bangladesh", location: "Rajshahi", fees: "$40,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "City Medical College", country: "Bangladesh", location: "Gazipur", fees: "$40,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Brahmanbaria Medical College", country: "Bangladesh", location: "Ghatura", fees: "$38,000 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Ad-din Mumin Medical College", country: "Bangladesh", location: "Jessore", fees: "$35,500 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Ad-din Akij Medical College", country: "Bangladesh", location: "Khulna", fees: "$33,500 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Ad-din Sakina Women's Medical College", country: "Bangladesh", location: "Jessore", fees: "$33,500 (Total)", placed: "TBA", image: "", isHidden: true },
    { name: "Dhaka National Medical College", country: "Bangladesh", location: "Dhaka", fees: "$30,000 + $300/mo", placed: "TBA", image: "", isHidden: true },

    // EGYPT
    { name: "Cairo University (Kasr Al-Ainy)", country: "Egypt", location: "Cairo", fees: "$8,000 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Ain Shams University", country: "Egypt", location: "Cairo", fees: "$8,000 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Alexandria University", country: "Egypt", location: "Alexandria", fees: "$8,000 / Year", placed: "TBA", image: "", isHidden: true },

    // UZBEKISTAN
    { name: "Samarkand State Medical University", country: "Uzbekistan", location: "Samarkand", fees: "$3,850 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Tashkent State Dental / Medical Univ.", country: "Uzbekistan", location: "Tashkent", fees: "$3,500 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Tashkent Pharmaceutical Institute", country: "Uzbekistan", location: "Tashkent", fees: "$3,500 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Andijan State Medical Institute", country: "Uzbekistan", location: "Andijan", fees: "$3,500 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Namangan State University", country: "Uzbekistan", location: "Namangan", fees: "$3,390 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Bukhara State Medical Institute", country: "Uzbekistan", location: "Bukhara", fees: "$3,200 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Gulistan State University", country: "Uzbekistan", location: "Gulistan", fees: "$2,500 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Angren State University", country: "Uzbekistan", location: "Angren", fees: "$2,500 / Year", placed: "TBA", image: "", isHidden: true },

    // KYRGYZSTAN
    { name: "International School of Medicine (IUK ISM)", country: "Kyrgyzstan", location: "Bishkek", fees: "$5,000 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Osh State University", country: "Kyrgyzstan", location: "Osh", fees: "$4,000 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Jalal-Abad International University", country: "Kyrgyzstan", location: "Jalal-Abad", fees: "$3,600 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Asian International University", country: "Kyrgyzstan", location: "Kyrgyzstan", fees: "$3,500 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Kyrgyz-Uzbek International Medical Univ.", country: "Kyrgyzstan", location: "Osh", fees: "$3,000 / Year", placed: "TBA", image: "", isHidden: true },

    // KAZAKHSTAN
    { name: "Kazakh National Medical University", country: "Kazakhstan", location: "Almaty", fees: "₹5.20 Lakhs / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Al-Farabi Kazakh National University", country: "Kazakhstan", location: "Almaty", fees: "₹4.50 Lakhs / Year", placed: "TBA", image: "", isHidden: true },
    { name: "South Kazakhstan Medical Academy", country: "Kazakhstan", location: "Shymkent", fees: "$4,500 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "West Kazakhstan Marat Ospanov Univ.", country: "Kazakhstan", location: "Aktobe", fees: "$4,000 / Year", placed: "TBA", image: "", isHidden: true },

    // TAJIKISTAN
    { name: "Avicenna Tajik State Medical University", country: "Tajikistan", location: "Dushanbe", fees: "$4,000 / Year", placed: "TBA", image: "", isHidden: true },
    { name: "Khatlon State Medical University", country: "Tajikistan", location: "Danghara", fees: "$4,000 / Year", placed: "TBA", image: "", isHidden: true },

    // RUSSIA
    { name: "Volgograd State Medical University", country: "Russia", location: "Volgograd", fees: "505,000 Rubles / Yr", placed: "TBA", image: "", isHidden: true },
    { name: "Kuban State Medical University", country: "Russia", location: "Krasnodar", fees: "498,000 Rubles / Yr", placed: "TBA", image: "", isHidden: true },
    { name: "Bashkir State Medical University", country: "Russia", location: "Ufa", fees: "405,000 Rubles / Yr", placed: "TBA", image: "", isHidden: true },
    { name: "Omsk State Medical University", country: "Russia", location: "Omsk", fees: "370,000 Rubles / Yr", placed: "TBA", image: "", isHidden: true },
    { name: "Yaroslavl State Medical University", country: "Russia", location: "Yaroslavl", fees: "350,000 Rubles / Yr", placed: "TBA", image: "", isHidden: true },
    { name: "Kemerovo State Medical University", country: "Russia", location: "Kemerovo", fees: "335,000 Rubles / Yr", placed: "TBA", image: "", isHidden: true },
    { name: "Chechen State Medical University", country: "Russia", location: "Grozny", fees: "335,000 Rubles / Yr", placed: "TBA", image: "", isHidden: true },
    { name: "Kabardino-Balkarian State University", country: "Russia", location: "Nalchik", fees: "334,000 Rubles / Yr", placed: "TBA", image: "", isHidden: true },
    { name: "Orel State Medical University", country: "Russia", location: "Orel", fees: "325,000 Rubles / Yr", placed: "TBA", image: "", isHidden: true },
    { name: "North Ossetian State Medical Academy", country: "Russia", location: "Vladikavkaz", fees: "310,000 Rubles / Yr", placed: "TBA", image: "", isHidden: true },
    { name: "Sevastopol State Medical University", country: "Russia", location: "Sevastopol", fees: "294,000 Rubles / Yr", placed: "TBA", image: "", isHidden: true },
  ];

  const triggerBulkUpload = async () => {
    if (!window.confirm(`Are you sure you want to upload ${BULK_UNIVERSITIES.length} universities to Firestore?`)) return;
    
    setIsBulkUploading(true);
    let successCount = 0;

    try {
      for (const uni of BULK_UNIVERSITIES) {
        await addDoc(collection(db, "universities"), uni);
        successCount++;
      }
      toast.success(`Successfully uploaded ${successCount} universities!`);
      fetchColleges(); 
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error(`Failed during upload. Only ${successCount} uploaded.`);
    } finally {
      setIsBulkUploading(false);
    }
  };

  // --- THE TRIPWIRE FUNCTION ---
  const clearPublicCache = async () => {
    try {
      await fetch(`/api/revalidate?tag=universities&secret=${process.env.NEXT_PUBLIC_REVALIDATION_TOKEN}`, { method: 'POST' });
    } catch (error) {
      console.error("Cache revalidation failed", error);
    }
  };

  async function fetchColleges() {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "universities"));
      const data: College[] = [];
      querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as College));
      setColleges(data);
    } catch (error) {
      console.error("Error fetching colleges", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchColleges(); }, []);

  // --- CLOUDINARY UPLOAD LOGIC ---
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    const compressedBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const scale = Math.min(800 / img.width, 1);
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/webp", 0.6));
        };
      };
    });

    const data = new FormData();
    data.append("file", compressedBase64);
    data.append("upload_preset", "ml_default"); 

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/drytpdpz3/image/upload`, {
        method: "POST",
        body: data,
      });
      const cloudRes = await res.json();
      setFormData({ ...formData, image: cloudRes.secure_url });
      toast.success("Image optimized and uploaded successfully!");
    } catch (error) {
      toast.error("Image upload failed. Please check your connection.");
      console.error(error);
    } finally {
      setUploadingImage(false);
    }
  };

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.image) return toast.error("Please provide an image URL or upload a file.");
    
    try {
      if (editingId) {
        await updateDoc(doc(db, "universities", editingId), formData);
      } else {
        await addDoc(collection(db, "universities"), formData);
      }
      
      await clearPublicCache(); 
      
      setIsModalOpen(false);
      setFormData({ name: "", country: "", location: "", fees: "", placed: "", image: "", isHidden: false });
      setEditingId(null);
      fetchColleges(); 
      toast.success("University Saved & Public Site Updated!");
    } catch (error) {
      console.error("Error saving college", error);
      toast.error("Failed to save university.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this university?")) return;
    try {
      await deleteDoc(doc(db, "universities", id));
      await clearPublicCache(); 
      setColleges(colleges.filter(c => c.id !== id));
      toast.success("University Deleted!");
    } catch (error) {
      console.error("Error deleting", error);
    }
  }

  async function toggleVisibility(college: College) {
    try {
      await updateDoc(doc(db, "universities", college.id), { isHidden: !college.isHidden });
      await clearPublicCache(); 
      setColleges(colleges.map(c => c.id === college.id ? { ...c, isHidden: !college.isHidden } : c));
      toast.success(college.isHidden ? "University is now Live" : "University is now Hidden");
    } catch (error) {
      console.error("Error updating visibility", error);
    }
  }

  function openEdit(college: College) {
    setFormData({ ...college });
    setEditingId(college.id);
    setIsModalOpen(true);
  }

  function openAdd() {
    setFormData({ name: "", country: "", location: "", fees: "", placed: "", image: "", isHidden: false });
    setEditingId(null);
    setIsModalOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-heading">Manage Universities</h1>
          <p className="text-sm text-foreground/60">Add, edit, or hide colleges from the main website.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* TEMPORARY BULK UPLOAD BUTTON */}
          <Button 
            onClick={triggerBulkUpload} 
            disabled={isBulkUploading} 
            variant="destructive"
            className="font-bold shadow-md"
          >
            {isBulkUploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "⚠️ Run Bulk Import (44 items)"}
          </Button>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAdd} className="bg-primary text-primary-foreground">
                <Plus className="w-4 h-4 mr-2" /> Add University
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit University" : "Add New University"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSave} className="space-y-4 mt-4">
                <Input placeholder="University Name (e.g. Kazan Federal)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Country (e.g. Russia)" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} required />
                  <Input placeholder="Location (e.g. Kazan)" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} required />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Avg Fees (e.g. ₹ 4.5 Lakhs)" value={formData.fees} onChange={e => setFormData({...formData, fees: e.target.value})} required />
                  <Input placeholder="Students Placed (e.g. 200+)" value={formData.placed} onChange={e => setFormData({...formData, placed: e.target.value})} required />
                </div>

                {/* DUAL IMAGE INPUT */}
                <div className="p-4 border border-border/50 rounded-xl bg-muted/10 space-y-3">
                  <label className="text-xs font-bold uppercase text-foreground/60 tracking-wider">Cover Image</label>
                  
                  {/* Option 1: File Upload */}
                  <div className="flex items-center gap-3">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      disabled={uploadingImage}
                      className="text-xs file:bg-primary/10 file:text-primary file:rounded-md file:border-0 file:px-3 file:py-1 file:font-bold h-10 cursor-pointer" 
                    />
                    {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-primary shrink-0" />}
                  </div>
                  
                  <div className="flex items-center text-[10px] font-bold text-foreground/40 uppercase">
                    <span className="flex-1 border-t border-border/50"></span>
                    <span className="px-3">OR Paste Link</span>
                    <span className="flex-1 border-t border-border/50"></span>
                  </div>
                  
                  {/* Option 2: Direct URL */}
                  <div className="flex relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <Input 
                      placeholder="https://..." 
                      value={formData.image} 
                      onChange={e => setFormData({...formData, image: e.target.value})} 
                      className="pl-9" 
                      required 
                    />
                  </div>
                  
                  {/* Live Preview */}
                  {formData.image && (
                    <div className="h-28 w-full rounded-lg border border-border/50 bg-muted overflow-hidden relative mt-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <Button type="submit" disabled={uploadingImage} className="w-full bg-primary mt-2">
                  {editingId ? "Save Changes" : "Add University"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : colleges.length === 0 ? (
          <div className="col-span-full py-12 text-center text-foreground/50 bg-card rounded-2xl border border-border/50">No universities added yet. Click "Add University" to start.</div>
        ) : (
          colleges.map((college) => (
            <div key={college.id} className={`bg-card rounded-2xl overflow-hidden border transition-all ${college.isHidden ? 'border-dashed border-border/50 opacity-60' : 'border-border/50 shadow-sm'}`}>
              <div className="h-40 overflow-hidden relative bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {college.image && <img src={college.image} alt={college.name} className="w-full h-full object-cover" />}
                {college.isHidden && (
                  <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center font-bold text-foreground/70">
                    HIDDEN FROM PUBLIC
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold font-heading text-lg leading-tight">{college.name}</h3>
                  <span className="text-xs font-bold px-2 py-1 bg-secondary rounded-md ml-2 shrink-0">{college.country}</span>
                </div>
                <p className="text-sm text-foreground/60 mb-4">{college.fees} • {college.placed} Placed</p>
                
                <div className="flex gap-2 pt-4 border-t border-border/50">
                  <Button size="sm" variant="outline" onClick={() => toggleVisibility(college)} className="flex-1" title={college.isHidden ? "Show on website" : "Hide from website"}>
                    {college.isHidden ? <Eye className="w-4 h-4 text-green-600" /> : <EyeOff className="w-4 h-4 text-amber-600" />}
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => openEdit(college)} className="flex-1 text-primary">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(college.id)} className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}