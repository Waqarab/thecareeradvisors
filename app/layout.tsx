import type { Metadata } from "next";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import NotificationManager from "@/components/NotificationManager";
import LiveChat from "@/components/LiveChat";

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
        <ConditionalLayout>
          {/* Smart Notification Engine runs silently in the background */}
          <NotificationManager />
          <LiveChat />
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}