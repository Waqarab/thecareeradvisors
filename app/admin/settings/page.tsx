"use client";

import { useState, useEffect } from "react";
import { Bell, Shield, Settings, Send, Pin, Trash2, Edit2, Loader2, CheckCircle, Eye, PauseCircle, PlayCircle, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { db } from "@/firebase/config";
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState("toast");
  const [theme, setTheme] = useState("primary"); // primary, destructive, success
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "notifications"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: any[] = [];
      snapshot.forEach((doc) => notifs.push({ id: doc.id, ...doc.data() }));
      setNotificationsList(notifs);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return toast.error("Heading and Message required!");
    setIsSubmitting(true);

    const payload = {
      type, theme, title, message, linkText, linkUrl, isPinned, updatedAt: serverTimestamp()
    };

    try {
      if (editingId) {
        // UPDATE EXISTING (Does not trigger a new offline push)
        await updateDoc(doc(db, "notifications", editingId), payload);
        toast.success("Updated successfully!");
      } else {
        // CREATE NEW & TRIGGER OFFLINE PUSH
        await addDoc(collection(db, "notifications"), {
          ...payload, isActive: true, createdAt: serverTimestamp(),
        });
        
        // --- TRIGGER OFFLINE PUSH API ---
        try {
          await fetch('/api/send-push', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: title,
              message: message,
              linkUrl: linkUrl
            })
          });
        } catch (apiError) {
          console.error("Push API failed, but DB saved:", apiError);
        }
        // --------------------------------

        toast.success("Deployed to Website and Offline Browsers!");
      }
      cancelEdit();
    } catch (error) {
      toast.error("Deployment failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (notif: any) => {
    setEditingId(notif.id); setType(notif.type); setTheme(notif.theme || "primary");
    setTitle(notif.title); setMessage(notif.message); setLinkText(notif.linkText || "");
    setLinkUrl(notif.linkUrl || ""); setIsPinned(notif.isPinned || false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingId(null); setType("toast"); setTheme("primary"); setTitle(""); 
    setMessage(""); setLinkText(""); setLinkUrl(""); setIsPinned(false);
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await updateDoc(doc(db, "notifications", id), { isActive: !currentStatus });
    toast.success(currentStatus ? "Notification Paused (Hidden)" : "Notification Resumed (Live)");
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Permanently delete this?")) await deleteDoc(doc(db, "notifications", id));
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans">
      <h1 className="text-3xl font-extrabold font-heading mb-8">System Settings</h1>

      {/* TABS */}
      <div className="flex gap-4 mb-8 border-b border-border/50 pb-4 overflow-x-auto">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold bg-primary text-primary-foreground">
          <Bell className="w-4 h-4" /> Notification Engine
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Form & Preview */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center justify-between">
              <span className="flex items-center gap-2"><Send className="w-5 h-5 text-primary" /> {editingId ? "Edit Alert" : "Create Alert"}</span>
              {editingId && <button onClick={cancelEdit} className="text-xs text-destructive hover:underline">Cancel</button>}
            </h2>
            
            <form onSubmit={handleDeploy} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold mb-1 block">Type</label>
                  <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-muted/50 border rounded-lg p-3 text-sm">
                    <option value="inbox">Navbar Inbox Only</option>
                    <option value="toast">Bottom Corner Toast</option>
                    <option value="popup">Center Screen Pop-up</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold mb-1 block">Color Theme</label>
                  <select value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-muted/50 border rounded-lg p-3 text-sm">
                    <option value="primary">Brand Blue (Info)</option>
                    <option value="destructive">Red (Urgent)</option>
                    <option value="success">Green (Success)</option>
                  </select>
                </div>
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

              <div className="flex items-center gap-2 pt-2 cursor-pointer" onClick={() => setIsPinned(!isPinned)}>
                <input type="checkbox" checked={isPinned} readOnly className="w-4 h-4 rounded text-primary" />
                <label className="text-sm font-bold cursor-pointer">Pin to top of Inbox</label>
              </div>

              <Button disabled={isSubmitting} type="submit" className="w-full py-6 text-lg rounded-xl">
                {isSubmitting ? <Loader2 className="animate-spin" /> : (editingId ? "Update" : "Deploy")}
              </Button>
            </form>
          </div>

          {/* LIVE PREVIEW BOX */}
          <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/50 mb-4 flex items-center gap-2"><Eye className="w-4 h-4" /> Live Preview</h3>
            <div className={`p-4 rounded-xl border-l-4 shadow-sm ${theme === 'destructive' ? 'border-destructive bg-destructive/5' : theme === 'success' ? 'border-green-500 bg-green-500/5' : 'border-primary bg-primary/5'}`}>
              <h4 className="font-bold text-foreground">{title || "Your Heading Here"}</h4>
              <p className="text-sm text-foreground/70 mt-1">{message || "Your message will appear here..."}</p>
              {linkUrl && linkText && (
                <a href={linkUrl} target="_blank" className="inline-block mt-3 text-xs font-bold bg-background border px-3 py-1.5 rounded-full hover:underline">{linkText}</a>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Management */}
        <div className="lg:col-span-5 bg-card border border-border/50 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-green-500" /> Announcements</h2>
          <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2">
            {notificationsList.map((notif) => (
              <div key={notif.id} className={`p-4 rounded-xl border relative ${notif.isActive ? 'bg-background' : 'bg-muted/50 opacity-60'}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase bg-muted px-2 py-1 rounded-md">{notif.type}</span>
                  <div className="flex gap-2">
                    <button onClick={() => toggleActive(notif.id, notif.isActive)} title={notif.isActive ? "Pause" : "Resume"}>
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
    </div>
  );
}