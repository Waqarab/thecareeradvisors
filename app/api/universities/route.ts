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

    return data;
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