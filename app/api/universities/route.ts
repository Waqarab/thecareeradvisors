import { NextResponse } from "next/server";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { unstable_cache } from "next/cache";

// 1. Wrap the Firebase call in a tagged cache
const getCachedUniversities = unstable_cache(
  async () => {
    const querySnapshot = await getDocs(collection(db, "universities"));
    const data: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const uni: any = { id: doc.id, ...doc.data() };
      if (!uni.isHidden) data.push(uni);
    });
    return data;
  },
  ["universities-cache-key"], // Internal cache key
  {
    revalidate: 86400, // Background refresh every 24 hours
    tags: ["universities"], // <-- THIS TAG CONNECTS TO YOUR REVALIDATE API
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