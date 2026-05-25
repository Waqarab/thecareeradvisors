"use client";

import { useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Loader2, Globe2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

// TARGETED UPDATE FOR AD-DIN MUMIN MEDICAL COLLEGE
const targetedUpdateData = [
  {
    matchName: "Ad-din Mumin", // Matches the exact spelling in your DB
    data: {
      established: "2014",
      description: "Ad-din Momin Medical College (ADMMC) is a recognized medical institution in Bangladesh. The college aims to provide a highly favorable environment for students to learn and develop positive attributes essential for healthcare delivery, emphasizing discipline, dedication, moral, and ethical values in medical services.",
      historicalBackground: "The academic activity of this college started in 2014, after achieving academic approval from the Ministry of Health & Family Welfare of Bangladesh.",
      hospitalFacilities: "The college is attached to Ad-din Momin Medical College Hospital (ADMMCH), a 1000-bed hospital. It offers hi-tech practical laboratories and advanced simulation for practical understanding with proximity to hospitals with a vast range of patients.",
      fees: "35,500 USD (Total)",
      hostelFees: "Multiple well-secured hostels are available for students with integrated student advisors.",
      recognition: [
        "Recognized by the BMDC, NMC, and WHO",
        "Affiliated with the University of Dhaka"
      ],
      whyChoose: [
        "Distinguished faculty members",
        "Advanced multimedia classrooms",
        "Proximity to a 1000-bed hospital for vast clinical exposure",
        "World-class library and ECA facilities",
        "Competitive internship programs",
        "Integrated student advisors and well-secured hostels"
      ]
    }
  }
];

export default function BulkUpdateGlobalPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runBulkUpdate = async () => {
    setLoading(true);
    setLogs(["Starting Targeted Update Process..."]);
    let updatedCount = 0;
    
    const matchedNames = new Set();

    try {
      const querySnapshot = await getDocs(collection(db, "universities"));
      const updatePromises: Promise<void>[] = [];

      querySnapshot.forEach((docSnap) => {
        const uniData = docSnap.data();
        const firebaseName = uniData.name || "";

        const match = targetedUpdateData.find(globalUni => 
          firebaseName.toLowerCase().includes(globalUni.matchName.toLowerCase())
        );

        if (match) {
          matchedNames.add(match.matchName);
          const docRef = doc(db, "universities", docSnap.id);
          
          const promise = updateDoc(docRef, match.data).then(() => {
            setLogs(prev => [...prev, `✅ Updated: ${firebaseName} (ID: ${docSnap.id})`]);
            updatedCount++;
          });
          
          updatePromises.push(promise);
        }
      });

      await Promise.all(updatePromises);
      
      setLogs(prev => [...prev, `\n🎉 Process Complete! Successfully updated ${updatedCount} university.`]);
      toast.success(`Successfully updated ${updatedCount} university!`);

      const missingInDb = targetedUpdateData.filter(g => !matchedNames.has(g.matchName));
      if (missingInDb.length > 0) {
        setLogs(prev => [...prev, `\n⚠️ ATTENTION: The target university was NOT FOUND in Firebase:`]);
        missingInDb.forEach(m => {
          setLogs(prev => [...prev, `❌ Missing: ${m.matchName}`]);
        });
      }

    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, `❌ ERROR: Something went wrong. Check console.`]);
      toast.error("Bulk update failed.");
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
              <h1 className="text-2xl font-bold text-gray-900">Targeted University Uploader</h1>
              <p className="text-gray-500 text-sm">Injects Ad-din Mumin Medical College data.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-8 flex gap-3 text-blue-800 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p>
              This script targets <b>Ad-din Mumin Medical College</b> in your database and updates it with the exact history, 1000-bed hospital facilities, recognition, and the $35,500 total fee.
            </p>
          </div>

          <Button 
            onClick={runBulkUpdate} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg rounded-xl mb-8"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
            {loading ? "Injecting Data..." : "Execute Update Now"}
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