import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import NotificationManager from "@/components/NotificationManager";
import LiveChat from "@/components/LiveChat";
import { AuthProvider } from "@/context/AuthContext";

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
      <body className="antialiased min-h-screen flex flex-col bg-background">
        <AuthProvider>
          <ConditionalLayout>
            <NotificationManager />
            <LiveChat />
            {children}
            
            {/* ADD THE TOASTER HERE SO THE PUBLIC SITE CAN RENDER ALERTS */}
            <Toaster position="bottom-left" richColors theme="light" />
            
          </ConditionalLayout>
        </AuthProvider>
      </body>
    </html>
  );
}