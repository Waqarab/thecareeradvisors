"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Menu, Sparkles, Bell, ExternalLink, Pin, Info } from "lucide-react";
import InquiryModal from "@/components/InquiryModal";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

export default function Navbar() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const inboxRef = useRef<HTMLDivElement>(null);

  // Close inbox when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inboxRef.current && !inboxRef.current.contains(event.target as Node)) {
        setIsInboxOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Live Notifications for the Inbox
  useEffect(() => {
    const q = query(collection(db, "notifications"), where("isActive", "==", true));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: any[] = [];
      snapshot.forEach((doc) => notifs.push({ id: doc.id, ...doc.data() }));
      
      // Sort: Pinned first, then by newest
      notifs.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      
      setNotifications(notifs);

      // Check if there are new notifications the user hasn't seen in the inbox
      const lastSeen = parseInt(localStorage.getItem("lastInboxCheck") || "0");
      const hasNew = notifs.some(n => (n.createdAt?.seconds * 1000) > lastSeen);
      setHasUnread(hasNew);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenInbox = () => {
    setIsInboxOpen(!isInboxOpen);
    if (!isInboxOpen) {
      setHasUnread(false);
      localStorage.setItem("lastInboxCheck", Date.now().toString());
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-xl saturate-[1.5] border-b border-border/50 shadow-sm transition-all duration-300">
      {/* Edge-to-Edge Layout using w-full and dynamic padding */}
      <div className="w-full mx-auto flex h-24 items-center justify-between px-4 md:px-8 xl:px-12">
        
        {/* LOGO AREA - Pushed to Absolute Left */}
        <Link href="/" className="flex items-center active:scale-95 transition-transform duration-200 group shrink-0">
          <div className="scale-[1.3] md:scale-[1.4] origin-left translate-y-1">
            <Image 
              src="/logo.png" 
              alt="The Career Advisors" 
              width={300} 
              height={100} 
              className="h-16 w-auto object-contain group-hover:opacity-80 transition-opacity" 
              priority 
            />
          </div>
        </Link>

        {/* DESKTOP NAVIGATION - Centered, High Contrast */}
        <nav className="hidden lg:flex items-center gap-2 font-heading text-sm font-bold tracking-wider text-foreground bg-muted/60 p-1.5 rounded-full border border-border shadow-inner">
          {["Home", "Universities", "Success Stories", "About Us"].map((item, i) => (
            <Link 
              key={i} 
              href={item === "Home" ? "/" : `/${item.toLowerCase().replace(" ", "-")}`} 
              className="px-5 py-2 rounded-full hover:bg-background hover:text-primary hover:shadow-md transition-all duration-300 active:scale-95"
            >
              {item}
            </Link>
          ))}
          <Link href="#faq" className="px-5 py-2 rounded-full hover:bg-background hover:text-primary hover:shadow-md transition-all duration-300 active:scale-95">
            FAQ
          </Link>
        </nav>

        {/* CTA BUTTONS - Pushed to Absolute Right */}
        <div className="flex items-center gap-4 xl:gap-6 shrink-0">
          
          {/* Phone Number (Hidden on small screens) */}
          <a href="tel:+917889708059" className="hidden xl:flex items-center gap-2 text-sm font-extrabold text-foreground hover:text-primary active:scale-95 transition-colors duration-200">
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Phone className="h-4 w-4 text-primary" />
            </div>
            <span className="font-heading tracking-wide">+91 78897 08059</span>
          </a>
          
          {/* PUBLIC NOTIFICATION INBOX */}
          <div className="relative" ref={inboxRef}>
            <button 
              onClick={handleOpenInbox}
              className={`relative p-3 rounded-full border transition-all duration-200 active:scale-95 ${isInboxOpen ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-muted hover:bg-muted/80 border-border text-foreground/70 hover:text-foreground'}`}
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-destructive rounded-full border-2 border-background animate-pulse"></span>
              )}
            </button>

            {/* Inbox Dropdown */}
            {isInboxOpen && (
              <div className="absolute right-0 mt-4 w-80 md:w-96 bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                <div className="p-4 border-b border-border/40 bg-muted/30 flex justify-between items-center">
                  <h3 className="font-extrabold font-heading text-foreground">Announcements</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">
                    {notifications.length} Active
                  </span>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-foreground/50 text-sm">
                      <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      No active announcements right now.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className={`p-4 border-b border-border/40 hover:bg-muted/20 transition-colors relative ${notif.isPinned ? 'bg-primary/5' : ''}`}>
                        {notif.isPinned && <Pin className="absolute top-4 right-4 w-3.5 h-3.5 text-primary" />}
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${notif.theme === 'destructive' ? 'bg-destructive' : notif.theme === 'success' ? 'bg-green-500' : 'bg-primary'}`}></span>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">{notif.type === 'push' ? 'Alert' : notif.type}</span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground pr-4 leading-tight">{notif.title}</h4>
                        <p className="text-xs text-foreground/70 mt-1 mb-2">{notif.message}</p>
                        
                        {notif.linkUrl && (
                          <a href={notif.linkUrl} target="_blank" className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2.5 py-1 rounded-md transition-colors w-max">
                            {notif.linkText || "View Details"} <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA */}
          <InquiryModal>
            <Button className="relative overflow-hidden rounded-full bg-destructive text-destructive-foreground hidden md:inline-flex cursor-pointer active:scale-95 transition-all duration-300 px-7 py-6 text-sm font-extrabold tracking-wide shadow-lg hover:shadow-destructive/25 group">
              <span className="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full z-0"></span>
              <span className="relative z-10 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Free Counselling
              </span>
            </Button>
          </InquiryModal>

          {/* Mobile Menu Toggle */}
          <button className="lg:hidden p-3 text-foreground active:scale-90 transition-transform duration-200 bg-muted hover:bg-muted/80 rounded-full border border-border">
            <Menu className="h-6 w-6" />
          </button>
        </div>

      </div>
    </header>
  );
}