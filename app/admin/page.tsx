"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, doc, updateDoc, limit } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Users, AlertCircle, Loader2, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";

interface Inquiry {
  id: string;
  name: string;
  phone: string;
  countries: string[];
  neetScore: string;
  status: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    try {
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data: Inquiry[] = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Inquiry);
      });
      setInquiries(data);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    setUpdatingId(id);
    try {
      await updateDoc(doc(db, "inquiries", id), { status: newStatus });
      setInquiries(inquiries.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    } finally {
      setUpdatingId(null);
    }
  }

  const newLeads = inquiries.filter(i => i.status === "New");
  const contactedLeads = inquiries.filter(i => i.status === "Contacted" || i.status === "Resolved");

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* PREMIUM METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Leads (Dusk Blue) */}
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Total Leads</p>
            <h3 className="text-4xl font-extrabold font-heading text-foreground">{inquiries.length}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
        </div>
        
        {/* Urgent/New Leads (Spicy Paprika) */}
        <div className="bg-card p-6 rounded-2xl border-l-4 border-l-destructive border-t border-r border-b border-border/50 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Action Required</p>
            <h3 className="text-4xl font-extrabold font-heading text-destructive">{newLeads.length}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive group-hover:scale-110 transition-transform">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Actioned (Green/Success) */}
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <div>
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Contacted</p>
            <h3 className="text-4xl font-extrabold font-heading text-green-600">{contactedLeads.length}</h3>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Quick Actions Table */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 bg-background flex justify-between items-center">
            <h2 className="text-lg font-bold font-heading">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm font-bold text-primary hover:underline flex items-center">
              View CRM <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50 text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>
                ) : inquiries.slice(0, 6).map((inquiry) => (
                  <tr key={inquiry.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors text-sm">
                    <td className="p-4 font-bold">{inquiry.name}</td>
                    <td className="p-4 text-foreground/80">{inquiry.phone}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-background border border-border/50 rounded-md text-xs font-bold shadow-sm">
                        {inquiry.neetScore}
                      </span>
                    </td>
                    <td className="p-4">
                      {updatingId === inquiry.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      ) : (
                        <select 
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                          className={`text-xs rounded-full px-3 py-1 font-bold outline-none cursor-pointer border ${
                            inquiry.status === 'New' ? 'bg-destructive/10 text-destructive border-destructive/20' : 
                            inquiry.status === 'Contacted' ? 'bg-amber-500/10 text-amber-700 border-amber-500/20' : 
                            'bg-green-500/10 text-green-700 border-green-500/20'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Activity Feed */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-6 border-b border-border/50 bg-background flex items-center gap-2">
            <Activity className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-bold font-heading">Activity Feed</h2>
          </div>
          
          <div className="p-6 overflow-y-auto flex-1 relative">
            {/* Vertical Timeline Line */}
            <div className="absolute top-6 bottom-6 left-9 w-px bg-border/80"></div>
            
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : inquiries.slice(0, 8).map((inquiry, idx) => (
              <div key={inquiry.id} className="relative pl-10 mb-8 last:mb-0 group">
                {/* Timeline Dot */}
                <div className={`absolute left-0 w-6 h-6 rounded-full border-4 border-card flex items-center justify-center top-0 transition-transform group-hover:scale-125 ${
                  inquiry.status === 'New' ? 'bg-destructive' : 'bg-primary'
                }`}></div>
                
                <p className="text-sm text-foreground/60 mb-0.5">
                  {inquiry.createdAt?.toDate ? inquiry.createdAt.toDate().toLocaleDateString() : 'Just now'}
                </p>
                <div className="bg-background border border-border/50 p-3 rounded-xl shadow-sm">
                  <p className="text-sm text-foreground leading-tight">
                    <span className="font-bold">{inquiry.name}</span> submitted an inquiry for <span className="font-semibold text-primary">{inquiry.countries[0]}</span>.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}