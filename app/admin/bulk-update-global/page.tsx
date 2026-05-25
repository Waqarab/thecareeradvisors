"use client";

import { useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Loader2, Globe2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

// MISSING UNIVERSITIES METICULOUSLY FORMATTED
const missingGlobalData = [
  {
    matchName: "Kuban State",
    data: {
      established: "1920",
      description: "Kuban State Medical University is one of the oldest and most prestigious medical universities in southern Russia. The university is internationally recognized for quality medical education, advanced research programs, experienced faculty, and strong clinical exposure.",
      historicalBackground: "The university was established to develop modern medical education and healthcare services in southern Russia. Over the decades, it has become one of the leading medical institutions in the region, producing highly qualified healthcare professionals and researchers.",
      hospitalFacilities: "The university has multiple affiliated teaching hospitals, laboratories, simulation centers, research departments, and advanced clinical facilities that provide students with excellent practical exposure and hospital-based medical training.",
      fees: "Approx. 4.98 lakh Rubles per year",
      hostelFees: "Separate hostel facilities are available for boys and girls with proper accommodation, security, and food facilities. Approximate hostel and mess expenses range around 1,500 USD to 1,800 USD per year approx.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-recognized medical university",
        "Internationally respected medical institution",
        "Strong academic and research reputation"
      ],
      whyChoose: [
        "One of the oldest medical universities in Russia",
        "Strong practical and clinical exposure",
        "Modern infrastructure and laboratories",
        "Internationally recognized medical degree",
        "Experienced faculty and research facilities",
        "International student-friendly environment"
      ]
    }
  },
  {
    matchName: "Cairo",
    data: {
      established: "1908",
      description: "Cairo University is one of the oldest and most prestigious public universities in Egypt, Africa, and the Middle East. The university is internationally recognized for its excellence in medical education, scientific research, and advanced healthcare training.",
      historicalBackground: "Originally founded as the Egyptian University, Cairo University played a major role in shaping modern higher education in Egypt and the Arab world. Over the decades, it became one of the leading universities in Africa with internationally recognized faculties and research contributions.",
      hospitalFacilities: "The university has multiple affiliated teaching hospitals, research centers, laboratories, advanced clinical departments, and one of the largest medical training systems in Egypt, providing excellent practical exposure and clinical experience for students.",
      fees: "8,000 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls with proper accommodation, security, and food facilities. Approximate hostel and mess expenses range between 1,500 USD per year approx.",
      recognition: [
        "One of the top universities in Egypt and Africa",
        "Recognized by WHO, NMC, and international medical bodies",
        "Strong QS World University Rankings presence",
        "Globally respected medical faculty and research programs"
      ],
      whyChoose: [
        "One of the oldest universities in Africa",
        "Globally recognized medical degree",
        "Strong clinical exposure and hospital training",
        "High QS and international rankings",
        "International student environment",
        "Gateway opportunities for Gulf countries, UK, and Europe"
      ]
    }
  },
  {
    matchName: "Namangan",
    data: {
      established: "1942",
      description: "Namangan State University is one of the rapidly growing public universities in Uzbekistan known for its modern academic environment, affordable fee structure, and increasing international student community. The Faculty of Medicine has become highly popular among Indian students.",
      historicalBackground: "The university was established during the Soviet era and gradually developed into one of Uzbekistan’s recognized higher educational institutions. Over the years, it expanded its academic programs and modern infrastructure, attracting both local and international students.",
      hospitalFacilities: "The Faculty of Medicine is associated with teaching hospitals, modern laboratories, clinical departments, simulation facilities, and practical training centers that provide students with valuable clinical exposure and hands-on learning.",
      fees: "3,390 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls with proper security, furnished accommodation, and food facilities. Approximate hostel and mess expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Government-recognized public university",
        "Recognized by relevant international medical authorities",
        "Growing international reputation among MBBS aspirants",
        "Increasing Indian student enrollment every year"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "Direct flight connectivity from Delhi to Namangan",
        "Indian faculty support available",
        "FMGE-oriented academic guidance",
        "Safe and student-friendly environment",
        "Growing international student community"
      ]
    }
  },
  {
    matchName: "Asian International",
    data: {
      established: "2004",
      description: "Asian International Education (Asian Medical Institute) is a well-known private medical institution in Kyrgyzstan offering MBBS programs for international students. The university is recognized for its affordable fee structure, English-medium education, and simple admission process.",
      historicalBackground: "The institute was established to provide modern medical education to international students in Kyrgyzstan. Over the years, it has grown into a recognized institution with a focus on practical medical training and global student intake.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical training centers, laboratories, and simulation facilities that provide students with hands-on medical experience.",
      fees: "Approx. 3,500 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls with furnished rooms, security, and food arrangements. Approximate hostel and mess expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "International student-focused medical institute",
        "Known for affordable medical education",
        "Popular among Indian subcontinent students"
      ],
      whyChoose: [
        "Low tuition fees",
        "Simple admission process",
        "English-medium MBBS program",
        "Strong Indian student presence",
        "Practical clinical training",
        "Safe and student-friendly environment"
      ]
    }
  },
  {
    matchName: "Ad-din Momin",
    data: {
      established: "2014",
      description: "Ad-din Momin Medical College (ADMMC) is a recognized medical institution located in South Keraniganj, Dhaka, Bangladesh. The college aims to provide a highly favorable environment for students to learn and develop positive attributes essential for healthcare delivery, emphasizing discipline, dedication, moral, and ethical values.",
      historicalBackground: "The academic activity of this college started in 2014, after achieving academic approval from the Ministry of Health & Family Welfare of Bangladesh.",
      hospitalFacilities: "The college is attached to Ad-din Momin Medical College Hospital (ADMMCH), a 1000-bed hospital. It offers hi-tech practical laboratories and advanced simulation for practical understanding with proximity to hospitals with a vast range of patients.",
      fees: "Contact university for latest fee details",
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
    setLogs(["Starting Missing Universities Update Process..."]);
    let updatedCount = 0;
    
    const matchedNames = new Set();

    try {
      const querySnapshot = await getDocs(collection(db, "universities"));
      const updatePromises: Promise<void>[] = [];

      querySnapshot.forEach((docSnap) => {
        const uniData = docSnap.data();
        const firebaseName = uniData.name || "";

        const match = missingGlobalData.find(globalUni => 
          firebaseName.toLowerCase().includes(globalUni.matchName.toLowerCase())
        );

        if (match) {
          matchedNames.add(match.matchName);
          const docRef = doc(db, "universities", docSnap.id);
          
          const promise = updateDoc(docRef, match.data).then(() => {
            setLogs(prev => [...prev, `✅ Updated: ${firebaseName}`]);
            updatedCount++;
          });
          
          updatePromises.push(promise);
        }
      });

      await Promise.all(updatePromises);
      
      setLogs(prev => [...prev, `\n🎉 Process Complete! Successfully mapped and updated ${updatedCount} universities.`]);
      toast.success(`Successfully updated ${updatedCount} universities!`);

      const missingInDb = missingGlobalData.filter(g => !matchedNames.has(g.matchName));
      if (missingInDb.length > 0) {
        setLogs(prev => [...prev, `\n⚠️ ATTENTION: The following universities were NOT FOUND in Firebase. Please add them via localhost:`]);
        missingInDb.forEach(m => {
          setLogs(prev => [...prev, `❌ Missing: ${m.matchName} (Data is ready to inject once the basic profile is created)`]);
        });
        console.warn("Universities missing from DB:", missingInDb.map(m => m.matchName));
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
              <h1 className="text-2xl font-bold text-gray-900">Missing Universities Uploader</h1>
              <p className="text-gray-500 text-sm">Injects specific missing global profiles into the database.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-8 flex gap-3 text-blue-800 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p>
              This script will scan your database for the 5 newly provided universities (Kuban, Cairo, Namangan, Asian International, and Ad-din Momin) and inject their formatted profiles.
            </p>
          </div>

          <Button 
            onClick={runBulkUpdate} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg rounded-xl mb-8"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
            {loading ? "Injecting Missing Data..." : "Execute Update Now"}
          </Button>

          <div className="bg-gray-900 rounded-xl p-4 h-96 overflow-y-auto font-mono text-sm whitespace-pre-wrap">
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