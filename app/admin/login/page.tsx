"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Mail, Lock, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, loading } = useAuth();

  // If Firebase sees they are already securely logged in, push them to admin
  useEffect(() => {
    if (!loading && user) {
      router.push("/admin");
    }
  }, [user, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const auth = getAuth(app);
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid admin credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) return null; // Prevent flicker while checking auth

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-gray-100 to-gray-200 p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10"
      >
        <div className="p-8 sm:p-10 flex-grow">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mb-5">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Portal</h1>
            <p className="text-gray-500 mt-2 text-sm font-medium">Authorized personnel only.</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-600 text-sm font-bold">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium text-gray-900"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-medium text-gray-900"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-6 text-lg rounded-xl mt-4 shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Secure Sign In"}
            </Button>
          </form>
        </div>
        
        <div className="bg-gray-50 border-t border-gray-100 p-5 text-center mt-auto">
          <p className="text-sm text-gray-500 font-medium">
            Powered by{" "}
            <a href="mailto:officialhaadi81@gmail.com" className="text-blue-600 font-bold hover:text-blue-800 hover:underline transition-colors">
              H Studio
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}