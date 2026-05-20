"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyWhatsApp from "@/components/StickyWhatsapp";

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Check if the current URL starts with "/admin"
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      
      <main className="flex-1">
        {children}
      </main>
      
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <StickyWhatsApp />}
    </>
  );
}