"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, updateDoc as updateFirestoreDoc, deleteDoc } from "firebase/firestore";
import { getDatabase, ref, onValue, update as updateRealtimeDB, remove as removeRealtimeDB } from "firebase/database";
import { db, app } from "@/firebase/config";
import { Search, Loader2, Copy, Check, CheckSquare, ChevronDown, ChevronUp, Save, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  message?: string;
  countries: string[];
  neetScore: string;
  status: string;
  ipLocation?: string; // Newly added location field
  createdAt: any;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="p-1 hover:bg-primary/10 rounded-md text-foreground/50 hover:text-primary transition-colors" title="Copy">
      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiryMeta, setInquiryMeta] = useState<Record<string, { responded?: boolean, seen?: boolean, note?: string }>>({});
  const [loading, setLoading] = useState(true);
  
  // Interaction States
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Note Saving State
  const [activeNoteText, setActiveNoteText] = useState("");
  const [savingNoteId, setSavingNoteId] = useState<string | null>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const rtdb = getDatabase(app);

    async function fetchData() {
      try {
        const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data: Inquiry[] = [];
        querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Inquiry));
        setInquiries(data);

        const metaRef = ref(rtdb, 'inquiry_meta');
        onValue(metaRef, (snapshot) => {
          setInquiryMeta(snapshot.val() || {});
        });

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    try {
      await updateFirestoreDoc(doc(db, "inquiries", id), { status: newStatus });
      setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
      toast.success("Status updated");
    } catch (error) {
      toast.error("Failed to update status");
    }
  }

  async function toggleResponded(id: string, currentStatus: boolean) {
    const rtdb = getDatabase(app);
    try {
      await updateRealtimeDB(ref(rtdb, `inquiry_meta/${id}`), { responded: !currentStatus });
      toast.success(!currentStatus ? "Marked as Responded" : "Unmarked Responded");
    } catch (error) {
      toast.error("Failed to update checkbox");
    }
  }

  async function saveNote(id: string) {
    if (!activeNoteText.trim()) return;
    setSavingNoteId(id);
    const rtdb = getDatabase(app);
    try {
      await updateRealtimeDB(ref(rtdb, `inquiry_meta/${id}`), { note: activeNoteText });
      toast.success("Note saved successfully");
    } catch (error) {
      toast.error("Failed to save note");
    } finally {
      setSavingNoteId(null);
    }
  }

  const toggleExpand = (id: string, currentNote: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      setActiveNoteText(currentNote || "");
      if (!inquiryMeta[id]?.seen) {
        updateRealtimeDB(ref(getDatabase(app), `inquiry_meta/${id}`), { seen: true });
      }
    }
  };

  // --- SELECTION & BULK DELETE LOGIC ---
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredInquiries.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredInquiries.map(i => i.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const deleteInquiries = async (idsToDelete: string[]) => {
    const isBulk = idsToDelete.length > 1;
    if (!window.confirm(`Are you sure you want to completely delete ${isBulk ? `${idsToDelete.length} inquiries` : 'this inquiry'}? This cannot be undone.`)) return;
    
    setLoading(true);
    const rtdb = getDatabase(app);
    
    try {
      // Delete from both Firestore and RTDB for completely clean stats
      await Promise.all(idsToDelete.map(async (id) => {
        await deleteDoc(doc(db, "inquiries", id));
        await removeRealtimeDB(ref(rtdb, `inquiry_meta/${id}`));
      }));
      
      // Update local state
      setInquiries(inquiries.filter(inq => !idsToDelete.includes(inq.id)));
      setSelectedIds(new Set());
      setExpandedId(null);
      toast.success(`Successfully deleted ${idsToDelete.length} record(s).`);
    } catch (error) {
      console.error("Deletion error:", error);
      toast.error("Failed to delete records.");
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
    const searchString = `${inq.name} ${inq.phone} ${inq.email || ""} ${inq.countries.join(" ")}`.toLowerCase();
    const matchesSearch = searchTerm === "" || searchString.includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Bar: Title & Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-heading">Lead Management CRM</h1>
          <p className="text-sm text-foreground/60">Total Displayed: {filteredInquiries.length}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {selectedIds.size > 0 && (
            <button 
              onClick={() => deleteInquiries(Array.from(selectedIds))}
              className="px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors mr-2"
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.size})
            </button>
          )}

          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search name, phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:border-primary"
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none font-bold text-foreground/80"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50 text-[11px] uppercase tracking-wider font-bold text-foreground/50">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={filteredInquiries.length > 0 && selectedIds.size === filteredInquiries.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="p-4 w-12 text-center" title="Responded">RSP</th>
                <th className="p-4 w-48">Name & Date</th>
                <th className="p-4 w-40">Phone</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-16 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>
              ) : filteredInquiries.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-foreground/50 font-medium">No leads match your search.</td></tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const meta = inquiryMeta[inq.id] || {};
                  const isExpanded = expandedId === inq.id;
                  const isSelected = selectedIds.has(inq.id);
                  
                  return (
                    <React.Fragment key={inq.id}>
                      {/* --- MAIN COMPACT ROW --- */}
                      <tr className={`border-b border-border/50 transition-colors ${isSelected ? 'bg-primary/5' : meta.responded ? 'bg-green-500/5' : 'hover:bg-muted/10'} ${!meta.seen ? 'font-bold' : ''}`}>
                        
                        <td className="p-4 text-center">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => toggleSelect(inq.id)}
                            className="w-4 h-4 cursor-pointer"
                          />
                        </td>

                        <td className="p-4 text-center">
                          <button 
                            onClick={() => toggleResponded(inq.id, !!meta.responded)}
                            className={`w-6 h-6 rounded flex items-center justify-center border transition-all ${meta.responded ? 'bg-green-500 border-green-500 text-white' : 'bg-background border-border/80 hover:border-primary text-transparent'}`}
                          >
                            <CheckSquare className="w-4 h-4" />
                          </button>
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-foreground leading-tight">{inq.name}</p>
                          <p className="text-[10px] text-foreground/50 uppercase font-bold mt-1">
                            {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : 'New'}
                          </p>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-foreground/80">{inq.phone}</span>
                            <CopyButton text={inq.phone} />
                          </div>
                        </td>

                        <td className="p-4">
                          <select 
                            value={inq.status}
                            onChange={(e) => updateStatus(inq.id, e.target.value)}
                            className={`text-xs rounded-full px-3 py-1 font-bold outline-none cursor-pointer border ${
                              inq.status === 'New' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                              inq.status === 'Contacted' ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' : 
                              'bg-green-500/10 text-green-700 border-green-500/20'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => deleteInquiries([inq.id])} className="p-1.5 hover:bg-destructive/10 text-foreground/40 hover:text-destructive rounded-md transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => toggleExpand(inq.id, meta.note || "")} className="p-1.5 hover:bg-muted rounded-full transition-colors" title="Expand Details">
                              {isExpanded ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-foreground/50 hover:text-primary" />}
                            </button>
                          </div>
                        </td>

                      </tr>

                      {/* --- EXPANDED DETAILS ACCORDION --- */}
                      {isExpanded && (
                        <tr className="bg-muted/20 border-b border-border/80">
                          <td colSpan={6} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                              
                              {/* Read Only Details */}
                              <div className="space-y-3 bg-card p-5 rounded-2xl border border-border/50 shadow-sm relative">
                                {/* Captured IP Location Tag */}
                                {inq.ipLocation && (
                                  <div className="absolute top-4 right-4 flex items-center gap-1.5 text-[10px] font-bold text-blue-600 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md uppercase tracking-wide">
                                    <MapPin className="w-3 h-3" /> {inq.ipLocation}
                                  </div>
                                )}

                                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground/50 border-b border-border/50 pb-2 mb-4">Student Information</h4>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <span className="text-[10px] font-bold text-foreground/50 uppercase block mb-1">Email</span>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium truncate max-w-[150px]">{inq.email || "N/A"}</p>
                                      {inq.email && <CopyButton text={inq.email} />}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-bold text-foreground/50 uppercase block mb-1">NEET Score</span>
                                    <p className="text-sm font-bold text-primary">{inq.neetScore}</p>
                                  </div>
                                </div>
                                
                                <div>
                                  <span className="text-[10px] font-bold text-foreground/50 uppercase block mb-1 mt-2">Provided Address</span>
                                  <p className="text-sm font-medium">{inq.address || "No address provided"}</p>
                                </div>

                                <div>
                                  <span className="text-[10px] font-bold text-foreground/50 uppercase block mb-1 mt-2">Preferred Countries</span>
                                  <div className="flex flex-wrap gap-2 mt-1">
                                    {inq.countries.map(c => (
                                      <span key={c} className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded-md text-[10px] font-bold uppercase border border-border/50">{c}</span>
                                    ))}
                                  </div>
                                </div>

                                {inq.message && (
                                  <div className="mt-4 pt-4 border-t border-border/50">
                                    <span className="text-[10px] font-bold text-foreground/50 uppercase block mb-2">Message</span>
                                    <p className="text-sm italic bg-muted/50 p-3 rounded-lg border border-border/50 text-foreground/80">"{inq.message}"</p>
                                  </div>
                                )}
                              </div>

                              {/* Private RTDB Note */}
                              <div className="flex flex-col bg-card p-5 rounded-2xl border border-border/50 shadow-sm">
                                <h4 className="font-bold text-xs uppercase tracking-wider text-foreground/50 border-b border-border/50 pb-2 mb-4">Private Note (Saved in RTDB)</h4>
                                <textarea
                                  value={activeNoteText}
                                  onChange={(e) => setActiveNoteText(e.target.value)}
                                  placeholder="Add a quick internal note about this student..."
                                  className="flex-1 w-full bg-muted/30 border border-border/50 rounded-xl p-4 text-sm focus:outline-none focus:border-primary resize-none mb-4"
                                />
                                <button 
                                  onClick={() => saveNote(inq.id)}
                                  disabled={savingNoteId === inq.id}
                                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-xl shadow-sm hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                  {savingNoteId === inq.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                  Save Note
                                </button>
                              </div>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}