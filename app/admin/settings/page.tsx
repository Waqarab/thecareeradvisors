"use client";

import { useState, useEffect } from "react";
import { Bell, Shield, Settings, Send, Pin, Trash2, Edit2, Loader2, CheckCircle, Eye, EyeOff, PauseCircle, PlayCircle, Link as LinkIcon, Volume2, VolumeX, Smartphone, Monitor, UserPlus, Music, AlertTriangle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db, app } from "@/firebase/config";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useAuth } from "@/context/AuthContext";
import { useConfirm } from "@/components/ui/use-confirm";
import { usePermissions } from "@/context/PermissionsContext";
import { Lock } from "lucide-react";
import { WriteGuardButton } from "@/components/ui/write-guard-button";



export default function AdminSettings() {
  const { user } = useAuth();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { guard, ready, role, canWrite } = usePermissions();
  const isRestricted = ready && role !== "super-admin" && !canWrite;

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    fetch("/api/auth/me", { cache: "no-store", headers: { 'Cache-Control': 'no-cache' } })
      .then(r => r.ok ? r.json() : { role: "admin" })
      .then(data => {
        if (!cancelled) setIsSuperAdmin(data.role === "super-admin");
      })
      .catch(() => {
        if (!cancelled) setIsSuperAdmin(false);
      });
    return () => { cancelled = true; };
  }, [user]);

  const [activeTab, setActiveTab] = useState<"notifications" | "team" | "limits">("notifications");
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { ConfirmationDialog, confirmAction } = useConfirm();

  const [dailyCap, setDailyCap] = useState<number | null>(null);
  const [capInputValue, setCapInputValue] = useState("");
  const [capAlert, setCapAlert] = useState<"warning" | "full" | null>(null);
  const [todayCount, setTodayCount] = useState<number>(0);

  useEffect(() => {
    if (!user || !isSuperAdmin) return;
    
    user.getIdToken().then(idToken => {
      fetch("/api/admin/settings", {
        headers: { "Authorization": `Bearer ${idToken}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.inquiry_daily_limit !== undefined) {
          setDailyCap(data.inquiry_daily_limit);
          setCapInputValue(data.inquiry_daily_limit.toString());
        }
      })
      .catch(console.error);
    });
  }, [user, isSuperAdmin]);

  useEffect(() => {
    const rtdb = getDatabase(app);
    const dateKey = new Date().toISOString().split("T")[0];
    const alertRef = ref(rtdb, `inquiry_alerts/${dateKey}`);
    const unsubscribeAlert = onValue(alertRef, (snapshot) => {
      if (snapshot.exists()) {
        setCapAlert(snapshot.val().level);
      } else {
        setCapAlert(null);
      }
    });
    
    const countRef = ref(rtdb, `inquiry_counts/${dateKey}`);
    const unsubscribeCount = onValue(countRef, (snapshot) => {
      if (snapshot.exists()) {
        setTodayCount(snapshot.val());
      } else {
        setTodayCount(0);
      }
    });
    
    return () => {
      unsubscribeAlert();
      unsubscribeCount();
    };
  }, []);

  const handleUpdateCap = async (e: React.FormEvent) => {
    e.preventDefault();
    const newCap = parseInt(capInputValue, 10);
    if (isNaN(newCap) || newCap < 0) {
      toast.error("Valid positive integer required.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const idToken = await user?.getIdToken();
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}` 
        },
        body: JSON.stringify({ inquiry_daily_limit: newCap })
      });
      if (res.ok) {
        toast.success("Daily limit updated!");
        setDailyCap(newCap);
      } else {
        toast.error("Failed to update daily limit.");
      }
    } catch (e) {
      toast.error("Network error.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Notification Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [theme, setTheme] = useState("primary");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  
  // NEW AUDIO STATES
  const [playSound, setPlaySound] = useState(true);
  const [soundCount, setSoundCount] = useState<1 | 2 | 3>(2);
  const [soundFile, setSoundFile] = useState("/notificationtca.mp3");

  // Team Form State
  const [teamEmail, setTeamEmail] = useState("");
  const [teamPassword, setTeamPassword] = useState("");
  const [teamCanWrite, setTeamCanWrite] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  const fetchTeamMembers = async () => {
    try {
      const res = await fetch("/api/admin/team");
      if (res.ok) {
        const data = await res.json();
        setTeamMembers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch team members");
    }
  };

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: any[] = [];
      snapshot.forEach((doc) => notifs.push({ id: doc.id, ...doc.data() }));
      setNotificationsList(notifs);
      setIsLoading(false);
    });

    if (isSuperAdmin) {
      const rtdb = getDatabase(app);
      const sessionsRef = ref(rtdb, 'admin_sessions');
      onValue(sessionsRef, (snapshot) => {
        const data = snapshot.val() || {};
        const sessionsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        
        const now = Date.now();
        const thirtyDays = 30 * 24 * 60 * 60 * 1000;
        
        const validSessions: any[] = [];
        sessionsArray.forEach(session => {
          if (session.connected === false && (now - (session.lastSeen || session.loginTime)) > thirtyDays) {
            remove(ref(rtdb, 'admin_sessions/' + session.id)).catch(() => {});
          } else {
            validSessions.push(session);
          }
        });

        validSessions.sort((a, b) => {
          if (a.connected === b.connected) {
            const timeA = a.lastSeen || a.loginTime || 0;
            const timeB = b.lastSeen || b.loginTime || 0;
            return timeB - timeA;
          }
          return a.connected ? -1 : 1;
        });

        setActiveSessions(validSessions);
      });
      fetchTeamMembers();
    }

    return () => unsubscribe();
  }, [isSuperAdmin]);

  const handleDeploy = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Heading and Message required!");
      return;
    }
    setIsSubmitting(true);

    const payload = {
      type: "inbox", theme, title, message, linkText, linkUrl, isPinned, playSound, soundCount, soundFile, updatedAt: serverTimestamp()
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, "notifications", editingId), payload);
        toast.success("Updated successfully!");
      } else {
        await addDoc(collection(db, "notifications"), {
          ...payload, isActive: true, createdAt: serverTimestamp(),
        });
        toast.success("Announcement Deployed to Navbar Inbox!");
      }
      cancelEdit();
    } catch (error) {
      toast.error("Deployment failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (notif: any) => {
    setEditingId(notif.id); setTheme(notif.theme || "primary");
    setTitle(notif.title); setMessage(notif.message); setLinkText(notif.linkText || "");
    setLinkUrl(notif.linkUrl || ""); setIsPinned(notif.isPinned || false);
    
    // Set Audio States accurately
    setPlaySound(notif.playSound !== false); 
    setSoundCount(notif.soundCount || 2);
    setSoundFile(notif.soundFile || "/notificationtca.mp3");
    
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null); setTheme("primary"); setTitle(""); 
    setMessage(""); setLinkText(""); setLinkUrl(""); setIsPinned(false);
    setPlaySound(true); setSoundCount(2); setSoundFile("/notificationtca.mp3");
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "notifications", id), { isActive: !currentStatus });
    toast.success(currentStatus ? "Announcement Paused" : "Announcement Live");
  };

  const handleDelete = async (id: string) => {
    if (await confirmAction("Delete Announcement", "Permanently delete this announcement?", { isDestructive: true, confirmText: "Delete" })) {
      await deleteDoc(doc(db, "notifications", id));
    }
  };

  const handleRevokeDevice = async (sessionId: string, sessionUid: string) => {
    if (!sessionUid || typeof sessionUid !== "string") {
      toast.error("Cannot revoke: this session is missing a user ID. It may be a stale entry from before a schema update.");
      return;
    }

    if (!(await confirmAction("Sign out", "Sign this device out of the admin panel? The user will need to log in again on this device.", { isDestructive: true, confirmText: "Sign out" }))) return;
    try {
      if (sessionUid !== user?.uid) {
        const idToken = await user?.getIdToken();
        const res = await fetch("/api/admin/revoke", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
          body: JSON.stringify({ uid: sessionUid })
        });
        
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          toast.error(body.error || `Failed to revoke session (HTTP ${res.status})`);
          return;
        }
      }

      await remove(ref(getDatabase(app), `admin_sessions/${sessionId}`));
      toast.success("Device signed out successfully.");
    } catch (error) {
      toast.error("Failed to sign out device.");
    }
  };

  const handleRevokeAllOtherDevices = async () => {
    if (!(await confirmAction("Revoke All", "Are you sure you want to kick EVERY OTHER device out of the admin panel? Your current session will remain active.", { isDestructive: true, confirmText: "Revoke All" }))) return;
    try {
      const currentSessionId = localStorage.getItem("admin_session_id");
      const rtdb = getDatabase(app);
      const idToken = await user?.getIdToken();
      
      const promises = activeSessions
        .filter(session => session.id !== currentSessionId)
        .map(async (session) => {
          if (session.uid && session.uid !== user?.uid) {
            await fetch("/api/admin/revoke", {
              method: "POST",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${idToken}` },
              body: JSON.stringify({ uid: session.uid })
            }).catch(() => {});
          }
          return remove(ref(rtdb, `admin_sessions/${session.id}`));
        });
        
      await Promise.all(promises);
      toast.success("All other devices have been revoked.");
    } catch (error) {
      toast.error("Failed to revoke some devices.");
    }
  };

  const handleToggleCanWrite = async (uid: string, newCanWrite: boolean) => {
    const previousMembers = [...teamMembers];
    setTeamMembers(teamMembers.map(m => m.uid === uid ? { ...m, canWrite: newCanWrite } : m));

    try {
      const idToken = await user?.getIdToken();
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}` 
        },
        body: JSON.stringify({ uid, canWrite: newCanWrite })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Permissions updated. The sub-admin will be signed out on their next action.");
      } else {
        setTeamMembers(previousMembers);
        toast.error(data.error || "Failed to update permissions.");
      }
    } catch (error) {
      setTeamMembers(previousMembers);
      toast.error("Network error. Could not reach server.");
    }
  };

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamEmail || teamPassword.length < 8) return toast.error("Email required and password must be 8+ chars.");
    setIsSubmitting(true);

    try {
      const idToken = await user?.getIdToken();
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}` 
        },
        body: JSON.stringify({ email: teamEmail, password: teamPassword, canWrite: teamCanWrite })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Team member account created/updated!");
        setTeamEmail(""); setTeamPassword(""); setShowPassword(false); setTeamCanWrite(false);
        fetchTeamMembers();
      } else {
        toast.error(data.error || "Failed to create user. You can only have 3 sub-admins.");
      }
    } catch (error) {
      toast.error("Network error. Could not reach server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveTeamMember = async (uid: string) => {
    if (!(await confirmAction("Remove Member", "Are you sure you want to permanently remove this team member?", { isDestructive: true, confirmText: "Remove" }))) return;
    try {
      const idToken = await user?.getIdToken();
      const res = await fetch("/api/admin/team", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}`
        },
        body: JSON.stringify({ uid })
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        fetchTeamMembers();
      } else {
        toast.error(data.error || "Failed to remove member.");
      }
    } catch (error) {
      toast.error("Network error.");
    }
  };

  const parseDevice = (ua: string) => {
    if (ua.includes("iPhone")) return "Apple iPhone";
    if (ua.includes("Android")) return "Android Phone";
    if (ua.includes("Mac OS")) return "Apple Mac";
    if (ua.includes("Windows")) return "Windows PC";
    return "Unknown Device";
  };

  // Preview sound function for admin
  const previewSound = (file: string) => {
    const audio = new Audio(file);
    audio.volume = 0.8;
    audio.play().catch(() => toast.error("Could not play sound. Make sure the file exists in your public folder."));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <ConfirmationDialog />
      <h1 className="text-3xl font-extrabold font-heading mb-8">System Settings</h1>

      <div className="flex gap-4 mb-8 border-b border-border/50 pb-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'notifications' ? 'bg-primary text-primary-foreground' : 'text-foreground/60 hover:bg-muted'}`}
        >
          <Bell className="w-4 h-4" /> Navbar Announcements
        </button>
        {isSuperAdmin && (
          <>
            <button 
              onClick={() => setActiveTab("team")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'team' ? 'bg-primary text-primary-foreground' : 'text-foreground/60 hover:bg-muted'}`}
            >
              <Shield className="w-4 h-4" /> Team & Security
            </button>
            <button 
              onClick={() => setActiveTab("limits")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'limits' ? 'bg-primary text-primary-foreground' : 'text-foreground/60 hover:bg-muted'}`}
            >
              <Activity className="w-4 h-4" /> API & Limits
            </button>
          </>
        )}
      </div>

      {capAlert && (
        <div className={`mb-6 p-4 rounded-xl border font-bold flex items-center gap-3 ${capAlert === "full" ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-orange-500/10 text-orange-600 border-orange-500/20"}`}>
          <AlertTriangle className="w-5 h-5 shrink-0" />
          {capAlert === "full" 
            ? "CRITICAL: The daily inquiry cap has been reached. Form submissions are currently disabled." 
            : "WARNING: The daily inquiry cap is at 90% or higher. Prepare for form submissions to pause."}
        </div>
      )}

      {activeTab === "notifications" ? (
        <div className="grid lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2"><Send className="w-5 h-5 text-primary" /> {editingId ? "Edit Announcement" : "Create Announcement"}</span>
                {editingId && <button onClick={cancelEdit} className="text-xs text-destructive hover:underline">Cancel</button>}
              </h2>
              
              <form onSubmit={(e) => { e.preventDefault(); handleDeploy(); }} className="space-y-5">
                <div>
                  <label className="text-sm font-bold mb-1 block">Heading</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-muted/50 border rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>

                <div>
                  <label className="text-sm font-bold mb-1 block">Message</label>
                  <textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full bg-muted/50 border rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                  <div className="col-span-2 text-xs font-bold text-foreground/60 uppercase flex items-center gap-1"><LinkIcon className="w-3 h-3"/> Document Hyperlink (Optional)</div>
                  <input type="text" placeholder="Button Text (e.g. View PDF)" value={linkText} onChange={(e) => setLinkText(e.target.value)} className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
                  <input type="url" placeholder="URL (https://...)" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full border rounded-lg p-3 text-sm outline-none focus:ring-1 focus:ring-primary" />
                </div>

                <div className="flex items-center gap-2 pt-2 cursor-pointer" onClick={() => setIsPinned(!isPinned)}>
                  <input type="checkbox" checked={isPinned} readOnly className="w-4 h-4 rounded text-primary" />
                  <label className="text-sm font-bold cursor-pointer">Pin to top of Inbox</label>
                </div>

                <WriteGuardButton action={editingId ? "update" : "create"} disabled={isSubmitting} type="submit" className="w-full py-6 text-lg rounded-xl shadow-lg">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (editingId ? "Update Announcement" : "Deploy to Navbar Inbox")}
                </WriteGuardButton>
              </form>
            </div>
          </div>

          <div className="lg:col-span-5 bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Active Announcements</h2>
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {notificationsList.map((notif) => (
                <div key={notif.id} className={`p-4 rounded-xl border relative ${notif.isActive ? 'bg-background' : 'bg-muted/50 opacity-60'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div></div>
                    <div className="flex gap-2">
                      <button type="button" onClick={(e) => guard("update", () => toggleActive(notif.id, notif.isActive), e)} title={notif.isActive ? "Hide" : "Publish"} className={isRestricted ? "opacity-60 cursor-not-allowed" : ""}>
                        {notif.isActive ? <PauseCircle className="w-4 h-4 text-orange-500 inline" /> : <PlayCircle className="w-4 h-4 text-green-500 inline" />}
                        {isRestricted && <Lock className="w-3 h-3 ml-1 opacity-70 inline" />}
                      </button>
                      <button type="button" onClick={() => handleEdit(notif)}><Edit2 className="w-4 h-4 text-primary inline" /></button>
                      <button type="button" onClick={(e) => guard("delete", () => handleDelete(notif.id), e)} className={isRestricted ? "opacity-60 cursor-not-allowed" : ""}>
                        <Trash2 className="w-4 h-4 text-destructive inline" />
                        {isRestricted && <Lock className="w-3 h-3 ml-1 opacity-70 inline" />}
                      </button>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm">{notif.title}</h3>
                  <p className="text-xs text-foreground/70 line-clamp-2 mt-1">{notif.message}</p>
                  {!notif.isActive && <p className="text-[10px] text-destructive font-bold mt-2 uppercase">Hidden from users</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "team" ? (
        <div className="grid lg:grid-cols-2 gap-8">
          
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-primary" /> Active Logins</span>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">{activeSessions.length} Devices</span>
                {activeSessions.length > 1 && (
                  <button onClick={handleRevokeAllOtherDevices} className="text-xs font-bold text-destructive bg-destructive/10 hover:bg-destructive hover:text-white px-3 py-1 rounded-lg transition-all ml-2">Revoke All Others</button>
                )}
              </div>
            </h2>
            <div className="space-y-4">
              {activeSessions.map((session) => {
                const deviceName = parseDevice(session.device);
                const isMobile = deviceName.includes("Phone") || deviceName.includes("iPhone");
                const isCurrentSession = session.id === (typeof window !== "undefined" ? localStorage.getItem("admin_session_id") : null);
                
                return (
                  <div key={session.id} className="p-4 flex-col sm:flex-row rounded-xl border border-border/50 bg-background flex sm:items-center justify-between gap-4 group hover:border-primary/50 transition-colors">
                    <div className="flex items-start sm:items-center gap-4 w-full">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground/60 shrink-0">
                        {isMobile ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-bold text-sm leading-tight text-foreground truncate">
                            {session.email}
                          </h4>
                          {isCurrentSession && <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">Current Device</span>}
                        </div>
                        <p className="text-xs text-foreground/60 truncate">{deviceName}</p>
                        <p className="text-[10px] text-foreground/40 mt-1 uppercase font-semibold truncate">
                          Logged in: {new Date(session.loginTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    {!isCurrentSession && (
                      <button 
                        onClick={() => handleRevokeDevice(session.id, session.uid)}
                        className="text-xs font-bold text-destructive bg-destructive/10 hover:bg-destructive hover:text-white px-3 py-1.5 rounded-lg transition-all shrink-0 sm:self-center self-start"
                      >
                        Sign out device
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><UserPlus className="w-5 h-5 text-primary" /> Manage Team Accounts</h2>
            <p className="text-sm text-foreground/70 mb-6">Create or reset passwords for up to 3 sub-admins. Passwords are permanently hashed in Firebase Auth.</p>
            
            <form onSubmit={handleCreateSubAdmin} className="space-y-5">
              <div>
                <label className="text-sm font-bold mb-1.5 block text-foreground">Team Member Email</label>
                <input 
                  type="email" 
                  value={teamEmail} 
                  onChange={(e) => setTeamEmail(e.target.value)} 
                  required 
                  placeholder="e.g. rohan@thecareeradvisors.in"
                  className="w-full bg-background border border-border/50 rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-foreground/30" 
                />
              </div>

              <div>
                <label className="text-sm font-bold mb-1.5 block text-foreground">New Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={teamPassword} 
                    onChange={(e) => setTeamPassword(e.target.value)} 
                    required 
                    minLength={8}
                    placeholder="Minimum 8 characters"
                    className="w-full bg-background border border-border/50 rounded-xl p-3.5 pr-12 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-foreground/30" 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-primary transition-colors p-1.5 rounded-md hover:bg-muted"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-bold mb-1.5 block text-foreground">Write Access (Create/Update/Delete)</label>
                <div className="flex items-center gap-2 pt-2 cursor-pointer" onClick={() => setTeamCanWrite(!teamCanWrite)}>
                  <input type="checkbox" checked={teamCanWrite} readOnly className="w-4 h-4 rounded text-primary" />
                  <label className="text-sm font-bold cursor-pointer">Allow this sub-admin to modify data (Read-only if unchecked)</label>
                </div>
              </div>

              <Button 
                disabled={isSubmitting || (teamPassword.length > 0 && teamPassword.length < 8)} 
                type="submit" 
                className="w-full py-6 text-base font-bold rounded-xl shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <><Loader2 className="w-5 h-5 animate-spin mr-2" /> Processing securely...</>
                ) : (
                  "Save & Hash Password"
                )}
              </Button>
            </form>

            {teamMembers.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border/50">
                <h3 className="text-sm font-bold mb-4 text-foreground/80 uppercase tracking-wider">Existing Team Members</h3>
                <div className="space-y-3">
                  {teamMembers.map((member) => (
                    <div key={member.uid} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-background hover:border-primary/50 transition-colors">
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
                          {member.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="truncate">
                          <p className="font-bold text-sm text-foreground truncate">{member.email}</p>
                          <p className="text-[10px] text-foreground/50">Joined {new Date(member.createdAt).toLocaleDateString()} • {member.canWrite ? "Write Access" : "Read-Only"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleCanWrite(member.uid, !member.canWrite)}
                          className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition-colors ${
                            member.canWrite
                              ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                              : "bg-muted text-foreground/60 border-border/50 hover:bg-muted/80"
                          }`}
                          title={member.canWrite ? "Switch to read-only" : "Switch to write access"}
                        >
                          {member.canWrite ? "Write" : "Read-only"}
                        </button>
                        <button 
                          onClick={() => handleRemoveTeamMember(member.uid)}
                          className="text-destructive/70 hover:text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors shrink-0"
                          title="Remove member"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      ) : activeTab === "limits" && isSuperAdmin ? (
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Daily Inquiry Cap</h2>
            <p className="text-sm text-foreground/70 mb-6">Set a global limit on the number of inquiries that can be submitted per day. This prevents abuse and spam bots.</p>
            
            <form onSubmit={handleUpdateCap} className="space-y-5">
              <div>
                <label className="text-sm font-bold mb-1.5 block text-foreground">Max Inquiries Per Day</label>
                <div className="flex gap-4">
                  <input 
                    type="number"
                    min="0"
                    max="10000"
                    step="1"
                    value={capInputValue}
                    onChange={(e) => setCapInputValue(e.target.value)}
                    required 
                    placeholder="e.g. 150"
                    className="flex-1 bg-background border border-border/50 rounded-xl p-3.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-foreground/30" 
                  />
                  <Button 
                    disabled={isSubmitting || dailyCap?.toString() === capInputValue} 
                    type="submit" 
                    className="py-6 px-8 text-base font-bold rounded-xl shadow-md active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save"}
                  </Button>
                </div>
                <p className="text-xs text-foreground/50 mt-2">Currently active limit: <strong>{dailyCap !== null ? dailyCap : "Loading..."}</strong></p>
                <p className="text-xs text-foreground/50 mt-1">Inquiries today: <strong>{todayCount}</strong></p>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}