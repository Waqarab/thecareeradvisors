"use client";

import { useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Loader2, Globe2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function BulkUpdateGlobalPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runBulkUpdate = async () => {
    setLoading(true);
    setLogs(["Starting Bulk Overwrite Process..."]);
    let updatedCount = 0;

    try {
      const querySnapshot = await getDocs(collection(db, "universities"));
      const updatePromises: Promise<void>[] = [];

      querySnapshot.forEach((docSnap) => {
        const uniData = docSnap.data();
        const firebaseName = uniData.name || "";

        // FORCE overwrite the recognition array for EVERY university
        const updateData = {
          recognition: [
            "WHO Recognized", 
            "NMC / MCI Approved", 
            "Ministry of Education Approved"
          ]
        };

        const docRef = doc(db, "universities", docSnap.id);
        const promise = updateDoc(docRef, updateData).then(() => {
          setLogs(prev => [...prev, `✅ Overwritten Approvals for: ${firebaseName}`]);
          updatedCount++;
        });
        
        updatePromises.push(promise);
      });

      await Promise.all(updatePromises);
      
      // Revalidate the cache so the frontend sees it immediately
      await fetch(`/api/revalidate?tag=universities`, { method: "POST" });
      
      setLogs(prev => [...prev, `\n🎉 Process Complete! Successfully overwritten approvals for ${updatedCount} universities.`]);
      toast.success(`Successfully updated ${updatedCount} universities!`);

    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, `❌ ERROR: Something went wrong. Check console.`]);
      toast.error("Couldn't run bulk update. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-xl">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Force Overwrite Approvals</h1>
              <p className="text-gray-500 text-sm">Resets all approvals to the 3 defaults.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-8 flex gap-3 text-blue-800 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p>
              This script will scan <b>ALL UNIVERSITIES</b> in your Firebase database and <b>FORCE OVERWRITE</b> whatever is currently in the <b>Approvals / Recognition</b> list with the 3 standard defaults (WHO, NMC, Ministry). This removes all the garbage data and resets every university.
            </p>
          </div>

          <Button 
            onClick={runBulkUpdate} 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-6 text-lg rounded-xl mb-8"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
            {loading ? "Overwriting Database..." : "Execute Force Overwrite Now"}
          </Button>

          <div className="bg-gray-900 rounded-xl p-4 h-64 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
            {logs.length === 0 ? (
              <p className="text-gray-500">Awaiting execution...</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className={log.includes("ERROR") || log.includes("❌") ? "text-red-400" : log.includes("✅") ? "text-green-400" : log.includes("⚠️") ? "text-yellow-400" : "text-gray-300"}>
                  {log}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}