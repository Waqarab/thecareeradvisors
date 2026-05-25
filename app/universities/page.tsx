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
  featuredOrder?: string | number; // Added featuredOrder
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
    
    // Sort logic: Featured universities (e.g., 1-6) come first, the rest are alphabetical
    data.sort((a, b) => {
      // If a university doesn't have a featuredOrder, assign it a high number (999) so it goes to the bottom
      const orderA = a.featuredOrder ? Number(a.featuredOrder) : 999;
      const orderB = b.featuredOrder ? Number(b.featuredOrder) : 999;

      if (orderA !== orderB) {
        return orderA - orderB; // Sort by featured order (1 comes before 2)
      }
      // If both have the same order (e.g., both are 999), sort alphabetically
      return a.name.localeCompare(b.name);
    });
    
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