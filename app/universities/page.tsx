import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { unstable_cache } from "next/cache";
import UniversitiesClient from "./UniversitiesClient";

// Tell TypeScript exactly what this object looks like to clear the error
interface UniversityData {
  id: string;
  isHidden?: boolean;
  [key: string]: any; // Tells TS to accept all the other fields (name, fees, etc.)
}

const getCachedUniversities = unstable_cache(
  async () => {
    const querySnapshot = await getDocs(collection(db, "universities"));
    const data: any[] = [];
    
    querySnapshot.forEach((doc) => {
      // Explicitly cast the document to our new interface
      const uni = { id: doc.id, ...doc.data() } as UniversityData;
      
      if (!uni.isHidden) {
        data.push(uni);
      }
    });
    
    return data;
  },
  ['universities-list'], // Cache Key
  { tags: ['universities'] } // Revalidation Tag
);

export default async function UniversitiesPage() {
  // Fetch data on the Vercel server instantly
  const universities = await getCachedUniversities();

  // Pass the cached data down to your client-side animations
  return <UniversitiesClient initialUniversities={universities} />;
}