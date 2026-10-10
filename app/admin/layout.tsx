"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { 
  LayoutDashboard, Users, School, Settings, LogOut, Bell, 
  CheckCircle2, Clock, Volume2, VolumeX, X, BarChart3, History
} from "lucide-react";
import { collection, query, where, onSnapshot, orderBy, limit, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { getDatabase, ref, set, onValue, onDisconnect, remove, update, get } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { db, app } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { PermissionsProvider } from "@/context/PermissionsContext";

function generateSecureId(): string {
  // Preferred: crypto.randomUUID (available in all modern browsers over HTTPS and localhost)
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  // Fallback: crypto.getRandomValues — also cryptographically secure, works on older browsers
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  }

  // Last resort: Math.random — not cryptographically secure, but the case is essentially unreachable
  // in any real browser. Still, avoid Date.now() which is trivially predictable.
  const random = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return `fallback_${random}`;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const isInitialLoad = useRef(true);
  const isLoggingOut = useRef(false);
  const [role, setRole] = useState<"super-admin" | "admin" | "unknown">("unknown");

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  const handleLogout = async () => {
    isLoggingOut.current = true;
    try {
      const sessionId = localStorage.getItem("admin_session_id");
      if (sessionId) {
        await remove(ref(getDatabase(app), `admin_sessions/${sessionId}`));
        localStorage.removeItem("admin_session_id");
      }
      
      await fetch("/api/auth/session", { method: "DELETE" });
      await signOut(getAuth(app));
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      window.location.href = "/admin/login";
    }
  };

  // Super admin role is determined server-side via /api/auth/me.
  // The real email is never sent to the client.
  // Set SUPER_ADMIN_EMAIL (not NEXT_PUBLIC_) in Vercel.
  useEffect(() => {
    if (!user || pathname === "/admin/login") return;

    let cancelled = false;
    let unsubscribeSession = () => {};
    let unsubscribeRevocation = () => {};
    let heartbeat: ReturnType<typeof setInterval>;

    const setupSession = async () => {
      const rtdb = getDatabase(app);
      let sessionId = localStorage.getItem("admin_session_id");
      
      if (!sessionId) {
        sessionId = generateSecureId();
        localStorage.setItem("admin_session_id", sessionId);
      }

      let currentRole = "admin";
      try {
        const r = await fetch("/api/auth/me", { cache: "no-store", headers: { 'Cache-Control': 'no-cache' } });
        if (r.status === 401) {
          handleLogout();
          if (!cancelled) setRole("unknown");
          return;
        }
        if (r.ok) {
          const data = await r.json();
          currentRole = data.role === "super-admin" ? "super-admin" : "admin";
        }
      } catch (err) {
        console.warn("Failed to fetch role", err);
      }

      if (!cancelled) setRole(currentRole as "super-admin" | "admin");
      if (cancelled) return;

      if (currentRole === "super-admin") {
        try {
          const snap = await get(ref(rtdb, 'admin_sessions'));
          const sessions = snap.val() || {};
          
          for (const [sid, s] of Object.entries(sessions)) {
            if ((s as Record<string, unknown>).uid === user.uid && sid !== sessionId) {
              await remove(ref(rtdb, `admin_sessions/${sid}`));
            }
          }
        } catch (err) {
          console.warn("Failed to cleanup old super admin sessions:", err);
        }
      }

      if (cancelled) return;

      const sessionRef = ref(rtdb, `admin_sessions/${sessionId}`);
      
      set(sessionRef, {
        email: user.email,
        device: navigator.userAgent,
        loginTime: Date.now(),
        lastSeen: Date.now(),
        connected: true,
        uid: user.uid
      }).catch(err => console.error("Session setup error:", err));

      onDisconnect(sessionRef).update({
        connected: false,
        lastSeen: Date.now()
      });

      unsubscribeSession = onValue(sessionRef, (snapshot) => {
        if (!snapshot.exists() && !isInitialLoad.current && !isLoggingOut.current) {
          toast.error("You've been signed out — your account was used on another device.");
          handleLogout();
        }
      });

      const revocationRef = ref(rtdb, `admin_revocations/${user.uid}`);
      unsubscribeRevocation = onValue(revocationRef, async (snap) => {
        if (!snap.exists()) return;
        const data = snap.val() as { revokedAt?: number; reason?: string };
        if (!data?.revokedAt) return;

        const lastSignInMs = user.metadata.lastSignInTime
          ? new Date(user.metadata.lastSignInTime).getTime()
          : 0;
        const sessionStartedAt = lastSignInMs;
        if (data.revokedAt <= sessionStartedAt) return;

        try {
          await user.getIdToken(true); // force refresh — will fail if truly revoked
        } catch {
          // expected — token refresh fails because refresh tokens were revoked
        }

        toast.error(
          data.reason === "account_deleted"
            ? "Your admin account has been removed. You will be signed out."
            : "Your permissions were updated. Please sign in again to continue."
        );
        handleLogout();
      });

      heartbeat = setInterval(() => {
        update(sessionRef, { lastSeen: Date.now(), connected: true }).catch(() => {});
      }, 60000);
    };

    setupSession();

    return () => {
      cancelled = true;
      unsubscribeSession();
      unsubscribeRevocation();
      if (heartbeat) clearInterval(heartbeat);
    };
  }, [user, pathname]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "inquiries"), where("status", "==", "New"), orderBy("createdAt", "desc"), limit(10));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (isInitialLoad.current) {
        isInitialLoad.current = false;
        return;
      }

      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const data = change.doc.data();



          toast.success(`New Lead: ${data.name}`, {
            description: `Prefers ${data.countries?.[0] || 'Unknown'} • Source: ${data.source || 'Direct'}`,
            duration: 5000,
            action: { label: "View", onClick: () => window.location.href = "/admin/inquiries" }
          });
        }
      });
    }, (error) => {
      console.error("Firestore Error:", error);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-indigo-50 rounded-full"></div>
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
        <p className="font-bold text-indigo-900/40 animate-pulse tracking-widest uppercase text-[10px] mt-5">Authenticating...</p>
      </div>
    );
  }

  if (pathname === "/admin/login") return <>{children}</>;
  if (!user) return null;

  const mainLinks = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "CRM Leads", href: "/admin/inquiries", icon: Users },
    { name: "Universities", href: "/admin/colleges", icon: School },
  ];

  const systemLinks = [
    { name: "Settings", href: "/admin/settings", icon: Settings },
    { name: "Recycle Bin", href: "/admin/recycle-bin", icon: History },
  ];

  return (
    <PermissionsProvider>
      <div className="flex h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* PREMIUM SIDEBAR */}
      <aside className="w-72 bg-white text-gray-900 hidden md:flex flex-col border-r border-gray-200/60 z-20 shadow-[2px_0_12px_rgba(0,0,0,0.02)] relative">
        
        {/* LOGO AREA */}
        <div className="px-8 h-20 border-b border-gray-100 flex items-center bg-white justify-start">
          <Image src="/logo.png" alt="Logo" width={180} height={50} className="h-9 w-auto" priority />
        </div>
        
        {/* NAVIGATION */}
        <div className="px-4 py-6 flex-1 overflow-y-auto flex flex-col gap-8">
          
          {/* MAIN MENU */}
          <div>
            <div className="flex items-center gap-3 mb-3 px-3">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Main Menu</p>
            </div>
            <nav className="space-y-1">
              {mainLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold transition-all duration-200 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isActive 
                        ? "text-indigo-700 bg-indigo-50/80 border border-indigo-100" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                    }`}
                  >
                    {/* Strong Active Indicator */}
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 bg-indigo-600 rounded-r-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>}
                    
                    <div className="flex items-center justify-center">
                      <link.icon 
                        className={`w-5 h-5 transition-colors duration-200 ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500"}`} 
                        fill={isActive ? "currentColor" : "none"} 
                        stroke={isActive ? "currentColor" : "currentColor"} 
                      /> 
                    </div>
                    <span className="relative z-10 text-[14px] tracking-wide font-outfit">{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* SYSTEM MENU */}
          <div>
            <div className="flex items-center gap-3 mb-3 px-3">
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">System</p>
            </div>
            <nav className="space-y-1">
              {systemLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    className={`flex items-center gap-3.5 px-4 py-3 rounded-xl font-bold transition-all duration-200 relative group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      isActive 
                        ? "text-indigo-700 bg-indigo-50/80 border border-indigo-100" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                    }`}
                  >
                    {/* Strong Active Indicator */}
                    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-6 bg-indigo-600 rounded-r-full shadow-[0_0_8px_rgba(79,70,229,0.5)]"></div>}
                    
                    <div className="flex items-center justify-center">
                      <link.icon 
                        className={`w-5 h-5 transition-colors duration-200 ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-indigo-500"}`} 
                        fill={isActive ? "currentColor" : "none"}
                        stroke={isActive ? "currentColor" : "currentColor"} 
                      /> 
                    </div>
                    <span className="relative z-10 text-[14px] tracking-wide font-outfit">{link.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="p-4 mt-auto">
          <div className="h-[1px] bg-gray-100 w-full mb-4"></div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-2.5 w-full text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 text-sm group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Sign Out
          </button>
        </div>
      </aside>
      
      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-[#f8f9fa]">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 md:px-8 flex items-center justify-end z-50 shrink-0 shadow-sm">
          <div className="flex items-center gap-4">


            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-[13px] font-bold text-gray-900 leading-tight">
                  {role === "unknown" ? "Loading..." : role === "super-admin" ? "Super Admin" : "Admin"}
                </p>
                <p className="text-[10px] text-gray-500 truncate max-w-[120px]">{user.email}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200/50 text-sm">
                {user.email?.charAt(0).toUpperCase() || "A"}
              </div>
            </div>
          </div>
        </header>

        <div key={pathname} className="flex-1 overflow-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500 ease-out">
          {children}
        </div>
      </main>
      <Toaster position="bottom-left" richColors theme="light" />
    </div>
    </PermissionsProvider>
  );
}