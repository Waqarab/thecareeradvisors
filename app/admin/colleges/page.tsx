"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Link as LinkIcon, MapPin, Banknote, Users, Globe2 } from "lucide-react";
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

const initialFormState = {
  name: "",
  country: "",
  location: "",
  fees: "",
  placed: "",
  image: "",
  isHidden: false,
};

export default function CollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- 1. FETCH COLLEGES (Admin fetches directly from DB to ensure accuracy) ---
  const fetchColleges = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "universities"));
      const data: College[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as College);
      });
      setColleges(data);
    } catch (error) {
      console.error("Error fetching colleges:", error);
      toast.error("Failed to load universities");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  // --- 2. THE MASTER REVALIDATION TRIGGER ---
  // Call this after ANY successful database write to update the live website instantly
  const triggerCacheRevalidation = async () => {
    try {
      const secret = process.env.NEXT_PUBLIC_REVALIDATION_TOKEN;
      if (!secret) {
        console.warn("Revalidation token is missing in environment variables!");
      }
      
      // 1. Tell Vercel to destroy the old cache and fetch fresh data from Firebase
      await fetch(`/api/revalidate?tag=universities&secret=${secret}`, { method: "POST" });
      
      // 2. Clear the browser's local cache so you (the admin) see it instantly on the frontend
      sessionStorage.removeItem("tca_universities_cache");
      
    } catch (error) {
      console.error("Failed to revalidate cache", error);
    }
  };

  // --- 3. HANDLE FORM SUBMIT (ADD / UPDATE) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (editingId) {
        // UPDATE EXISTING
        await updateDoc(doc(db, "universities", editingId), formData);
        toast.success("University updated successfully");
      } else {
        // ADD NEW
        await addDoc(collection(db, "universities"), formData);
        toast.success("University added successfully");
      }

      // 🔥 FIRE THE REVALIDATOR!
      await triggerCacheRevalidation();
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(initialFormState);
      fetchColleges(); // Refresh admin table
    } catch (error) {
      console.error("Error saving university:", error);
      toast.error("Failed to save university");
    } finally {
      setIsSaving(false);
    }
  };

  // --- 4. HANDLE DELETE ---
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this university? This action cannot be undone.")) return;

    try {
      await deleteDoc(doc(db, "universities", id));
      toast.success("University deleted successfully");
      
      // 🔥 FIRE THE REVALIDATOR!
      await triggerCacheRevalidation();
      
      fetchColleges();
    } catch (error) {
      console.error("Error deleting university:", error);
      toast.error("Failed to delete university");
    }
  };

  // --- 5. HANDLE VISIBILITY TOGGLE ---
  const handleToggleHidden = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "universities", id), { isHidden: !currentStatus });
      toast.success(currentStatus ? "University is now visible" : "University is now hidden");
      
      // 🔥 FIRE THE REVALIDATOR!
      await triggerCacheRevalidation();
      
      fetchColleges();
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast.error("Failed to update visibility");
    }
  };

  const openEditModal = (college: College) => {
    setFormData({
      name: college.name,
      country: college.country,
      location: college.location,
      fees: college.fees,
      placed: college.placed,
      image: college.image,
      isHidden: college.isHidden,
    });
    setEditingId(college.id);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Universities Database</h1>
          <p className="text-slate-500 mt-1">Manage global medical universities and fees.</p>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) {
            setEditingId(null);
            setFormData(initialFormState);
          }
        }}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900 text-white hover:bg-slate-800 shadow-md">
              <Plus className="w-4 h-4 mr-2" /> Add University
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] bg-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">{editingId ? "Edit University" : "Add New University"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">University Name</label>
                <Input name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Tashkent Medical Academy" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Country</label>
                  <Input name="country" value={formData.country} onChange={handleInputChange} required placeholder="e.g. Uzbekistan" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">City / Location</label>
                  <Input name="location" value={formData.location} onChange={handleInputChange} required placeholder="e.g. Tashkent" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Average Fees</label>
                  <Input name="fees" value={formData.fees} onChange={handleInputChange} required placeholder="e.g. $3,500/yr" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">Students Placed</label>
                  <Input name="placed" value={formData.placed} onChange={handleInputChange} required placeholder="e.g. 1,200+" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <LinkIcon className="w-4 h-4" /> Image URL (Cloudinary)
                </label>
                <Input name="image" value={formData.image} onChange={handleInputChange} required placeholder="https://res.cloudinary.com/..." />
              </div>
              <Button type="submit" disabled={isSaving} className="w-full mt-4 bg-slate-900 text-white hover:bg-slate-800">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {editingId ? "Update University" : "Save University"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Database Table / Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        </div>
      ) : colleges.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
          <Globe2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No universities found</h3>
          <p className="text-slate-500">Click "Add University" to populate your database.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm">
                  <th className="p-4 font-semibold">University</th>
                  <th className="p-4 font-semibold">Location</th>
                  <th className="p-4 font-semibold">Stats</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {colleges.map((college) => (
                  <tr key={college.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          {college.image ? (
                            <img src={college.image} alt={college.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">NO IMG</div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{college.name}</p>
                          <p className="text-xs text-slate-500 mt-1 font-medium">{college.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-700 flex items-center gap-1.5"><Globe2 className="w-4 h-4 text-slate-400" />{college.country}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><MapPin className="w-3.5 h-3.5 text-slate-400" />{college.location}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><Banknote className="w-4 h-4 text-emerald-500" />{college.fees}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><Users className="w-4 h-4 text-blue-500" />{college.placed}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${college.isHidden ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {college.isHidden ? "Hidden" : "Visible"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="icon" title={college.isHidden ? "Show on site" : "Hide from site"} onClick={() => handleToggleHidden(college.id, college.isHidden)}>
                          {college.isHidden ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-emerald-500" />}
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => openEditModal(college)}>
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Button>
                        <Button variant="outline" size="icon" className="hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={() => handleDelete(college.id)}>
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}