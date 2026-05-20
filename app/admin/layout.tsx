"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { LayoutDashboard, Users, School, Settings, LogOut, Bell, CheckCircle2, Clock } from "lucide-react";
import { collection, query, where, onSnapshot, orderBy, limit } from "firebase/firestore";
import { db } from "@/firebase/config";

// Toast Imports
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Ref to track if it's the first time the page loads
  const isInitialLoad = useRef(true);

  // Live listener for NEW inquiries + Live Toasts
  useEffect(() => {
    const q = query(
      collection(db, "inquiries"), 
      where("status", "==", "New"), 
      orderBy("createdAt", "desc"),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // 1. Handle Initial Page Load (Don't spam toasts)
      if (isInitialLoad.current) {
        const initialLeads: any[] = [];
        snapshot.forEach((doc) => initialLeads.push({ id: doc.id, ...doc.data() }));
        setNotifications(initialLeads);
        isInitialLoad.current = false;
        return;
      }

      // 2. Handle Live Changes (Trigger Toasts only for "added" documents)
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          // Trigger the bottom-left notification
          toast.success(`1 New Inquiry: ${data.name}`, {
            description: `Prefers ${data.countries?.[0] || 'Unknown'} • NEET Score: ${data.neetScore}`,
            duration: 5000,
            action: {
              label: "View",
              onClick: () => window.location.href = "/admin/inquiries"
            }
          });
        }
      });

      // 3. Update the dropdown bell state
      const currentLeads: any[] = [];
      snapshot.forEach((doc) => currentLeads.push({ id: doc.id, ...doc.data() }));
      setNotifications(currentLeads);
    });

    return () => unsubscribe();
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Inquiries", href: "/admin/inquiries", icon: Users },
    { name: "Colleges", href: "/admin/colleges", icon: School },
    { name: "Settings", href: "#", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-primary-foreground/10 bg-primary/50">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={180} 
            height={50} 
            className="h-10 w-auto brightness-0 invert opacity-90" 
          />
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive ? "bg-card text-primary shadow-sm" : "text-primary-foreground/80 hover:bg-primary-foreground/10"
                }`}
              >
                <link.icon className="w-5 h-5" /> {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-primary-foreground/10">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 bg-destructive/10 text-destructive-foreground hover:bg-destructive hover:shadow-md rounded-xl font-medium transition-all duration-200">
            <LogOut className="w-5 h-5" /> Logout
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background relative">
        
        {/* TOP HEADER */}
        <header className="h-20 bg-card border-b border-border/40 flex items-center justify-between px-8 shadow-sm z-10">
          <h1 className="text-2xl font-bold text-foreground font-heading hidden md:block">
            {navLinks.find(l => l.href === pathname)?.name || "Dashboard"}
          </h1>
          
          <div className="flex items-center gap-6 ml-auto">
            
            {/* NOTIFICATION BELL */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 rounded-full bg-background hover:bg-accent/10 text-foreground/70 hover:text-accent transition-colors border border-border/50"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-destructive rounded-full border-2 border-card animate-pulse"></span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-card rounded-2xl shadow-xl border border-border/50 overflow-hidden z-50 animate-in slide-in-from-top-2">
                  <div className="p-4 border-b border-border/40 bg-background/50 flex justify-between items-center">
                    <h3 className="font-bold text-sm">Recent Alerts</h3>
                    <span className="text-xs bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full font-bold">
                      {notifications.length} New
                    </span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-foreground/50 text-sm flex flex-col items-center">
                        <CheckCircle2 className="w-8 h-8 text-green-500/50 mb-2" />
                        You're all caught up!
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <Link key={notif.id} href="/admin/inquiries" onClick={() => setShowNotifications(false)} className="block p-4 border-b border-border/40 hover:bg-background transition-colors">
                          <p className="text-sm font-bold text-foreground mb-1">{notif.name} applied!</p>
                          <p className="text-xs text-foreground/60 mb-2">Prefers {notif.countries[0]} • Score: {notif.neetScore}</p>
                          <p className="text-[10px] text-primary flex items-center gap-1 font-semibold uppercase">
                            <Clock className="w-3 h-3" /> Just now
                          </p>
                        </Link>
                      ))
                    )}
                  </div>
                  <div className="p-3 bg-background/50 text-center border-t border-border/40">
                    <Link href="/admin/inquiries" className="text-xs font-bold text-primary hover:underline">View all inquiries</Link>
                  </div>
                </div>
              )}
            </div>

            {/* ADMIN PROFILE */}
            <div className="flex items-center gap-3 pl-6 border-l border-border/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm border border-primary/20">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-foreground leading-tight">Admin User</p>
                <p className="text-xs text-foreground/60 font-medium">admin@thecareeradvisors.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          {children}
        </div>
      </main>

      {/* GLOBAL TOAST CONTAINER (Positioned Bottom Left) */}
      <Toaster position="bottom-left" richColors theme="light" />
    </div>
  );
}