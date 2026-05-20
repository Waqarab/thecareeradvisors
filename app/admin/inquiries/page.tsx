"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Search, Loader2, Copy, Check, Filter } from "lucide-react";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  countries: string[];
  neetScore: string;
  status: string;
  createdAt: any;
}

// Micro-component for the Copy Button
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy} 
      className="p-1.5 hover:bg-primary/10 rounded-md text-foreground/50 hover:text-primary transition-colors"
      title="Copy to clipboard"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
    </button>
  );
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [countryFilter, setCountryFilter] = useState("All");

  useEffect(() => {
    async function fetchInquiries() {
      try {
        const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const data: Inquiry[] = [];
        querySnapshot.forEach((doc) => data.push({ id: doc.id, ...doc.data() } as Inquiry));
        setInquiries(data);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInquiries();
  }, []);

  // Update Status directly from table
  async function updateStatus(id: string, newStatus: string) {
    try {
      await updateDoc(doc(db, "inquiries", id), { status: newStatus });
      setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }

  // Mega-Filter Logic
  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === "All" || inq.status === statusFilter;
    const matchesCountry = countryFilter === "All" || inq.countries.includes(countryFilter);
    
    // Global Search: Combines name, phone, email, and countries into one string and searches it
    const searchString = `${inq.name} ${inq.phone} ${inq.email || ""} ${inq.countries.join(" ")}`.toLowerCase();
    const matchesSearch = searchTerm === "" || searchString.includes(searchTerm.toLowerCase());

    return matchesStatus && matchesCountry && matchesSearch;
  });

  // Extract unique countries for the filter dropdown
  const uniqueCountries = Array.from(new Set(inquiries.flatMap(i => i.countries)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold font-heading">Lead Management</h1>
          <p className="text-sm text-foreground/60">Total Leads: {filteredInquiries.length}</p>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
            <input 
              type="text" 
              placeholder="Search name, phone, email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-border/50 bg-background text-sm focus:outline-none focus:border-primary"
            />
          </div>
          
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="py-2 px-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Resolved">Resolved</option>
          </select>

          <select 
            value={countryFilter} 
            onChange={(e) => setCountryFilter(e.target.value)}
            className="py-2 px-3 rounded-lg border border-border/50 bg-background text-sm focus:outline-none"
          >
            <option value="All">All Countries</option>
            {uniqueCountries.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50 text-xs uppercase tracking-wider font-semibold text-foreground/60">
                <th className="p-4">Date</th>
                <th className="p-4">Student Info</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Preferences</th>
                <th className="p-4">NEET</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={6} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></td></tr>
              ) : filteredInquiries.length === 0 ? (
                <tr><td colSpan={6} className="p-8 text-center text-foreground/50">No inquiries match your search.</td></tr>
              ) : (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="border-b border-border/50 hover:bg-muted/10 transition-colors">
                    <td className="p-4 text-foreground/60">
                      {inq.createdAt?.toDate ? inq.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </td>
                    <td className="p-4 font-bold text-foreground">{inq.name}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-foreground/80">{inq.phone}</span>
                        <CopyButton text={inq.phone} />
                      </div>
                      {inq.email && (
                        <div className="flex items-center gap-2 text-xs text-foreground/60">
                          <span>{inq.email}</span>
                          <CopyButton text={inq.email} />
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {inq.countries.map(c => (
                          <span key={c} className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs">{c}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-semibold">{inq.neetScore}</td>
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}