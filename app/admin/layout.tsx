"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { LayoutDashboard, Users, School, Settings, LogOut, Bell, CheckCircle2, Clock, Volume2, VolumeX, X } from "lucide-react";
import { collection, query, where, onSnapshot, orderBy, limit, deleteDoc, doc } from "firebase/firestore";
import { getDatabase, ref, set, onValue, onDisconnect, remove } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { db, app } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const isInitialLoad = useRef(true);

  // Security Guard
  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  // --- DEVICE SESSION TRACKER (Kicks out user if Super Admin revokes) ---
  useEffect(() => {
    if (!user || pathname === "/admin/login") return;

    const rtdb = getDatabase(app);
    let sessionId = localStorage.getItem("admin_session_id");
    
    if (!sessionId) {
      sessionId = crypto.randomUUID ? crypto.randomUUID() : `sess_${Date.now()}`;
      localStorage.setItem("admin_session_id", sessionId);
    }

    const sessionRef = ref(rtdb, `admin_sessions/${sessionId}`);
    
    // Register the session with device info
    set(sessionRef, {
      email: user.email,
      device: navigator.userAgent,
      loginTime: Date.now()
    });

    // Auto-remove session if the browser tab is closed
    onDisconnect(sessionRef).remove();

    // Listen to this session. If it disappears (revoked by Super Admin), Log Out immediately.
    const unsubscribeSession = onValue(sessionRef, (snapshot) => {
      if (!snapshot.exists() && !isInitialLoad.current) {
        handleLogout();
        alert("Your session was revoked by the Super Admin.");
      }
    });

    return () => unsubscribeSession();
  }, [user, pathname]);

  // Live listener for NEW inquiries
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "inquiries"), where("status", "==", "New"), orderBy("createdAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isInitialLoad.current) {
        const initialLeads: any[] = [];
        snapshot.forEach((doc) => initialLeads.push({ id: doc.id, ...doc.data() }));
        setNotifications(initialLeads);
        isInitialLoad.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();
          setUnreadCount(prev => prev + 1);

          if (!isMuted) {
            try {
              const audio = new Audio('/notificationtca.mp3');
              audio.volume = 0.8;
              audio.play().then(() => {
                audio.onended = () => {
                  const audio2 = new Audio('/notificationtca.mp3');
                  audio2.volume = 0.8;
                  audio2.play().catch(() => {});
                };
              }).catch(() => {});
            } catch (e) {}
          }

          toast.success(`New Lead: ${data.name}`, {
            description: `Prefers ${data.countries?.[0] || 'Unknown'} • NEET: ${data.neetScore}`,
            duration: 5000,
            action: { label: "View", onClick: () => window.location.href = "/admin/inquiries" }
          });
        }
      });

      const currentLeads: any[] = [];
      snapshot.forEach((doc) => currentLeads.push({ id: doc.id, ...doc.data() }));
      setNotifications(currentLeads);
    });

    return () => unsubscribe();
  }, [user, isMuted]);

  // --- THE CLEAR & UNDO LOGIC ---
  const handleClearNotification = (e: React.MouseEvent, id: string, name: string) => {
    e.preventDefault(); 
    e.stopPropagation();

    const previousState = [...notifications];
    setNotifications(prev => prev.filter(n => n.id !== id));

    const deleteTimer = setTimeout(async () => {
      try {
        await deleteDoc(doc(db, "inquiries", id));
      } catch (error) {
        console.error("Failed to delete notification.");
      }
    }, 3000);

    toast(`Cleared alert for ${name}`, {
      duration: 3000,
      action: {
        label: "Undo",
        onClick: () => {
          clearTimeout(deleteTimer);
          setNotifications(previousState);
          toast.success("Restored alert.");
        }
      }
    });
  };

  const handleLogout = async () => {
    // Remove session from DB before logging out
    const sessionId = localStorage.getItem("admin_session_id");
    if (sessionId) {
      await remove(ref(getDatabase(app), `admin_sessions/${sessionId}`));
      localStorage.removeItem("admin_session_id");
    }
    const auth = getAuth(app);
    await signOut(auth);
    router.push("/admin/login");
  };

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    setUnreadCount(0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-heading font-bold text-foreground/60 animate-pulse">Verifying Credentials...</p>
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;
  if (!user) return null;

  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Inquiries", href: "/admin/inquiries", icon: Users },
    { name: "Colleges", href: "/admin/colleges", icon: School },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background font-sans overflow-hidden">
      
      {/* ========================================= */}
      {/* SIDEBAR (FULL, UNCUT)                     */}
      {/* ========================================= */}
      <aside className="w-64 bg-primary text-primary-foreground flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-primary-foreground/10 bg-primary/50">
          <Image src="/logo.png" alt="Logo" width={180} height={50} className="h-10 w-auto brightness-0 invert opacity-90" />
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
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 bg-destructive/10 text-destructive-foreground hover:bg-destructive hover:shadow-md rounded-xl font-medium transition-all duration-200">
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>
      
      {/* ========================================= */}
      {/* MAIN CONTENT AREA                         */}
      {/* ========================================= */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background relative">
        <header className="h-20 bg-card border-b border-border/40 flex items-center justify-between px-8 shadow-sm relative z-50">
          <h1 className="text-2xl font-bold text-foreground font-heading hidden md:block">
            {navLinks.find(l => l.href === pathname)?.name || "Dashboard"}
          </h1>
          
          <div className="flex items-center gap-6 ml-auto">
            
            <button onClick={() => setIsMuted(!isMuted)} className="text-foreground/50 hover:text-foreground transition-colors">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* NOTIFICATION BELL */}
            <div className="relative">
              <button onClick={handleOpenNotifications} className="relative p-2.5 rounded-full bg-background hover:bg-accent/10 text-foreground/70 hover:text-accent transition-colors border border-border/50">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 flex items-center justify-center bg-destructive text-[10px] font-bold text-white rounded-full border-2 border-card animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-card rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] border border-border/50 overflow-hidden z-[999] animate-in slide-in-from-top-2">
                  <div className="p-4 border-b border-border/40 bg-background/50 flex justify-between items-center relative z-10">
                    <h3 className="font-bold text-sm">Action Required</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">{notifications.length} Pending</span>
                  </div>
                  
                  <div className="max-h-[350px] overflow-y-auto bg-background">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-foreground/50 text-sm flex flex-col items-center">
                        <CheckCircle2 className="w-8 h-8 text-green-500/50 mb-2" /> Inbox Zero!
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="relative group block p-4 border-b border-border/40 hover:bg-muted/30 transition-colors">
                          <Link href="/admin/inquiries" onClick={() => setShowNotifications(false)} className="block pr-6">
                            <p className="text-sm font-bold text-foreground mb-1">{notif.name}</p>
                            <p className="text-xs text-foreground/60 mb-2">Prefers {notif.countries?.[0]} • Score: {notif.neetScore}</p>
                            <p className="text-[10px] text-destructive flex items-center gap-1 font-bold uppercase"><Clock className="w-3 h-3" /> Waiting for reply</p>
                          </Link>
                          <button 
                            onClick={(e) => handleClearNotification(e, notif.id, notif.name)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100"
                            title="Clear this alert"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 bg-muted/20 text-center border-t border-border/40 relative z-10">
                    <Link href="/admin/inquiries" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-primary hover:underline">Open Full CRM</Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-6 border-l border-border/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm border border-primary/20">
                {user.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-foreground leading-tight">
                  {user.email === "tcagroup786@gmail.com" ? "Super Admin" : "Team Member"}
                </p>
                <p className="text-xs text-foreground/60 font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8 bg-muted/20">
          {children}
        </div>
      </main>
      <Toaster position="bottom-left" richColors theme="light" />
    </div>
  );
}