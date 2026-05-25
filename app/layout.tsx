import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import NotificationManager from "@/components/NotificationManager";
import LiveChat from "@/components/LiveChat";
import { AuthProvider } from "@/context/AuthContext";
import "flag-icons/css/flag-icons.min.css";
import { Toaster } from "@/components/ui/sonner";
import SplashCursorEffect from "@/components/SplashCursorEffect";
import TrafficTracker from "@/components/TrafficTracker"; // <-- IMPORTED HERE

// 1. EXTENSIVE SEO METADATA
export const metadata: Metadata = {
  title: {
    default: "The Career Advisors | Best Educational Consultancy in JK",
    template: "%s | The Career Advisors"
  },
  description: "The Career Advisors is the best educational consultancy in JK and throughout India. Founded in 2016 by Waqar Abdullah, we provide premium MBBS admission consultancy and expert career guidance.",
  keywords: [
    "The career advisors", 
    "best educational consultancy in jk", 
    "jk best education consulatancy", 
    "thecareeradvisors best education conusltancy", 
    "throughout india international educational consultancy",
    "top education consultancy in jk",
    "MBBS admission consultancy"
  ],
  authors: [{ name: "Waqar Abdullah" }],
  creator: "Waqar Abdullah",
  publisher: "The Career Advisors",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://thecareeradvisors.in",
    title: "The Career Advisors | Best Educational Consultancy in JK",
    description: "Leading as top education consultancy in JK, founded by Waqar Abdullah in 2016. Get free counselling today.",
    siteName: "The Career Advisors",
    images: [{
      url: "https://res.cloudinary.com/drytpdpx3/image/upload/v1779545094/logo.png", 
      width: 1200,
      height: 630,
      alt: "The Career Advisors Logo"
    }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  
  // 3. ORGANIZATION SCHEMA FOR GOOGLE SEARCH
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "The Career Advisors",
    "alternateName": "TheCareerAdvisors",
    "url": "https://thecareeradvisors.in",
    "logo": "https://thecareeradvisors.in/logo.png",
    "foundingDate": "2016",
    "founder": {
      "@type": "Person",
      "name": "Waqar Abdullah"
    },
    "description": "Best educational consultancy in JK and throughout India, specializing in MBBS and career counseling.",
    "address": {
      "@type": "PostalAddress",
      "addressRegion": "Jammu and Kashmir",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.facebook.com/yourpage",
      "https://www.instagram.com/yourpage"
    ]
  };

  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background">
        
        {/* GLOBAL SPLASH CURSOR EFFECT */}
        <SplashCursorEffect />

        {/* SILENT TRAFFIC TRACKER (Wrapped in Suspense because it uses useSearchParams) */}
        <Suspense fallback={null}>
          <TrafficTracker />
        </Suspense>

        <AuthProvider>
          <ConditionalLayout>
            <NotificationManager />
            <LiveChat />
            {children}
            <Toaster position="bottom-left" richColors theme="light" />
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}