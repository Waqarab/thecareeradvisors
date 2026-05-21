import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import { unstable_cache } from "next/cache";
import UniversitiesClient from "./UniversitiesClient";

// Tell TypeScript exactly what this object looks like
interface UniversityData {
  id: string;
  isHidden?: boolean;
  name: string;
  country: string;
  location: string;
  fees: string;
  placed: string;
  image: string;
  [key: string]: any; // Accepts any additional fields without throwing errors
}

const getCachedUniversities = unstable_cache(
  async () => {
    const querySnapshot = await getDocs(collection(db, "universities"));
    const data: UniversityData[] = [];
    
    querySnapshot.forEach((doc) => {
      const uni = { id: doc.id, ...doc.data() } as UniversityData;
      
      // ONLY push universities that are NOT hidden
      if (!uni.isHidden) {
        data.push(uni);
      }
    });
    
    // Sort universities alphabetically by name for a better user experience
    data.sort((a, b) => a.name.localeCompare(b.name));
    
    return data;
  },
  ['universities-list'], // Internal Cache Key
  { tags: ['universities'] } // The tag we use to ping Vercel to rebuild the cache
);

export default async function UniversitiesPage() {
  // Fetch data on the Vercel server instantly (0 delay for the user)
  const universities = await getCachedUniversities();

  // Pass the cached data down to your client-side interactive component
  return <UniversitiesClient initialUniversities={universities} />;
}