"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Menu, Sparkles, Bell, ExternalLink, Pin, Info, X, ChevronRight } from "lucide-react";
import InquiryModal from "@/components/InquiryModal";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { AnimatePresence, motion, Variants } from "framer-motion";

export default function Navbar() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

// Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    // --- ADD THIS EXACT LINE HERE ---
    window.dispatchEvent(new CustomEvent('mobileMenuToggle', { detail: isMobileMenuOpen }));

    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  // Fetch Notifications
  useEffect(() => {
    const q = query(collection(db, "notifications"), where("isActive", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: any[] = [];
      snapshot.forEach((doc) => notifs.push({ id: doc.id, ...doc.data() }));
      notifs.sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });
      setNotifications(notifs);
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

  const navLinks = ["Home", "Universities", "Success Stories", "About", "FAQ", "Resources"];

  // --- LIGHTNING FAST HARDWARE-ACCELERATED VARIANTS ---
  // We use "x" (translate3d) instead of heavy blurs for absolute maximum framerate
  const overlayVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const drawerVariants: Variants = {
    hidden: { x: "100%" },
    visible: { 
      x: 0, 
      transition: { type: "spring", bounce: 0, duration: 0.3 } // Bounce: 0 prevents jitter, keeps it snappy
    },
    exit: { 
      x: "100%", 
      transition: { type: "spring", bounce: 0, duration: 0.3 } 
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-xl saturate-[1.5] border-b border-border/50 shadow-sm transition-all duration-300">
        {/* Changed h-20 to h-16 on mobile for a tighter fit */}
        <div className="w-full mx-auto flex h-16 md:h-24 items-center justify-between px-4 md:px-8 xl:px-12 relative z-50">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center active:scale-95 transition-transform duration-200 shrink-0 z-50">
            <div className="scale-[1.05] md:scale-[1.4] origin-left">
              <Image src="/logo.png" alt="The Career Advisors" width={300} height={100} className="h-10 md:h-16 w-auto object-contain" priority />
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center gap-2 font-heading text-sm font-bold tracking-wider text-foreground bg-muted/60 p-1.5 rounded-full border border-border shadow-inner">
            {navLinks.map((item, i) => (
              <Link 
                key={i} 
                href={item === "Home" ? "/" : item === "FAQ" ? "#faq" : `/${item.toLowerCase().replace(" ", "-")}`} 
                className="px-5 py-2 rounded-full hover:bg-background hover:text-primary hover:shadow-md transition-all duration-300 active:scale-95"
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* CTA BUTTONS */}
          <div className="flex items-center gap-3 xl:gap-6 shrink-0 z-50">
            
            <a href="tel:+916005152350" className="hidden xl:flex items-center gap-2 text-sm font-extrabold text-foreground hover:text-primary transition-colors">
              <div className="w-9 h-9 rounded-full bg-primary/10 border flex items-center justify-center"><Phone className="h-4 w-4 text-primary" /></div>
              <span className="font-heading">+916005152350</span>
            </a>
            
            {/* NOTIFICATION INBOX */}
            <div className="relative" ref={inboxRef}>
              <button onClick={handleOpenInbox} className={`relative p-2 md:p-3 rounded-full border transition-all duration-200 active:scale-95 ${isInboxOpen ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-muted hover:bg-muted/80 text-foreground/70 hover:text-foreground'}`}>
                <Bell className="w-4 h-4 md:w-5 md:h-5" />
                {hasUnread && <span className="absolute top-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-destructive rounded-full border-2 border-background animate-pulse"></span>}
              </button>

              {isInboxOpen && (
                <div className="absolute right-0 mt-4 w-[300px] md:w-96 bg-card rounded-2xl shadow-2xl border border-border/50 overflow-hidden z-50 animate-in slide-in-from-top-2 fade-in duration-200">
                  <div className="p-4 border-b bg-muted/30 flex justify-between items-center">
                    <h3 className="font-extrabold font-heading">Announcements</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">{notifications.length} Active</span>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-foreground/50 text-sm"><Info className="w-8 h-8 mx-auto mb-2 opacity-50" />No active announcements right now.</div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`p-4 border-b hover:bg-muted/20 transition-colors relative ${notif.isPinned ? 'bg-primary/5' : ''}`}>
                          {notif.isPinned && <Pin className="absolute top-4 right-4 w-3 h-3 text-primary" />}
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-2 h-2 rounded-full ${notif.theme === 'destructive' ? 'bg-destructive' : notif.theme === 'success' ? 'bg-green-500' : 'bg-primary'}`}></span>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">{notif.type === 'push' ? 'Alert' : notif.type}</span>
                          </div>
                          <h4 className="font-bold text-sm text-foreground pr-4 leading-tight">{notif.title}</h4>
                          <p className="text-xs text-foreground/70 mt-1 mb-2">{notif.message}</p>
                          {notif.linkUrl && (
                            <a href={notif.linkUrl} target="_blank" className="inline-flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 hover:bg-primary/20 px-2 py-1 rounded-md">
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

            <InquiryModal>
              <Button className="rounded-full bg-destructive text-destructive-foreground hidden md:inline-flex active:scale-95 transition-all duration-300 px-6 py-5 text-sm font-extrabold shadow-lg hover:shadow-destructive/25 group">
                <Sparkles className="w-4 h-4 mr-2" /> Get Free Counselling
              </Button>
            </InquiryModal>

            {/* MOBILE MENU TOGGLE BUTTON */}
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 text-foreground active:scale-90 transition-transform duration-200 bg-muted hover:bg-muted/80 rounded-full border border-border"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========================================= */}
      {/* LIGHTNING FAST MOBILE SIDE-DRAWER         */}
      {/* ========================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* FAST SOLID OVERLAY (NO BLUR) - Clicks outside close the menu */}
            <motion.div 
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-[90] bg-black/60"
            />

            {/* SLEEK 80% WIDTH SIDE DRAWER */}
            <motion.div 
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 right-0 bottom-0 z-[100] w-[85%] max-w-[320px] bg-background shadow-2xl flex flex-col border-l border-border/50"
            >
              {/* Top Bar inside Menu */}
              <div className="flex items-center justify-between p-4 px-6 border-b border-border/20">
                <div className="scale-90 origin-left">
                  <Image src="/logo.png" alt="The Career Advisors" width={150} height={60} className="h-8 w-auto object-contain" priority />
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 bg-muted rounded-full text-foreground hover:bg-destructive hover:text-white transition-colors active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto py-6 px-6 flex flex-col gap-2">
                {navLinks.map((item, i) => (
                  <Link 
                    key={i}
                    href={item === "Home" ? "/" : item === "FAQ" ? "#faq" : `/${item.toLowerCase().replace(" ", "-")}`} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between py-4 border-b border-border/30 text-xl font-black font-heading text-foreground hover:text-primary active:text-primary transition-colors group"
                  >
                    <span>{item}</span>
                    <ChevronRight className="w-5 h-5 text-foreground/20 group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </nav>

              {/* Bottom Sticky Action Area */}
              <div className="p-6 bg-muted/30 border-t border-border/20 space-y-4">
                <a href="tel:+916005152350" className="flex items-center justify-center gap-2 text-sm font-extrabold text-foreground py-3 border border-border rounded-xl bg-card active:scale-95 transition-transform shadow-sm">
                  <Phone className="h-4 w-4 text-primary" /> +916005152350
                </a>
                
                <InquiryModal>
                  <Button className="w-full rounded-xl bg-destructive text-destructive-foreground py-6 text-base font-black shadow-lg shadow-destructive/20 active:scale-95 transition-transform">
                    <Sparkles className="w-4 h-4 mr-2" /> Start Free Process
                  </Button>
                </InquiryModal>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}