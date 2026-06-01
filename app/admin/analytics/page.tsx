"use client";

import { useEffect, useState, useMemo } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { getDatabase, ref, onValue } from "firebase/database";
import { db, app } from "@/firebase/config";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import { Activity, Globe, Users, MousePointerClick, BarChart3 } from "lucide-react";

type TimeRange = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'total';

const parseDate = (val: any) => {
  if (!val) return new Date();
  if (val.toDate) return val.toDate();
  return new Date(val);
};

export default function AnalyticsPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('monthly');

  useEffect(() => {
    let inquiriesLoaded = false;
    let visitsLoaded = false;

    // Fetch Inquiries
    const unsubInquiries = onSnapshot(query(collection(db, "inquiries")), (snapshot) => {
      const rawInquiries: any[] = [];
      snapshot.forEach((doc) => rawInquiries.push({ id: doc.id, ...doc.data() }));
      setInquiries(rawInquiries);
      inquiriesLoaded = true;
      if (visitsLoaded) setLoading(false);
    });

    // Fetch Visits (FIXED: Flattening the nested Date -> IP Hash structure)
    const unsubVisits = onValue(ref(getDatabase(app), 'stats/visits'), (snapshot) => {
      const rawVisits: any[] = [];
      if (snapshot.exists()) {
        // Loop through each date folder (e.g., "2026-06-01")
        snapshot.forEach((dateNode) => {
          // Loop through each unique visitor IP hash inside that date
          dateNode.forEach((visitorNode) => {
            rawVisits.push({ 
              id: `${dateNode.key}-${visitorNode.key}`, 
              ...(visitorNode.val() as any) 
            });
          });
        });
      }
      setVisits(rawVisits);
      visitsLoaded = true;
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
    // Uses the timestamp saved by the tracker
    const filteredVisits = visits.filter(v => (now - parseDate(v.timestamp).getTime()) <= cutoff);

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
        const s = categorizeSource(item.source || item.referrer);
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
      traffic: filteredVisits.length, // This will now accurately reflect unique visitors
      leadSources: groupSources(filteredInquiries),
      visitSources: groupSources(filteredVisits),
      funnel: [
        { name: 'New', value: statusCounts["New"] || 0, color: '#3b82f6' },
        { name: 'Contacted', value: statusCounts["Contacted"] || 0, color: '#f59e0b' },
        { name: 'In Progress', value: statusCounts["In Progress"] || 0, color: '#8b5cf6' },
        { name: 'Converted', value: statusCounts["Converted"] || 0, color: '#10b981' },
      ]
    };
  }, [inquiries, visits, timeRange]);

  const conversionRate = filteredData.traffic > 0 ? ((filteredData.leads / filteredData.traffic) * 100).toFixed(1) : "0.0";

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center pt-20">
        <Activity className="w-10 h-10 text-blue-600 animate-bounce" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-7xl mx-auto">
      
      {/* HEADER & TABS */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Advanced Analytics</h1>
          <p className="text-gray-500 mt-1">Deep dive into unique traffic sources and conversion data.</p>
        </div>

        <div className="bg-white p-1.5 rounded-xl border border-gray-200 shadow-sm inline-flex overflow-x-auto">
          {(['daily', 'weekly', 'monthly', 'yearly', 'total'] as TimeRange[]).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                timeRange === range ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Unique Visits ({timeRange})</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{filteredData.traffic}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600"><Globe className="w-6 h-6" /></div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Leads ({timeRange})</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">{filteredData.leads}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600"><Users className="w-6 h-6" /></div>
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

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* VISIT SOURCES */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Traffic Sources</h3>
          </div>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={filteredData.visitSources} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                  {filteredData.visitSources.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip formatter={(value) => `${value} visits`} contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4 max-h-40 overflow-y-auto">
            {filteredData.visitSources.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-gray-700">{item.name}</span>
                </div>
                <span className="font-black text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LEAD SOURCES */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-1">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900">Lead Sources</h3>
          </div>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={filteredData.leadSources} cx="50%" cy="50%" innerRadius={60} outerRadius={85} paddingAngle={2} dataKey="value" stroke="none">
                  {filteredData.leadSources.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
                <RechartsTooltip formatter={(value) => `${value} leads`} contentStyle={{ borderRadius: '12px', border: '1px solid #f3f4f6' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-4 max-h-40 overflow-y-auto">
            {filteredData.leadSources.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="font-semibold text-gray-700">{item.name}</span>
                </div>
                <span className="font-black text-gray-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CRM FUNNEL */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:col-span-1">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900">Lead Pipeline</h3>
          </div>
          <div className="h-[230px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData.funnel} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f3f4f6" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#4b5563', fontWeight: 600 }} width={85} />
                <RechartsTooltip cursor={{fill: '#f9fafb'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}/>
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28}>
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