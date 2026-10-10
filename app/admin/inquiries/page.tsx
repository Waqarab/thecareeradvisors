"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, updateDoc as updateFirestoreDoc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { getDatabase, ref, onValue, update as updateRealtimeDB, remove as removeRealtimeDB } from "firebase/database";
import { db, app } from "@/firebase/config";
import { Search, Loader2, Copy, Check, CheckSquare, ChevronDown, ChevronUp, Save, Trash2, MapPin, Download, X } from "lucide-react";
import { toast } from "sonner";
import { useConfirm } from "@/components/ui/use-confirm";
import { usePermissions } from "@/context/PermissionsContext";
import { Lock } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  countries: string[];
  neetScore: string;
  status: string;
  isUnder18?: string;
  guardianName?: string;
  guardianPhone?: string;
  consentMarketing?: boolean;
  source?: string;
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
    neetScore: true,
    countries: true,
    message: true,
    isUnder18: true,
    guardianName: true,
    guardianPhone: true,
    consentMarketing: true,
    source: true,
    date: true,
    status: true,
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
      let str = String(val);
      // Neutralize formula injection: Excel/Sheets treat these as formula starters
      if (/^[=+\-@\t\r]/.test(str)) {
        str = "'" + str;
      }
      str = str.replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [];
    
    // Create Header Row based on selected columns
    const headers = [];
    if (columns.name) headers.push('Name');
    if (columns.phone) headers.push('Phone');
    if (columns.email) headers.push('Email');
    if (columns.neetScore) headers.push('NEET Score');
    if (columns.countries) headers.push('Preferred Countries');
    if (columns.message) headers.push('Message');
    if (columns.isUnder18) headers.push('Under 18');
    if (columns.guardianName) headers.push('Guardian Name');
    if (columns.guardianPhone) headers.push('Guardian Phone');
    if (columns.consentMarketing) headers.push('Marketing Consent');
    if (columns.source) headers.push('Source');
    if (columns.date) headers.push('Date Received');
    if (columns.status) headers.push('Status');
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
      if (columns.neetScore) row.push(escapeCsv(inquiry.neetScore));
      if (columns.countries) row.push(escapeCsv(inquiry.countries?.join(', ')));
      if (columns.message) row.push(escapeCsv(inquiry.message));
      if (columns.isUnder18) row.push(escapeCsv(inquiry.isUnder18));
      if (columns.guardianName) row.push(escapeCsv(inquiry.guardianName));
      if (columns.guardianPhone) row.push(escapeCsv(inquiry.guardianPhone));
      if (columns.consentMarketing) row.push(escapeCsv(inquiry.consentMarketing ? "Yes" : "No"));
      if (columns.source) row.push(escapeCsv(inquiry.source));
      if (columns.date) row.push(escapeCsv(formattedDate));
      if (columns.status) row.push(escapeCsv(inquiry.status));
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
  const { ConfirmationDialog, confirmAction } = useConfirm();
  const { guard, ready, role, canWrite } = usePermissions();
  const isRestricted = ready && role !== "super-admin" && !canWrite;
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
  const [marketingFilter, setMarketingFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

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
        toast.error("Couldn't load the inquiries. Please try again.");
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
    if (!(await confirmAction("Move to Recycle Bin", `Are you sure you want to move ${isBulk ? `${idsToDelete.length} inquiries` : 'this inquiry'} to the Recycle Bin? (Kept for 14 days)`, { isDestructive: true, confirmText: "Move to Bin" }))) return;
    
    setLoading(true);
    const rtdb = getDatabase(app);
    
    try {
      await Promise.all(idsToDelete.map(async (id) => {
        // Fetch current document
        const docRef = doc(db, "inquiries", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Move to recycled_inquiries
          await setDoc(doc(db, "recycled_inquiries", id), {
            ...data,
            deletedAt: new Date().toISOString()
          });
          
          // Delete from Firestore
          await deleteDoc(docRef);
          
          // DO NOT delete from RTDB immediately if we want to restore later, 
          // or we can just ignore RTDB for now (it's only meta info).
          // Actually, let's keep RTDB meta so if restored, it still has reads/time info.
        }
      }));
      
      // Update local state
      setInquiries(inquiries.filter(inq => !idsToDelete.includes(inq.id)));
      setSelectedIds(new Set());
      setExpandedId(null);
      toast.success(`Successfully deleted ${idsToDelete.length} record(s).`);
    } catch (error) {
      console.error("Deletion error:", error);
      toast.error("Couldn't delete the inquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
    
    let matchesMarketing = true;
    if (marketingFilter === "Subscribed") matchesMarketing = inq.consentMarketing === true;
    else if (marketingFilter === "Unsubscribed") matchesMarketing = !inq.consentMarketing;

    let matchesAge = true;
    if (ageFilter === "Minor") matchesAge = inq.isUnder18 === "Yes" || inq.isUnder18 === "yes";
    else if (ageFilter === "Major") matchesAge = inq.isUnder18 === "No" || inq.isUnder18 === "no" || !inq.isUnder18;

    let matchesDate = true;
    if (dateFilter.start || dateFilter.end) {
      const inquiryDate = inq.createdAt?.toDate ? inq.createdAt.toDate() : new Date(inq.createdAt);
      if (dateFilter.start) {
        const [sy, sm, sd] = dateFilter.start.split('-');
        const startD = new Date(Number(sy), Number(sm) - 1, Number(sd), 0, 0, 0, 0);
        if (inquiryDate < startD) matchesDate = false;
      }
      if (dateFilter.end) {
        const [ey, em, ed] = dateFilter.end.split('-');
        const endD = new Date(Number(ey), Number(em) - 1, Number(ed), 23, 59, 59, 999);
        if (inquiryDate > endD) matchesDate = false;
      }
    }

    const searchString = `${inq.name} ${inq.phone} ${inq.email || ""} ${inq.countries?.join(" ") || ""}`.toLowerCase();
    const matchesSearch = searchTerm === "" || searchString.includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch && matchesMarketing && matchesAge && matchesDate;
  });

  return (
    <div className="space-y-6 pb-20">
      <ConfirmationDialog />
      
      {/* Top Bar: Title & Global Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-300 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-extrabold font-outfit text-gray-900 tracking-tight">Lead Management CRM</h1>
          <span className="text-xs bg-gray-100 border border-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full font-bold shadow-sm">
            Total: {filteredInquiries.length}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {selectedIds.size > 0 && (
            <button 
              onClick={() => guard("delete", () => deleteInquiries(Array.from(selectedIds)))}
              className={`px-4 py-2 bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-colors mr-2 ${isRestricted ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <Trash2 className="w-4 h-4" /> Delete ({selectedIds.size})
              {isRestricted && <Lock className="w-3 h-3 ml-1 opacity-70 inline" />}
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search name, phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"
            />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-gray-300 shadow-sm">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider mr-2 hidden md:block">Filters</span>
        
        <select 
          value={statusFilter} 
          onChange={(e) => setStatusFilter(e.target.value)}
          className="py-1.5 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow font-bold text-gray-700 cursor-pointer"
        >
          <option value="All">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select 
          value={marketingFilter} 
          onChange={(e) => setMarketingFilter(e.target.value)}
          className="py-1.5 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow font-bold text-gray-700 cursor-pointer"
        >
          <option value="All">All Marketing</option>
          <option value="Subscribed">Subscribed</option>
          <option value="Unsubscribed">Unsubscribed</option>
        </select>

        <select 
          value={ageFilter} 
          onChange={(e) => setAgeFilter(e.target.value)}
          className="py-1.5 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow font-bold text-gray-700 cursor-pointer"
        >
          <option value="All">All Ages</option>
          <option value="Minor">Minor (Under 18)</option>
          <option value="Major">Major (18+)</option>
        </select>

        <div className="flex items-center gap-2 md:ml-auto w-full md:w-auto">
          <input 
            type="date"
            value={dateFilter.start}
            onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
            className="py-1.5 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow font-bold text-gray-700 cursor-pointer flex-1 md:flex-none"
            title="Start Date"
          />
          <span className="text-gray-400 font-bold text-xs">to</span>
          <input 
            type="date"
            value={dateFilter.end}
            onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
            className="py-1.5 px-3 rounded-lg border border-gray-300 bg-gray-50 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow font-bold text-gray-700 cursor-pointer flex-1 md:flex-none"
            title="End Date"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse relative">
            <thead>
              <tr className="bg-gray-100/95 border-b border-gray-300 text-[11px] uppercase tracking-widest font-extrabold text-gray-500 shadow-sm">
                <th className="px-4 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={filteredInquiries.length > 0 && selectedIds.size === filteredInquiries.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 cursor-pointer accent-indigo-600 rounded"
                  />
                </th>
                <th className="px-4 py-4 w-48">Name & Date</th>
                <th className="px-4 py-4 w-40">Phone</th>
                <th className="px-4 py-4 w-32">Status</th>
                <th className="px-4 py-4 w-16 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>
              ) : filteredInquiries.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center text-foreground/50 font-medium">No leads match your search.</td></tr>
              ) : (
                filteredInquiries.map((inq) => {
                  const meta = inquiryMeta[inq.id] || {};
                  const isExpanded = expandedId === inq.id;
                  const isSelected = selectedIds.has(inq.id);
                  
                  return (
                    <React.Fragment key={inq.id}>
                      {/* --- MAIN COMPACT ROW --- */}
                      <tr className={`transition-colors hover:bg-gray-50/80 group ${isSelected ? 'bg-indigo-50/40' : meta.responded ? 'bg-emerald-50/30' : 'bg-white'} ${!meta.seen ? 'font-extrabold' : ''} ${isExpanded ? 'bg-slate-50 shadow-[inset_4px_0_0_0_rgb(99,102,241)] border-t-2 border-indigo-200 border-b-0' : 'border-b border-gray-200'}`}>
                        
                        <td className="px-4 py-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => toggleSelect(inq.id)}
                            className="w-4 h-4 cursor-pointer accent-indigo-600 rounded"
                          />
                        </td>

                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-900 leading-tight group-hover:text-indigo-600 transition-colors">{inq.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">
                            {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : 'New'}
                          </p>
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-gray-700">{inq.phone}</span>
                            <CopyButton text={inq.phone} />
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <div className="relative inline-block" onClick={(e) => { if (isRestricted) guard("update", () => {}, e); }}>
                            <select 
                              value={inq.status}
                              onChange={(e) => updateStatus(inq.id, e.target.value)}
                              className={`text-xs rounded-lg px-3 py-1.5 font-bold outline-none cursor-pointer border appearance-none text-center transition-colors shadow-sm ${
                                inq.status === 'New' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100' : 
                                inq.status === 'Contacted' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 
                                'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                              } ${isRestricted ? "opacity-60 pointer-events-none" : ""}`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="Resolved">Resolved</option>
                            </select>
                            {isRestricted && (
                              <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Lock className="w-3 h-3 text-gray-500 opacity-70" />
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => guard("delete", () => deleteInquiries([inq.id]))} className={`p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-md transition-colors ${isRestricted ? "opacity-60 cursor-not-allowed" : ""}`} title="Delete">
                              <Trash2 className="w-4 h-4" />
                              {isRestricted && <Lock className="w-3 h-3 ml-1 opacity-70 inline" />}
                            </button>
                            <button onClick={() => toggleExpand(inq.id, meta.note || "")} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors" title="Expand Details">
                              {isExpanded ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-gray-400 hover:text-indigo-600" />}
                            </button>
                          </div>
                        </td>

                      </tr>

                      {/* --- EXPANDED DETAILS ACCORDION --- */}
                      {isExpanded && (
                        <tr className="bg-slate-50 shadow-[inset_4px_0_0_0_rgb(99,102,241)] border-b-2 border-indigo-200">
                          <td colSpan={5} className="p-0">
                            <div className="p-5 md:p-6 flex flex-col md:flex-row gap-6 items-stretch">
                              
                              {/* Left Column: Details */}
                              <div className="flex-1">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6">
                                  <div className="col-span-2 md:col-span-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Email</span>
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-semibold text-gray-900 truncate">{inq.email || "N/A"}</p>
                                      {inq.email && <CopyButton text={inq.email} />}
                                    </div>
                                  </div>
                                  
                                  <div className="col-span-2 md:col-span-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">NEET Score</span>
                                    <p className="text-sm font-semibold text-gray-900">{inq.neetScore || "N/A"}</p>
                                  </div>

                                  <div className="col-span-2 md:col-span-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Source</span>
                                    <p className="text-sm font-semibold text-gray-900">{inq.source || "N/A"}</p>
                                  </div>

                                  <div className="col-span-2 md:col-span-1">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Consent</span>
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${inq.consentMarketing ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                                      {inq.consentMarketing ? "Yes" : "No"}
                                    </span>
                                  </div>
                                </div>

                                {/* Under 18 Block */}
                                {inq.isUnder18 === "Yes" && (
                                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 bg-orange-50 p-3 rounded-lg border border-orange-100">
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-orange-600 uppercase">Guardian:</span>
                                      <p className="text-sm font-semibold text-orange-900">{inq.guardianName || "N/A"}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold text-orange-600 uppercase">Phone:</span>
                                      <div className="flex items-center gap-1.5">
                                        <p className="text-sm font-semibold text-orange-900">{inq.guardianPhone || "N/A"}</p>
                                        {inq.guardianPhone && <CopyButton text={inq.guardianPhone} />}
                                      </div>
                                    </div>
                                  </div>
                                )}

                                <div className="mt-4">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Preferred Countries</span>
                                  <div className="flex flex-wrap gap-2">
                                    {inq.countries?.map(c => (
                                      <span key={c} className="px-2.5 py-1 bg-white text-gray-700 rounded text-[11px] font-bold uppercase border border-gray-200 shadow-sm">{c}</span>
                                    ))}
                                  </div>
                                </div>

                                {inq.message && (
                                  <div className="mt-4">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1.5">Message</span>
                                    <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200 leading-relaxed shadow-sm">
                                      {inq.message}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Right Column: Private Note */}
                              <div className="w-full md:w-[320px] shrink-0">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
                                  <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-[11px] uppercase tracking-wider text-gray-500">Private Note</h4>
                                    <span className={`text-[10px] font-bold ${activeNoteText.length >= 50 ? 'text-red-500' : 'text-gray-400'}`}>
                                      {activeNoteText.length}/50
                                    </span>
                                  </div>
                                  <textarea
                                    value={activeNoteText}
                                    onChange={(e) => setActiveNoteText(e.target.value.slice(0, 50))}
                                    maxLength={50}
                                    placeholder="Brief note (50 chars)..."
                                    className="flex-1 w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none transition-shadow min-h-[80px]"
                                  />
                                  <button 
                                    onClick={(e) => guard("update", () => saveNote(inq.id), e)}
                                    disabled={savingNoteId === inq.id}
                                    className={`mt-3 w-full flex items-center justify-center gap-2 font-bold py-2.5 rounded-lg shadow transition-all text-xs ${isRestricted ? "bg-gray-400 text-gray-700 opacity-60 cursor-not-allowed" : "bg-gray-900 text-white hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50"}`}
                                  >
                                    {isRestricted ? <Lock className="w-4 h-4" /> : savingNoteId === inq.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Save Note
                                  </button>
                                </div>
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