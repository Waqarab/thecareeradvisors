import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import NotificationManager from "@/components/NotificationManager";
import LiveChat from "@/components/LiveChat";
import { AuthProvider } from "@/context/AuthContext";
import "flag-icons/css/flag-icons.min.css"; // Add this line!

// ADD THIS IMPORT
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "TheCareerAdvisors | Premium MBBS & Career Counselling",
  description: "Expert career guidance and MBBS admission consultancy. Get free counselling and secure your future today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Pre-connect to your most heavily used external servers for instant loading */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-background">
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