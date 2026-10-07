import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { unstable_cache } from "next/cache";

const getCachedUniversities = unstable_cache(
  async () => {
    const querySnapshot = await getDocs(collection(db, "universities"));
    const data: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const uni: any = { id: doc.id, ...doc.data() };
      if (!uni.isHidden) data.push(uni);
    });

    // EXACT SAME SORTING LOGIC HERE
    data.sort((a, b) => {
      const orderA = a.featuredOrder ? Number(a.featuredOrder) : 999;
      const orderB = b.featuredOrder ? Number(b.featuredOrder) : 999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }
      return a.name.localeCompare(b.name);
    });

    // WHITELIST MAPPING (after sorting, so featuredOrder is used but not leaked)
    return data.map((raw) => ({
      id: raw.id,
      name: raw.name,
      country: raw.country,
      location: raw.location,
      fees: raw.fees,
      placed: raw.placed,
      image: raw.image,
      established: raw.established,
      history: raw.history,
      rankingGlobal: raw.rankingGlobal,
      rankingNational: raw.rankingNational,
      rankingQS: raw.rankingQS,
      facilities: raw.facilities,
      hospitals: raw.hospitals,
      infrastructure: raw.infrastructure,
      eligibility: raw.eligibility,
      description: raw.description,
      courseDuration: raw.courseDuration,
      medium: raw.medium,
      recognition: raw.recognition,
      hostelFees: raw.hostelFees,
      historicalBackground: raw.historicalBackground,
      hospitalFacilities: raw.hospitalFacilities,
      whyChoose: raw.whyChoose,
    }));
  },
  ["universities-cache-key"],
  {
    revalidate: 86400,
    tags: ["universities"],
  }
);

export async function GET() {
  try {
    const data = await getCachedUniversities();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch universities" }, { status: 500 });
  }
}