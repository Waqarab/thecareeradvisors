"use client";

import { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { db, app } from "@/firebase/config";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { Users, MousePointerClick, Activity, Globe, ArrowRight, ExternalLink } from "lucide-react";
import Link from "next/link";

const parseDate = (val: any) => {
  if (!val) return new Date();
  if (val.toDate) return val.toDate();
  return new Date(val);
};

export default function AdminDashboard() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyData, setDailyData] = useState<any[]>([]);

  useEffect(() => {
    let inquiriesLoaded = false;
    let visitsLoaded = false;

    // 1. FETCH ALL INQUIRIES (For Totals)
    const qAll = query(collection(db, "inquiries"));
    const unsubAll = onSnapshot(qAll, (snapshot) => {
      const rawInquiries: any[] = [];
      snapshot.forEach((doc) => rawInquiries.push({ id: doc.id, ...doc.data() }));
      setInquiries(rawInquiries);
      inquiriesLoaded = true;
      if (visitsLoaded) setLoading(false);
    });

    // 2. FETCH LATEST 5 INQUIRIES (For Recent Activity)
    const qRecent = query(collection(db, "inquiries"), orderBy("createdAt", "desc"), limit(5));
    const unsubRecent = onSnapshot(qRecent, (snapshot) => {
      const recent: any[] = [];
      snapshot.forEach((doc) => recent.push({ id: doc.id, ...doc.data() }));
      setRecentLeads(recent);
    });

    // 3. FETCH REAL VISITS (RTDB)
    const rtdb = getDatabase(app);
    const unsubVisits = onValue(ref(rtdb, 'stats/visits'), (snapshot) => {
      const rawVisits: any[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          rawVisits.push({ id: child.key, ...(child.val() as any) });
        });
      }
      setVisits(rawVisits);
      visitsLoaded = true;
      if (inquiriesLoaded) setLoading(false);
    });

    return () => { unsubAll(); unsubRecent(); unsubVisits(); };
  }, []);

  useEffect(() => {
    if (inquiries.length > 0 || visits.length > 0) {
      const last7Days = Array.from({length: 7}, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return { label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
      });

      const aggregatedData = last7Days.map(day => {
        const leadsOnDate = inquiries.filter(lead => parseDate(lead.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === day.label).length;
        const visitsOnDate = visits.filter(visit => parseDate(visit.timestamp || visit.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) === day.label).length;
        
        return { name: day.label, Visits: visitsOnDate, Leads: leadsOnDate };
      });

      setDailyData(aggregatedData);
    }
  }, [inquiries, visits]);

  const conversionRate = visits.length > 0 ? ((inquiries.length / visits.length) * 100).toFixed(1) : "0.0";

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center pt-20">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Activity className="w-10 h-10 text-blue-600 animate-bounce" />
          <p className="text-gray-500 font-medium">Syncing Real-Time Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">System Overview</h1>
          <p className="text-gray-500 mt-1">Brief summary of recent activity and traffic.</p>
        </div>
        <Link href="/admin/analytics" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
          View Detailed Analytics <ArrowRight className="w-4 h-4 text-gray-400" />
        </Link>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Traffic</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{visits.length}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Globe className="w-6 h-6" /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Leads</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{inquiries.length}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Users className="w-6 h-6" /></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Conversion Rate</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{conversionRate}%</h3>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600"><MousePointerClick className="w-6 h-6" /></div>
          </div>
        </div>
      </div>

      {/* LOWER SECTION: CHART & RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* BRIEF CHART */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Last 7 Days Traffic</h3>
            <p className="text-sm text-gray-500">Visits vs Submitted Inquiries.</p>
          </div>
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6b7280' }} />
                <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                <Area type="monotone" dataKey="Visits" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                <Area type="monotone" dataKey="Leads" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT ACTIVITY LIST */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
              <p className="text-sm text-gray-500">Latest form submissions.</p>
            </div>
            <Link href="/admin/inquiries" className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1">
              All Leads <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {recentLeads.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-8">No recent leads found.</p>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{lead.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {lead.countries?.[0] || 'Undecided'} • <span className="font-medium text-gray-700">{lead.source || 'Direct'}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${
                      lead.status === 'New' ? 'bg-blue-100 text-blue-700' :
                      lead.status === 'Converted' ? 'bg-green-100 text-green-700' :
                      'bg-gray-200 text-gray-700'
                    }`}>
                      {lead.status || 'New'}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1.5 font-medium">
                      {parseDate(lead.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}