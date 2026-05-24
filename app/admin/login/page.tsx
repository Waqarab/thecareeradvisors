"use client";

import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/firebase/config";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");

    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      // Success! Redirect to the main admin dashboard/settings
      router.push("/admin/settings");
    } catch (err: any) {
      setError("Invalid admin credentials. Please try again.");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background styling */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-card border border-border/50 rounded-3xl shadow-2xl p-8 relative z-10"
      >
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-inner">
          <Shield className="w-8 h-8" />
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold font-heading text-foreground mb-2">Admin Portal</h1>
          <p className="text-sm text-foreground/60 font-medium">Authorized personnel only.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3 text-destructive text-sm font-bold">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 block">Admin Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-muted/50 border border-border/50 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-primary transition-colors font-medium"
                placeholder="admin@thecareeradvisors.in"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-muted/50 border border-border/50 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-primary transition-colors font-medium"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <Button type="submit" disabled={isLoggingIn} className="w-full bg-primary text-primary-foreground font-bold py-6 text-lg rounded-xl mt-4 shadow-[0_8px_30px_rgba(66,99,235,0.3)] hover:shadow-[0_8px_30px_rgba(66,99,235,0.5)] transition-all active:scale-95">
            {isLoggingIn ? <Loader2 className="w-6 h-6 animate-spin" /> : "Authenticate"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}