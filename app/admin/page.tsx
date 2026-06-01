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

    return () => { unsubInquiries(); unsubVisits(); };
  }, []);

  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Activity className="w-10 h-10 text-blue-600 animate-bounce" />
      </div>
    );
  }

  const conversionRate = stats.totalViews > 0 
    ? ((stats.totalLeads / stats.totalViews) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Welcome back. Here is what is happening with your traffic.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
          <AlertCircle className="w-4 h-4" />
          Real-time stats based from June 1, 2026
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-50 rounded-xl text-blue-600"><Users className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Leads</p>
            <h3 className="text-3xl font-black text-gray-900 leading-tight">{stats.totalLeads}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-red-50 rounded-xl text-red-600"><div className="w-6 h-6 flex items-center justify-center font-black text-xl">!</div></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Unread Leads</p>
            <h3 className="text-3xl font-black text-gray-900 leading-tight">{stats.newLeads}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-50 rounded-xl text-indigo-600"><Eye className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Unique Devices</p>
            <h3 className="text-3xl font-black text-gray-900 leading-tight">{stats.totalViews}</h3>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 rounded-xl text-emerald-600"><TrendingUp className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Conversion</p>
            <h3 className="text-3xl font-black text-gray-900 leading-tight">{conversionRate}%</h3>
          </div>
        </div>
      </div>

      {/* Recent Leads Preview */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
          <Link href="/admin/inquiries" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-xs uppercase tracking-wider font-bold text-gray-500">
                <th className="p-4 pl-6">Name</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 pl-6 font-bold text-gray-900">{lead.name}</td>
                  <td className="p-4 text-gray-600 font-medium">{lead.phone}</td>
                  <td className="p-4 text-gray-500">
                    {lead.createdAt?.toDate ? lead.createdAt.toDate().toLocaleDateString() : 'Recent'}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      lead.status === 'New' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {lead.status || 'New'}
                    </span>
                  </td>
                </tr>
              ))}
              {recentLeads.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">No recent leads found since June 1, 2026.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}