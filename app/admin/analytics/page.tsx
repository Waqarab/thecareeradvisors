"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { db, app } from "@/firebase/config";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import { Activity, Globe, Users, MousePointerClick, BarChart3, TrendingUp, AlertCircle } from "lucide-react";

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'total';

// CLEAN SLATE DATE
const TRACKING_START_DATE = new Date("2026-06-01T00:00:00Z").getTime();

const parseDate = (val: any) => {
  if (!val) return new Date();
  if (val.toDate) return val.toDate();
  return new Date(val);
};

export default function AnalyticsPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');

  useEffect(() => {
    let inquiriesLoaded = false;
    let viewsLoaded = false;

    // Fetch Inquiries (Filtered by June 1)
    const unsubInquiries = onSnapshot(query(collection(db, "inquiries")), (snapshot) => {
      const rawInquiries: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (parseDate(data.createdAt).getTime() >= TRACKING_START_DATE) {
          rawInquiries.push({ id: doc.id, ...data });
        }
      });
      setInquiries(rawInquiries);
      inquiriesLoaded = true;
      if (viewsLoaded) setLoading(false);
    });

    // Fetch Views (Filtered by June 1)
    const unsubVisits = onValue(ref(getDatabase(app), 'stats/page_views'), (snapshot) => {
      const rawViews: any[] = [];
      if (snapshot.exists()) {
        snapshot.forEach((dateNode) => {
          const dateKey = dateNode.key as string;
          // Only pull from folders created on or after June 1, 2026
          if (new Date(dateKey).getTime() >= new Date("2026-06-01").getTime()) {
            dateNode.forEach((viewNode) => {
              const val = viewNode.val();
              rawViews.push({ 
                id: viewNode.key, 
                date: dateKey,
                source: val.source || "Direct / Other",
                timestamp: val.timestamp || dateKey 
              });
            });
          }
        });
      }
      setPageViews(rawViews);
      viewsLoaded = true;
      if (inquiriesLoaded) setLoading(false);
    });

    return () => { unsubInquiries(); unsubVisits(); };
  }, []);

  const filteredData = useMemo(() => {
    const now = new Date().getTime();
    const cutoffs = {
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000,
      monthly: 30 * 24 * 60 * 60 * 1000,
      yearly: 365 * 24 * 60 * 60 * 1000,
      total: Infinity
    };

    const cutoff = cutoffs[timeRange];
    const filteredInquiries = inquiries.filter(i => (now - parseDate(i.createdAt).getTime()) <= cutoff);
    const filteredViews = pageViews.filter(v => (now - parseDate(v.timestamp).getTime()) <= cutoff);

    const COLORS = {
      'Instagram': '#e1306c', 'Facebook': '#1877f2', 'WhatsApp': '#25d366', 
      'Meta Ads': '#8b5cf6', 'Google Search': '#fbbc05', 'Direct / Other': '#94a3b8'
    };

    const categorizeSource = (s: string) => {
      const str = (s || "").toLowerCase();
      if (str.includes('instagram') || str.includes('ig')) return 'Instagram';
      if (str.includes('facebook') || str.includes('fb')) return 'Facebook';
      if (str.includes('whatsapp') || str.includes('wa')) return 'WhatsApp';
      if (str.includes('meta') || str.includes('ad')) return 'Meta Ads';
      if (str.includes('google') || str.includes('search')) return 'Google Search';
      return 'Direct / Other';
    };

    const groupSources = (arr: any[]) => {
      const counts = arr.reduce((acc, item) => {
        const s = categorizeSource(item.source);
        acc[s] = (acc[s] || 0) + 1;
        return acc;
      }, {});
      return Object.keys(counts).map(key => ({
        name: key, value: counts[key as keyof typeof counts], color: COLORS[key as keyof typeof COLORS] || COLORS['Direct / Other']
      })).sort((a, b) => b.value - a.value);
    };

    const statusCounts = filteredInquiries.reduce((acc, lead) => {
      const status = lead.status || "New";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      leads: filteredInquiries.length,
      views: filteredViews.length,
      leadSources: groupSources(filteredInquiries),
      viewSources: groupSources(filteredViews),
      funnel: [
        { name: 'New', value: statusCounts["New"] || 0, color: '#ef4444' },
        { name: 'Contacted', value: statusCounts["Contacted"] || 0, color: '#f59e0b' },
        { name: 'Resolved', value: statusCounts["Resolved"] || 0, color: '#10b981' },
      ]
    };
  }, [inquiries, pageViews, timeRange]);

  const conversionRate = filteredData.views > 0 ? ((filteredData.leads / filteredData.views) * 100).toFixed(1) : "0.0";

  if (loading) {
    return (
      <div className="h-[60vh] w-full flex items-center justify-center">
        <Activity className="w-10 h-10 text-blue-600 animate-bounce" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 p-6 max-w-7xl mx-auto">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Performance Analytics</h1>
            <span className="flex items-center gap-1.5 text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-md uppercase tracking-wider">
              <AlertCircle className="w-3 h-3" /> Data from June 1, 2026
            </span>
          </div>
          <p className="text-gray-500 mt-1 font-medium">Track unique devices, lead sources, and overall conversion metrics.</p>
        </div>

        <div className="bg-gray-100/50 p-1.5 rounded-xl border border-gray-200 shadow-inner inline-flex overflow-x-auto">
          {(['daily', 'weekly', 'monthly', 'yearly', 'total'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                timeRange === range ? 'bg-blue-600 text-white shadow-md scale-100' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-indigo-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Unique Devices</p>
              <h3 className="text-5xl font-black text-gray-900">{filteredData.views}</h3>
            </div>
            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600"><Globe className="w-6 h-6" /></div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-blue-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Total Leads</p>
              <h3 className="text-5xl font-black text-gray-900">{filteredData.leads}</h3>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><Users className="w-6 h-6" /></div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 bg-emerald-50 w-24 h-24 rounded-full group-hover:scale-110 transition-transform duration-500" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Visit to Lead Conv.</p>
              <h3 className="text-5xl font-black text-gray-900">{conversionRate}%</h3>
            </div>
            <div className="p-3 bg-emerald-100 rounded-xl text-emerald-600"><TrendingUp className="w-6 h-6" /></div>
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TRAFFIC SOURCES */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-1">
          <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Where are views coming from?</h3>
            <Globe className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={filteredData.viewSources} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                  {filteredData.viewSources.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip formatter={(value) => `${value} views`} contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6 max-h-48 overflow-y-auto pr-2">
            {filteredData.viewSources.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-gray-700">{item.name}</span>
                </div>
                <span className="font-black text-gray-900">{item.value}</span>
              </div>
            ))}
            {filteredData.viewSources.length === 0 && <p className="text-center text-sm text-gray-500 font-medium">No traffic data for this period.</p>}
          </div>
        </div>

        {/* LEAD SOURCES */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-1">
          <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Where do leads originate?</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={filteredData.leadSources} cx="50%" cy="50%" innerRadius={65} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                  {filteredData.leadSources.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip formatter={(value) => `${value} leads`} contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6 max-h-48 overflow-y-auto pr-2">
            {filteredData.leadSources.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-gray-700">{item.name}</span>
                </div>
                <span className="font-black text-gray-900">{item.value}</span>
              </div>
            ))}
            {filteredData.leadSources.length === 0 && <p className="text-center text-sm text-gray-500 font-medium">No leads for this period.</p>}
          </div>
        </div>

        {/* CRM FUNNEL */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-1">
          <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900">Lead Status Pipeline</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.funnel} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#374151', fontWeight: 700 }} width={80} />
                <RechartsTooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}/>
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={32}>
                  {filteredData.funnel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}