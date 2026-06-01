"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, updateDoc as updateFirestoreDoc, deleteDoc } from "firebase/firestore";
import { getDatabase, ref, onValue, update as updateRealtimeDB, remove as removeRealtimeDB } from "firebase/database";
import { db, app } from "@/firebase/config";
import { Search, Loader2, Copy, Check, CheckSquare, ChevronDown, ChevronUp, Save, Trash2, MapPin, Download, X } from "lucide-react";
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
  ipLocation?: string;
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

// Export Modal Component
function ExportModal({ 
  isOpen, 
  onClose, 
  inquiries, 
  inquiryMeta 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  inquiries: Inquiry[]; 
  inquiryMeta: Record<string, any>;
}) {
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  // Default all columns to true
  const [columns, setColumns] = useState({
    name: true,
    phone: true,
    email: true,
    address: true,
    countries: true,
    neetScore: true,
    status: true,
    ipLocation: true,
    date: true,
    message: true,
    privateNote: true
  });

  if (!isOpen) return null;

  const handleCheckboxChange = (col: keyof typeof columns) => {
    setColumns((prev) => ({ ...prev, [col]: !prev[col] }));
  };

  const handleExport = () => {
    // 1. Filter by Date
    const filteredData = inquiries.filter((inquiry) => {
      if (!inquiry.createdAt) return true;
      
      const inquiryDate = inquiry.createdAt?.toDate ? inquiry.createdAt.toDate() : new Date(inquiry.createdAt);
      const startDate = dateRange.start ? new Date(dateRange.start) : null;
      let endDate = dateRange.end ? new Date(dateRange.end) : null;

      // Make sure end date covers the whole day
      if (endDate) {
        endDate.setHours(23, 59, 59, 999);
      }

      if (startDate && inquiryDate < startDate) return false;
      if (endDate && inquiryDate > endDate) return false;
      return true;
    });

    if (filteredData.length === 0) {
      toast.error("No records found for this date range.");
      return;
    }

    // Helper to safely escape CSV cell data (handles commas and quotes)
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""'); // Escape double quotes
      return `"${str}"`; // Wrap in double quotes
    };

    const csvRows = [];
    
    // Create Header Row based on selected columns
    const headers = [];
    if (columns.name) headers.push('Name');
    if (columns.phone) headers.push('Phone');
    if (columns.email) headers.push('Email');
    if (columns.address) headers.push('Address');
    if (columns.countries) headers.push('Preferred Countries');
    if (columns.neetScore) headers.push('NEET Score');
    if (columns.status) headers.push('Status');
    if (columns.ipLocation) headers.push('IP Location');
    if (columns.date) headers.push('Date Received');
    if (columns.message) headers.push('Message');
    if (columns.privateNote) headers.push('Private Note');
    csvRows.push(headers.join(','));

    // Create Data Rows
    filteredData.forEach((inquiry) => {
      const row = [];
      const meta = inquiryMeta[inquiry.id] || {};
      const formattedDate = inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleString() : 'N/A';
      
      if (columns.name) row.push(escapeCsv(inquiry.name));
      if (columns.phone) row.push(escapeCsv(inquiry.phone));
      if (columns.email) row.push(escapeCsv(inquiry.email));
      if (columns.address) row.push(escapeCsv(inquiry.address));
      if (columns.countries) row.push(escapeCsv(inquiry.countries?.join(', ')));
      if (columns.neetScore) row.push(escapeCsv(inquiry.neetScore));
      if (columns.status) row.push(escapeCsv(inquiry.status));
      if (columns.ipLocation) row.push(escapeCsv(inquiry.ipLocation));
      if (columns.date) row.push(escapeCsv(formattedDate));
      if (columns.message) row.push(escapeCsv(inquiry.message));
      if (columns.privateNote) row.push(escapeCsv(meta.note || ''));
      
      csvRows.push(row.join(','));
    });

    // Generate and Download CSV
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `CRM_Export_${new Date().toISOString().split('T')[0]}.csv`);
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success(`Exported ${filteredData.length} records successfully.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl bg-card border border-border/50 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-heading">Export Data to Excel</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-muted rounded-full text-foreground/50 hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 space-y-3">
          <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-wider">Date Range</h3>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-foreground/50 font-medium mb-1 block">From (Past infinity if empty)</label>
              <input
                type="date"
                className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-foreground/50 font-medium mb-1 block">To (Current if empty)</label>
              <input
                type="date"
                className="w-full rounded-lg border border-border/50 bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Column Checkboxes */}
        <div className="mb-8 space-y-3">
          <h3 className="text-sm font-bold text-foreground/70 uppercase tracking-wider">Include Columns</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {Object.keys(columns).map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer hover:opacity-80">
                <input
                  type="checkbox"
                  checked={columns[key as keyof typeof columns]}
                  onChange={() => handleCheckboxChange(key as keyof typeof columns)}
                  className="rounded w-4 h-4 cursor-pointer accent-primary"
                />
                <span className="capitalize font-medium text-foreground/80">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-bold text-foreground/60 hover:bg-muted transition-colors">
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-bold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export to Excel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiryMeta, setInquiryMeta] = useState<Record<string, { responded?: boolean, seen?: boolean, note?: string }>>({});
  const [loading, setLoading] = useState(true);
  
  // Interaction States
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
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
    const searchString = `${inq.name} ${inq.phone} ${inq.email || ""} ${inq.countries?.join(" ") || ""}`.toLowerCase();
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

          {/* Export Button */}
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 bg-green-500/10 text-green-600 border border-green-500/20 hover:bg-green-500 hover:text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors mr-2"
          >
            <Download className="w-4 h-4" /> Export
          </button>

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
                                    {inq.countries?.map(c => (
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

      {/* The Export Modal */}
      <ExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        inquiries={inquiries}
        inquiryMeta={inquiryMeta}
      />
    </div>
  );
}