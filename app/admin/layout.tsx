"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { 
  LayoutDashboard, Users, School, Settings, LogOut, Bell, 
  CheckCircle2, Clock, Volume2, VolumeX, X, BarChart3 
} from "lucide-react";
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

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  useEffect(() => {
    if (!user || pathname === "/admin/login") return;

    const rtdb = getDatabase(app);
    let sessionId = localStorage.getItem("admin_session_id");
    
    if (!sessionId) {
      sessionId = crypto.randomUUID ? crypto.randomUUID() : `sess_${Date.now()}`;
      localStorage.setItem("admin_session_id", sessionId);
    }

    const sessionRef = ref(rtdb, `admin_sessions/${sessionId}`);
    
    set(sessionRef, {
      email: user.email,
      device: navigator.userAgent,
      loginTime: Date.now()
    }).catch(err => console.error("Session setup error:", err));

    onDisconnect(sessionRef).remove();

    const unsubscribeSession = onValue(sessionRef, (snapshot) => {
      if (!snapshot.exists() && !isInitialLoad.current) {
        alert("Your session was revoked by the Super Admin.");
        handleLogout();
      }
    });

    return () => unsubscribeSession();
  }, [user, pathname]);

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
              audio.play().catch(() => {});
            } catch (e) {}
          }

          toast.success(`New Lead: ${data.name}`, {
            description: `Prefers ${data.countries?.[0] || 'Unknown'} • Source: ${data.source || 'Direct'}`,
            duration: 5000,
            action: { label: "View", onClick: () => window.location.href = "/admin/inquiries" }
          });
        }
      });

      const currentLeads: any[] = [];
      snapshot.forEach((doc) => currentLeads.push({ id: doc.id, ...doc.data() }));
      setNotifications(currentLeads);
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, [user, isMuted]);

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
    try {
      const sessionId = localStorage.getItem("admin_session_id");
      if (sessionId) {
        await remove(ref(getDatabase(app), `admin_sessions/${sessionId}`));
        localStorage.removeItem("admin_session_id");
      }
      
      const auth = getAuth(app);
      await signOut(auth);
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      window.location.href = "/admin/login";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="font-bold text-gray-500 animate-pulse tracking-widest uppercase text-xs">Authenticating...</p>
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;
  if (!user) return null;

  const navLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 }, // ADDED ANALYTICS
    { name: "CRM Leads", href: "/admin/inquiries", icon: Users },
    { name: "Universities", href: "/admin/colleges", icon: School },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* LIGHT SIDEBAR */}
      <aside className="w-64 bg-white text-gray-900 flex flex-col border-r border-gray-200 z-20 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-center">
          <Image src="/logo.png" alt="Logo" width={180} height={50} className="h-10 w-auto" priority />
        </div>
        
        <div className="px-4 py-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 pl-2">Main Menu</p>
          <nav className="space-y-1.5 overflow-y-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100" 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${isActive ? "text-blue-600" : "text-gray-400"}`} /> 
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 mt-auto bg-gray-50/50">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 rounded-xl font-bold transition-all shadow-sm">
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 z-50">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight hidden md:block">
            {navLinks.find(l => l.href === pathname)?.name || "Dashboard"}
          </h1>
          
          <div className="flex items-center gap-5 ml-auto">
            <button onClick={() => setIsMuted(!isMuted)} className="text-gray-400 hover:text-gray-900 transition-colors p-2 bg-gray-50 rounded-full border border-gray-200">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button onClick={() => { setShowNotifications(!showNotifications); setUnreadCount(0); }} className="relative p-2 bg-gray-50 rounded-full border border-gray-200 hover:bg-gray-100 transition-colors text-gray-600">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center bg-red-500 text-[10px] font-black text-white rounded-full border-2 border-white animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-[999] animate-in slide-in-from-top-2">
                  <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center relative z-10">
                    <h3 className="font-bold text-sm text-gray-900">Notifications</h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{notifications.length} Pending</span>
                  </div>
                  
                  <div className="max-h-[350px] overflow-y-auto bg-white">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center">
                        <CheckCircle2 className="w-8 h-8 text-green-400 mb-2" /> All caught up!
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className="relative group block p-4 border-b border-gray-50 hover:bg-blue-50/50 transition-colors">
                          <Link href="/admin/inquiries" onClick={() => setShowNotifications(false)} className="block pr-6">
                            <p className="text-sm font-bold text-gray-900 mb-1 truncate">{notif.name}</p>
                            <p className="text-xs text-gray-500 mb-2 truncate">Score: {notif.neetScore} • Via {notif.source || 'Direct'}</p>
                            <p className="text-[10px] text-red-500 flex items-center gap-1 font-bold uppercase"><Clock className="w-3 h-3" /> Waiting for reply</p>
                          </Link>
                          <button 
                            onClick={(e) => handleClearNotification(e, notif.id, notif.name)}
                            className="absolute top-4 right-4 p-1.5 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 text-center border-t border-gray-100 relative z-10">
                    <Link href="/admin/inquiries" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-blue-600 hover:underline">Open CRM</Link>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-5 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold border border-blue-200">
                {user.email?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  {user.email === "superadmintcagroup786@gmail.com" ? "Super Admin" : "Admin"}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 md:p-8 bg-gray-50/50">
          {children}
        </div>
      </main>
      <Toaster position="bottom-right" richColors theme="light" />
    </div>
  );
}