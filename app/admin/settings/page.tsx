"use client";

import { useState, useEffect } from "react";
import { Bell, Shield, Settings, Send, Pin, Trash2, Edit2, Loader2, CheckCircle, Eye, EyeOff, PauseCircle, PlayCircle, Link as LinkIcon, Volume2, VolumeX, Smartphone, Monitor, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db, app } from "@/firebase/config";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { getDatabase, ref, onValue, remove } from "firebase/database";
import { useAuth } from "@/context/AuthContext";

// USING ENVIRONMENT VARIABLE FOR SECURITY
const SUPER_ADMIN_EMAIL = process.env.NEXT_PUBLIC_SUPER_ADMIN_EMAIL;

export default function AdminSettings() {
  const { user } = useAuth();
  const isSuperAdmin = user?.email === SUPER_ADMIN_EMAIL;

  const [activeTab, setActiveTab] = useState<"notifications" | "team">("notifications");
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [theme, setTheme] = useState("primary");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [playSound, setPlaySound] = useState(true);
  const [soundCount, setSoundCount] = useState<1 | 2 | 3>(2);

  // Team Form State
  const [teamEmail, setTeamEmail] = useState("");
  const [teamPassword, setTeamPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // 1. Load Notifications
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: any[] = [];
      snapshot.forEach((doc) => notifs.push({ id: doc.id, ...doc.data() }));
      setNotificationsList(notifs);
      setIsLoading(false);
    });

    // 2. Load Active Devices (If Super Admin)
    if (isSuperAdmin) {
      const rtdb = getDatabase(app);
      const sessionsRef = ref(rtdb, 'admin_sessions');
      onValue(sessionsRef, (snapshot) => {
        const data = snapshot.val() || {};
        const sessionsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        // Sort newest logins first
        sessionsArray.sort((a, b) => b.loginTime - a.loginTime);
        setActiveSessions(sessionsArray);
      });
    }

    return () => unsubscribe();
  }, [isSuperAdmin]);

  // --- NOTIFICATION ENGINE ---
  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return toast.error("Heading and Message required!");
    setIsSubmitting(true);

    const payload = {
      type: "inbox", theme, title, message, linkText, linkUrl, isPinned, playSound, soundCount, updatedAt: serverTimestamp()
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
    setPlaySound(notif.playSound !== false); 
    setSoundCount(notif.soundCount || 2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null); setTheme("primary"); setTitle(""); 
    setMessage(""); setLinkText(""); setLinkUrl(""); setIsPinned(false);
    setPlaySound(true); setSoundCount(2);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "notifications", id), { isActive: !currentStatus });
    toast.success(currentStatus ? "Announcement Paused" : "Announcement Live");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanently delete this?")) await deleteDoc(doc(db, "notifications", id));
  };

  // --- TEAM ENGINE ---
  const handleRevokeDevice = async (sessionId: string) => {
    if (!window.confirm("Kick this device out of the admin panel?")) return;
    try {
      await remove(ref(getDatabase(app), `admin_sessions/${sessionId}`));
      toast.success("Device revoked. They will be logged out instantly.");
    } catch (error) {
      toast.error("Failed to revoke device.");
    }
  };

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamEmail || teamPassword.length < 6) return toast.error("Email required and password must be 6+ chars.");
    setIsSubmitting(true);

    try {
      // 1. GET THE SECURE ID TOKEN
      const idToken = await user?.getIdToken();

      // 2. SEND TO SECURE API BACKEND
      const res = await fetch("/api/admin/team", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${idToken}` // Required for security
        },
        body: JSON.stringify({ email: teamEmail, password: teamPassword })
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Team member account created/updated!");
        setTeamEmail("");
        setTeamPassword("");
        setShowPassword(false);
      } else {
        toast.error(data.error || "Failed to create user. You can only have 3 sub-admins.");
      }
    } catch (error) {
      toast.error("Network error. Could not reach server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to parse ugly UserAgents into readable device names
  const parseDevice = (ua: string) => {
    if (ua.includes("iPhone")) return "Apple iPhone";
    if (ua.includes("Android")) return "Android Phone";
    if (ua.includes("Mac OS")) return "Apple Mac";
    if (ua.includes("Windows")) return "Windows PC";
    return "Unknown Device";
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <h1 className="text-3xl font-extrabold font-heading mb-8">System Settings</h1>

      <div className="flex gap-4 mb-8 border-b border-border/50 pb-4 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'notifications' ? 'bg-primary text-primary-foreground' : 'text-foreground/60 hover:bg-muted'}`}
        >
          <Bell className="w-4 h-4" /> Navbar Announcements
        </button>
        {isSuperAdmin && (
          <button 
            onClick={() => setActiveTab("team")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'team' ? 'bg-primary text-primary-foreground' : 'text-foreground/60 hover:bg-muted'}`}
          >
            <Shield className="w-4 h-4" /> Team & Security
          </button>
        )}
      </div>

      {activeTab === "notifications" ? (
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Form & Preview */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
                <span className="flex items-center gap-2"><Send className="w-5 h-5 text-primary" /> {editingId ? "Edit Announcement" : "Create Announcement"}</span>
                {editingId && <button onClick={cancelEdit} className="text-xs text-destructive hover:underline">Cancel</button>}
              </h2>
              
              <form onSubmit={handleDeploy} className="space-y-5">
                <div>
                  <label className="text-sm font-bold mb-1 block">Color Theme</label>
                  <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-muted/50 border rounded-lg p-3 text-sm">
                    <option value="primary">Brand Blue (Info)</option>
                    <option value="destructive">Red (Urgent)</option>
                    <option value="success">Green (Success)</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-bold mb-1 block">Heading</label>
                  <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full bg-muted/50 border rounded-lg p-3 text-sm" />
                </div>

                <div>
                  <label className="text-sm font-bold mb-1 block">Message</label>
                  <textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)} required className="w-full bg-muted/50 border rounded-lg p-3 text-sm"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border border-border/50">
                  <div className="col-span-2 text-xs font-bold text-foreground/60 uppercase flex items-center gap-1"><LinkIcon className="w-3 h-3"/> Document Hyperlink (Optional)</div>
                  <input type="text" placeholder="Button Text (e.g. View PDF)" value={linkText} onChange={(e) => setLinkText(e.target.value)} className="w-full border rounded-lg p-3 text-sm" />
                  <input type="url" placeholder="URL (https://...)" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full border rounded-lg p-3 text-sm" />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1">
                      <input type="checkbox" id="soundToggle" checked={playSound} onChange={(e) => setPlaySound(e.target.checked)} className="w-4 h-4 rounded text-primary cursor-pointer" />
                      <label htmlFor="soundToggle" className="text-sm font-bold cursor-pointer flex items-center gap-1">
                        Play Sound on User Devices {playSound ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 text-foreground/40" />}
                      </label>
                    </div>
                    <p className="text-[10px] text-foreground/60 ml-6">Grabs user attention instantly.</p>
                  </div>
                  
                  {playSound && (
                    <div className="shrink-0 flex items-center gap-2 bg-background px-3 py-1.5 rounded-lg border">
                      <span className="text-xs font-bold text-foreground/60">Pings:</span>
                      {[1, 2, 3].map((num) => (
                        <button 
                          key={num} 
                          type="button" 
                          onClick={() => setSoundCount(num as 1|2|3)}
                          className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${soundCount === num ? 'bg-primary text-white scale-110' : 'bg-muted hover:bg-muted/80 text-foreground/60'}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2 cursor-pointer" onClick={() => setIsPinned(!isPinned)}>
                  <input type="checkbox" checked={isPinned} readOnly className="w-4 h-4 rounded text-primary" />
                  <label className="text-sm font-bold cursor-pointer">Pin to top of Inbox</label>
                </div>

                <Button disabled={isSubmitting} type="submit" className="w-full py-6 text-lg rounded-xl shadow-lg">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : (editingId ? "Update Announcement" : "Deploy to Navbar Inbox")}
                </Button>
              </form>
            </div>
          </div>

          {/* RIGHT COLUMN: Management */}
          <div className="lg:col-span-5 bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Active Announcements</h2>
            <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
              {notificationsList.map((notif) => (
                <div key={notif.id} className={`p-4 rounded-xl border relative ${notif.isActive ? 'bg-background' : 'bg-muted/50 opacity-60'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase bg-muted px-2 py-1 rounded-md flex items-center gap-1">
                      {notif.playSound !== false ? <Volume2 className="w-3 h-3 text-primary" /> : <VolumeX className="w-3 h-3" />}
                      {notif.playSound !== false ? `${notif.soundCount || 2} PINGS` : 'MUTED'}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => toggleActive(notif.id, notif.isActive)} title={notif.isActive ? "Hide" : "Publish"}>
                        {notif.isActive ? <PauseCircle className="w-4 h-4 text-orange-500" /> : <PlayCircle className="w-4 h-4 text-green-500" />}
                      </button>
                      <button onClick={() => handleEdit(notif)}><Edit2 className="w-4 h-4 text-primary" /></button>
                      <button onClick={() => handleDelete(notif.id)}><Trash2 className="w-4 h-4 text-destructive" /></button>
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
      ) : (
        /* ======================================= */
        /* SUPER ADMIN TEAM & SECURITY TAB         */
        /* ======================================= */
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Active Devices */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-fit">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-primary" /> Active Logins</span>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">{activeSessions.length} Devices</span>
            </h2>
            <div className="space-y-4">
              {activeSessions.map((session) => {
                const deviceName = parseDevice(session.device);
                const isMobile = deviceName.includes("Phone") || deviceName.includes("iPhone");
                
                return (
                  <div key={session.id} className="p-4 rounded-xl border border-border/50 bg-background flex items-center justify-between group hover:border-primary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-foreground/60 shrink-0">
                        {isMobile ? <Smartphone className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm leading-tight text-foreground">{session.email}</h4>
                        <p className="text-xs text-foreground/60">{deviceName}</p>
                        <p className="text-[10px] text-foreground/40 mt-1 uppercase font-semibold">
                          Logged in: {new Date(session.loginTime).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleRevokeDevice(session.id)}
                      className="text-xs font-bold text-destructive bg-destructive/10 hover:bg-destructive hover:text-white px-3 py-1.5 rounded-lg transition-all"
                    >
                      Revoke
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sub-Admin Password Generation */}
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
                  placeholder="e.g. rohan@thecareeradvisors.com"
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
                    minLength={6}
                    placeholder="Minimum 6 characters"
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

              <Button 
                disabled={isSubmitting || (teamPassword.length > 0 && teamPassword.length < 6)} 
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
          </div>

        </div>
      )}
    </div>
  );
}