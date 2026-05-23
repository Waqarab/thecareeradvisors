"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { db, app } from "@/firebase/config";
import { Users, Loader2, CheckCircle2, ChevronRight, Activity, Eye, Globe, LineChart } from "lucide-react";
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
  
  // Realtime DB Metrics
  const [totalVisits, setTotalVisits] = useState(0);
  const [dailyVisits, setDailyVisits] = useState(0);
  const [respondedCount, setRespondedCount] = useState(0);
  const [seenPendingCount, setSeenPendingCount] = useState(0);

  useEffect(() => {
    async function loadDashboard() {
      // 1. Fetch Inquiries from Firestore
      const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const data: Inquiry[] = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as Inquiry);
      });
      setInquiries(data);
      setLoading(false);

      // 2. Connect to Free Realtime Database for Metrics
      const rtdb = getDatabase(app);
      
      // Fetch ALL visits to calculate Total and Today
      const visitsRef = ref(rtdb, `stats/visits`);
      onValue(visitsRef, (snapshot) => {
        const visitData = snapshot.val();
        if (!visitData) return;
        
        let total = 0;
        let todayCount = 0;
        const todayStr = new Date().toISOString().split('T')[0];

        Object.entries(visitData).forEach(([date, ips]: [string, any]) => {
          const count = Object.keys(ips).length;
          total += count;
          if (date === todayStr) todayCount = count;
        });

        setTotalVisits(total);
        setDailyVisits(todayCount);
      });

      // Fetch "Responded" and "Seen" metrics and CROSS-REFERENCE with active Firestore data
      const validInquiryIds = new Set(data.map(i => i.id)); // Ensures we don't count deleted leads
      const metaRef = ref(rtdb, 'inquiry_meta');
      
      onValue(metaRef, (snapshot) => {
        const metaData = snapshot.val();
        if (!metaData) return;
        
        let responded = 0;
        let seenPending = 0;
        
        Object.entries(metaData).forEach(([id, meta]: [string, any]) => {
          if (!validInquiryIds.has(id)) return; // Ignore deleted leads
          if (meta.responded) responded++;
          else if (meta.seen && !meta.responded) seenPending++;
        });
        
        setRespondedCount(responded);
        setSeenPendingCount(seenPending);
      });
    }

    loadDashboard();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* ======================================================== */}
      {/* PREMIUM METRIC CARDS                                     */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        
        {/* Total Visits (All Time) */}
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Total Views</p>
            <h3 className="text-4xl font-extrabold font-heading text-foreground">{totalVisits}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform relative z-10">
            <LineChart className="w-5 h-5" />
          </div>
        </div>

        {/* Visits Today */}
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Visits Today</p>
            <h3 className="text-4xl font-extrabold font-heading text-foreground">{dailyVisits}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform relative z-10">
            <Globe className="w-5 h-5" />
          </div>
        </div>
        
        {/* Total Leads */}
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Total Leads</p>
            <h3 className="text-4xl font-extrabold font-heading text-foreground">{inquiries.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent group-hover:scale-110 transition-transform relative z-10">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Responded */}
        <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Responded</p>
            <h3 className="text-4xl font-extrabold font-heading text-green-600">{respondedCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform relative z-10">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        
        {/* Seen but Pending */}
        <div className="bg-card p-6 rounded-2xl border-l-4 border-l-amber-500 border-t border-r border-b border-border/50 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3"></div>
          <div className="relative z-10">
            <p className="text-xs font-bold text-foreground/50 uppercase tracking-wider mb-1">Pending</p>
            <h3 className="text-4xl font-extrabold font-heading text-amber-600">{seenPendingCount}</h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform relative z-10">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Quick Actions Table */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-border/50 bg-background flex justify-between items-center">
            <h2 className="text-lg font-bold font-heading">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm font-bold text-primary hover:underline flex items-center">
              View Full CRM <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/50 text-xs font-semibold text-foreground/60 uppercase tracking-wider">
                  <th className="p-4">Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Score</th>
                  <th className="p-4">Firestore Status</th>
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
                      <span className={`text-xs rounded-full px-3 py-1 font-bold ${
                        inquiry.status === 'New' ? 'bg-destructive/10 text-destructive' : 
                        inquiry.status === 'Contacted' ? 'bg-amber-500/10 text-amber-700' : 'bg-green-500/10 text-green-700'
                      }`}>
                        {inquiry.status}
                      </span>
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
            <div className="absolute top-6 bottom-6 left-9 w-px bg-border/80"></div>
            
            {loading ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
            ) : inquiries.slice(0, 8).map((inquiry, idx) => (
              <div key={inquiry.id} className="relative pl-10 mb-8 last:mb-0 group">
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