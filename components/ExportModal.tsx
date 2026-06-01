"use client";

import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { toast } from 'sonner';

// Define the types to stop the TypeScript errors
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiries: any[]; 
  inquiryMeta?: Record<string, any>;
}

export default function ExportModal({ 
  isOpen, 
  onClose, 
  inquiries, 
  inquiryMeta = {} 
}: ExportModalProps) {
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

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""'); 
      return `"${str}"`; 
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