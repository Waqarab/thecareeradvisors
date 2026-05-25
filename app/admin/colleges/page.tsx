"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2, Link as LinkIcon, MapPin, Banknote, Users, Globe2, ExternalLink, Search, Filter, Star } from "lucide-react";
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
  featuredOrder?: string | number | null; // Used for Top 6
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

  // --- FEATURED (TOP 6) MODAL STATES ---
  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [featuredSelections, setFeaturedSelections] = useState<{country: string, collegeId: string}[]>(
    Array(6).fill({ country: "All", collegeId: "" })
  );
  const [isSavingFeatured, setIsSavingFeatured] = useState(false);

  const uniqueCountries = ["All", ...Array.from(new Set(colleges.map(c => c.country)))];

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

      // Sort: Featured 1-6 first, then alphabetical
      data.sort((a, b) => {
        const orderA = a.featuredOrder ? Number(a.featuredOrder) : 999;
        const orderB = b.featuredOrder ? Number(b.featuredOrder) : 999;

        if (orderA !== orderB) {
          return orderA - orderB; 
        }
        return a.name.localeCompare(b.name);
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

  // --- 2. REVALIDATION ---
  const triggerCacheRevalidation = async () => {
    try {
      const secret = process.env.NEXT_PUBLIC_REVALIDATION_TOKEN;
      await fetch(`/api/revalidate?tag=universities&secret=${secret}`, { method: "POST" });
      sessionStorage.removeItem("tca_universities_cache");
    } catch (error) {
      console.error("Failed to revalidate cache", error);
    }
  };

  // --- 3. HANDLE TOP 6 FEATURED SAVING ---
  const openFeaturedModal = () => {
    const newSelections = Array(6).fill({ country: "All", collegeId: "" });
    colleges.forEach(c => {
      if (c.featuredOrder) {
        const order = Number(c.featuredOrder);
        if (order >= 1 && order <= 6) {
          newSelections[order - 1] = { country: c.country, collegeId: c.id };
        }
      }
    });
    setFeaturedSelections(newSelections);
  };

  const handleFeaturedCountryChange = (index: number, country: string) => {
    const newSelections = [...featuredSelections];
    newSelections[index] = { ...newSelections[index], country, collegeId: "" };
    setFeaturedSelections(newSelections);
  };

  const handleFeaturedCollegeChange = (index: number, collegeId: string) => {
    const newSelections = [...featuredSelections];
    newSelections[index] = { ...newSelections[index], collegeId };
    setFeaturedSelections(newSelections);
  };

  const handleSaveFeatured = async () => {
    setIsSavingFeatured(true);
    try {
      // 1. Find all currently featured colleges and clear their status
      const currentlyFeatured = colleges.filter(c => c.featuredOrder);
      const clearPromises = currentlyFeatured.map(c =>
        updateDoc(doc(db, "universities", c.id), { featuredOrder: null })
      );
      await Promise.all(clearPromises);

      // 2. Set the new featured orders for the selected slots
      const setPromises = featuredSelections.map((sel, idx) => {
        if (sel.collegeId) {
          return updateDoc(doc(db, "universities", sel.collegeId), { featuredOrder: idx + 1 });
        }
        return Promise.resolve();
      });
      await Promise.all(setPromises);

      toast.success("Top 6 Universities updated successfully!");
      await triggerCacheRevalidation();
      fetchColleges();
      setIsFeaturedModalOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save Top 6");
    } finally {
      setIsSavingFeatured(false);
    }
  };

  // --- 4. HANDLE ADD/EDIT/DELETE ---
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
      toast.error("Failed to save university");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are sure you want to delete this university?")) return;
    try {
      await deleteDoc(doc(db, "universities", id));
      toast.success("University deleted successfully");
      await triggerCacheRevalidation();
      fetchColleges();
    } catch (error) {
      toast.error("Failed to delete university");
    }
  };

  const handleToggleHidden = async (id: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "universities", id), { isHidden: !currentStatus });
      toast.success(currentStatus ? "University is now visible" : "University is now hidden");
      await triggerCacheRevalidation();
      fetchColleges();
    } catch (error) {
      toast.error("Failed to update visibility");
    }
  };

  const openEditModal = (college: College) => {
    setFormData({
      name: college.name, country: college.country, location: college.location,
      fees: college.fees, placed: college.placed, image: college.image, isHidden: college.isHidden,
    });
    setEditingId(college.id);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- 5. FILTERING ---
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
      
      {/* Header & Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Universities Database</h1>
          <p className="text-slate-500 mt-1">Manage global medical universities, fees, and details.</p>
        </div>
        
        <div className="flex gap-3">
          {/* MANAGE TOP 6 BUTTON & MODAL */}
          <Dialog open={isFeaturedModalOpen} onOpenChange={(open) => {
            if (open) openFeaturedModal();
            setIsFeaturedModalOpen(open);
          }}>
            <DialogTrigger asChild>
              <Button className="bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-bold shadow-sm">
                <Star className="w-4 h-4 mr-2 fill-blue-700" /> Manage Top 6
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Manage Featured Universities</DialogTitle>
                <p className="text-sm text-slate-500 mt-1">Select the 6 universities you want to feature at the top of the site. Filter by country first to find them easily.</p>
              </DialogHeader>
              
              <div className="space-y-3 mt-4">
                {featuredSelections.map((sel, idx) => {
                  // Filter colleges by the selected country for this specific slot
                  const availableColleges = sel.country === "All" 
                    ? colleges 
                    : colleges.filter(c => c.country === sel.country);

                  return (
                    <div key={idx} className="flex flex-col sm:flex-row gap-2 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-400 w-6 hidden sm:block">{idx + 1}.</span>
                      
                      {/* Country Filter Dropdown */}
                      <select 
                        value={sel.country}
                        onChange={(e) => handleFeaturedCountryChange(idx, e.target.value)}
                        className="w-full sm:w-1/3 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="All">Filter by Country</option>
                        {uniqueCountries.filter(c => c !== "All").map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>

                      {/* College Selection Dropdown */}
                      <select 
                        value={sel.collegeId}
                        onChange={(e) => handleFeaturedCollegeChange(idx, e.target.value)}
                        className="w-full sm:flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                      >
                        <option value="">-- Select a University --</option>
                        {availableColleges.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>

              <Button onClick={handleSaveFeatured} disabled={isSavingFeatured} className="w-full mt-6 bg-blue-600 text-white hover:bg-blue-700 py-6 text-lg font-bold rounded-xl">
                {isSavingFeatured ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : null}
                Save Top 6 Order
              </Button>
            </DialogContent>
          </Dialog>

          {/* ADD UNIVERSITY BUTTON & MODAL */}
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) { setEditingId(null); setFormData(initialFormState); }
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
                          <p className="font-bold text-slate-900 leading-tight flex items-center gap-2">
                            {college.name}
                            {/* BADGE SHOWING FEATURED ORDER IF IT EXISTS */}
                            {college.featuredOrder && (
                              <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                                <Star className="w-3 h-3 fill-blue-700" />
                                Top {college.featuredOrder}
                              </span>
                            )}
                          </p>
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