"use client";

import React, { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { db, app } from "@/firebase/config";
import { Users, Eye, TrendingUp, ArrowRight, Activity, AlertCircle } from "lucide-react";
import Link from "next/link";

// CLEAN SLATE: Only count data from this date onward
const TRACKING_START_DATE = new Date("2026-06-01T00:00:00Z").getTime();

export default function AdminOverview() {
  const [stats, setStats] = useState({ totalLeads: 0, newLeads: 0, totalViews: 0 });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotice, setShowNotice] = useState(true);

  useEffect(() => {
    let inquiriesLoaded = false;
    let visitsLoaded = false;

    // Fetch Leads from Firestore
    const q = query(collection(db, "inquiries"), orderBy("createdAt", "desc"));
    const unsubInquiries = onSnapshot(q, (snapshot) => {
      const leads: any[] = [];
      let newCount = 0;
      let totalValidLeads = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const leadTime = data.createdAt?.toDate ? data.createdAt.toDate().getTime() : new Date().getTime();

        // Only process leads that came in AFTER our tracking reset date
        if (leadTime >= TRACKING_START_DATE) {
          leads.push({ id: doc.id, ...data });
          totalValidLeads++;
          if (data.status === "New") newCount++;
        }
      });

      setStats(prev => ({ ...prev, totalLeads: totalValidLeads, newLeads: newCount }));
      setRecentLeads(leads.slice(0, 5)); // Show top 5
      inquiriesLoaded = true;
      if (visitsLoaded) setLoading(false);
    });

    // Fetch Unique Views from RTDB
    const rtdb = getDatabase(app);
    const unsubVisits = onValue(ref(rtdb, 'stats/page_views'), (snapshot) => {
      let viewCount = 0;
      if (snapshot.exists()) {
        snapshot.forEach((dateNode) => {
          // Compare the folder date (e.g., "2026-06-01") against our start date
          const folderDate = new Date(dateNode.key as string).getTime();
          if (folderDate >= new Date("2026-06-01").getTime()) {
            viewCount += dateNode.size;
          }
        });
      }
      setStats(prev => ({ ...prev, totalViews: viewCount }));
      visitsLoaded = true;
      if (inquiriesLoaded) setLoading(false);
    });

    const timer = setTimeout(() => setShowNotice(false), 5000);

    return () => { unsubInquiries(); unsubVisits(); clearTimeout(timer); };
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-50 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="font-bold text-indigo-900/40 animate-pulse tracking-widest uppercase text-[10px] mt-5">Loading Dashboard...</p>
      </div>
    );
  }

  const conversionRate = stats.totalViews > 0
    ? ((stats.totalLeads / stats.totalViews) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="bg-[#f8f9fa] min-h-[calc(100vh-4rem)] p-4 sm:p-6 lg:p-8 -m-6">
      <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500">

        {/* Header Section */}
        <div className="flex flex-col gap-2 pb-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 font-outfit">Dashboard Overview</h1>
            <div className={`transition-all duration-3000 ease-in-out ${showNotice ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
              <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 shadow-sm">
                <AlertCircle className="w-4 h-4" />
                Real-time stats based from June 1, 2026
              </div>
            </div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Welcome back. Here is what is happening with your traffic today.</p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute right-0 top-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-blue-50 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10 mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">{stats.totalLeads}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Leads</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute right-0 top-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-indigo-50 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10 mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <div className="font-black text-2xl">!</div>
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">{stats.newLeads}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unread Leads</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute right-0 top-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-violet-50 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10 mb-4">
              <div className="w-12 h-12 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                <Eye className="w-6 h-6" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">{stats.totalViews}</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Unique Devices</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-2xl p-5 border border-gray-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative">
            <div className="absolute right-0 top-0 -mr-6 -mt-6 w-24 h-24 rounded-full bg-emerald-50 transition-transform group-hover:scale-110"></div>
            <div className="flex items-center justify-between relative z-10 mb-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>
            <div className="relative z-10">
              <h3 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-1">{conversionRate}%</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Conversion</p>
            </div>
          </div>
        </div>

        {/* Recent Leads Preview */}
        <div className="bg-white rounded-2xl border border-gray-300 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-300 flex justify-between items-center">
            <h2 className="text-lg font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              Recent Inquiries
            </h2>
            <Link href="/admin/inquiries" className="text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 group">
              View All <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-gray-50/50 text-[10px] uppercase tracking-widest font-extrabold text-gray-500 border-b border-gray-300">
                  <th className="py-4 px-6 w-1/3">Name</th>
                  <th className="py-4 px-6">Phone</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-300">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors group relative">
                    <td className="py-4 px-6 font-bold text-gray-900 relative">
                      {/* Hover indicator line inside the first cell to avoid breaking columns */}
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      {lead.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600 font-medium text-xs">{lead.phone}</td>
                    <td className="py-4 px-6 text-gray-500 font-medium text-xs">
                      {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${lead.status === 'New' ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                        {lead.status || 'New'}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentLeads.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-400 font-medium text-sm">No recent leads found since June 1, 2026.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}