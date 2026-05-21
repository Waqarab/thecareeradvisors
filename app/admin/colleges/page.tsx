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

  // --- THE TRIPWIRE FUNCTION ---
  // Silently tells Vercel to clear the public cache for universities
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

    // 1. Compress Image to WebP format (<50kb usually, max width 800px)
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
          resolve(canvas.toDataURL("image/webp", 0.6)); // 0.6 quality for aggressive size reduction
        };
      };
    });

    // 2. Upload to Cloudinary using your specific credentials
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
      
      await clearPublicCache(); // Ping Vercel!
      
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
      await clearPublicCache(); // Ping Vercel!
      setColleges(colleges.filter(c => c.id !== id));
      toast.success("University Deleted!");
    } catch (error) {
      console.error("Error deleting", error);
    }
  }

  async function toggleVisibility(college: College) {
    try {
      await updateDoc(doc(db, "universities", college.id), { isHidden: !college.isHidden });
      await clearPublicCache(); // Ping Vercel!
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
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAdd} className="bg-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" /> Add University
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
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