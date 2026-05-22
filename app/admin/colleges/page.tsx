"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Link as LinkIcon, MapPin, Banknote, Users, Globe2, ExternalLink, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import Link from "next/link";

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

  // --- SEARCH, FILTER & PAGINATION STATES ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(15);

  // Reset pagination when filters change so users don't get stuck on empty pages
  useEffect(() => {
    setVisibleCount(15);
  }, [searchQuery, statusFilter, countryFilter]);

  // --- 1. FETCH COLLEGES ---
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
  const triggerCacheRevalidation = async () => {
    try {
      const secret = process.env.NEXT_PUBLIC_REVALIDATION_TOKEN;
      if (!secret) {
        console.warn("Revalidation token is missing in environment variables!");
      }
      await fetch(`/api/revalidate?tag=universities&secret=${secret}`, { method: "POST" });
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
        await updateDoc(doc(db, "universities", editingId), formData);
        toast.success("University updated successfully");
      } else {
        await addDoc(collection(db, "universities"), formData);
        toast.success("University added successfully");
      }

      await triggerCacheRevalidation();
      
      setIsModalOpen(false);
      setEditingId(null);
      setFormData(initialFormState);
      fetchColleges();
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
      await triggerCacheRevalidation();
      fetchColleges();
    } catch (error) {
      console.error("Error toggling visibility:", error);
      toast.error("Failed to update visibility");
    }
  };

  // --- 6. MODAL HANDLERS ---
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

  // --- 7. FILTER & PAGINATION LOGIC ---
  const uniqueCountries = ["All", ...Array.from(new Set(colleges.map(c => c.country)))];

  const filteredColleges = colleges.filter(college => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      college.name.toLowerCase().includes(searchLower) ||
      college.country.toLowerCase().includes(searchLower) ||
      college.location.toLowerCase().includes(searchLower);
    
    const matchesStatus = 
      statusFilter === "All" ? true :
      statusFilter === "Visible" ? !college.isHidden :
      statusFilter === "Hidden" ? college.isHidden : true;

    const matchesCountry = countryFilter === "All" || college.country === countryFilter;

    return matchesSearch && matchesStatus && matchesCountry;
  });

  const displayedColleges = filteredColleges.slice(0, visibleCount);
  const hasMore = visibleCount < filteredColleges.length;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto w-full pb-24">
      
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Universities Database</h1>
          <p className="text-slate-500 mt-1">Manage global medical universities, fees, and details.</p>
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
              <DialogTitle className="text-2xl font-bold">{editingId ? "Quick Edit Details" : "Add New University"}</DialogTitle>
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
                {editingId ? "Save Quick Edits" : "Create University"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- SEARCH & FILTERS BAR --- */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search by name, country, or city..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 border-slate-200 w-full"
          />
        </div>

        {/* Filters */}
        <div className="flex w-full md:w-auto gap-3 items-center overflow-x-auto pb-1 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden md:block" />
          
          <select 
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer min-w-[120px]"
          >
            {uniqueCountries.map(country => (
              <option key={country} value={country}>{country === "All" ? "All Countries" : country}</option>
            ))}
          </select>

          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-slate-900 transition-all cursor-pointer min-w-[120px]"
          >
            <option value="All">All Statuses</option>
            <option value="Visible">Visible Only</option>
            <option value="Hidden">Hidden Only</option>
          </select>
        </div>

      </div>

      {/* --- RESULTS INFO --- */}
      {!loading && (
        <p className="text-sm font-semibold text-slate-500 mb-4 px-2">
          Showing {displayedColleges.length} of {filteredColleges.length} results
        </p>
      )}

      {/* Database Table / Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
        </div>
      ) : filteredColleges.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
          <Globe2 className="w-12 h-12 mx-auto text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No universities found</h3>
          <p className="text-slate-500 text-sm mt-1">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
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
                {displayedColleges.map((college) => (
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
                          <p className="font-bold text-slate-900 leading-tight">{college.name}</p>
                          <p className="text-xs text-slate-400 mt-1 font-mono">{college.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-slate-700 flex items-center gap-1.5"><Globe2 className="w-4 h-4 text-slate-400 shrink-0" />{college.country}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />{college.location}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-semibold text-slate-700 flex items-center gap-1.5"><Banknote className="w-4 h-4 text-emerald-500 shrink-0" />{college.fees}</p>
                      <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1"><Users className="w-4 h-4 text-blue-500 shrink-0" />{college.placed}</p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase ${college.isHidden ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {college.isHidden ? "Hidden" : "Visible"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* 1. Toggle Visibility */}
                        <Button variant="outline" size="icon" title={college.isHidden ? "Publish to Site" : "Hide from Site"} onClick={() => handleToggleHidden(college.id, college.isHidden)}>
                          {college.isHidden ? <EyeOff className="w-4 h-4 text-amber-500" /> : <Eye className="w-4 h-4 text-emerald-500" />}
                        </Button>
                        
                        {/* 2. Quick Edit Modal */}
                        <Button variant="outline" size="icon" title="Quick Edit Basic Info" onClick={() => openEditModal(college)}>
                          <Edit className="w-4 h-4 text-blue-500" />
                        </Button>

                        {/* 3. Deep Details Page */}
                        <Link href={`/admin/colleges/${college.id}`}>
                          <Button variant="outline" size="icon" title="Manage Deep Details (History, Rankings, etc.)">
                            <ExternalLink className="w-4 h-4 text-indigo-500" />
                          </Button>
                        </Link>

                        {/* 4. Delete */}
                        <Button variant="outline" size="icon" title="Delete Permanently" className="hover:bg-red-50 hover:text-red-600 hover:border-red-200" onClick={() => handleDelete(college.id)}>
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

      {/* --- LOAD MORE BUTTON --- */}
      {hasMore && (
        <div className="flex justify-center mt-4">
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => setVisibleCount(prev => prev + 15)}
            className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 font-bold px-8 shadow-sm"
          >
            Load 15 More
          </Button>
        </div>
      )}

    </div>
  );
}