"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, Menu, Sparkles } from "lucide-react";
import InquiryModal from "@/components/InquiryModal";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/85 backdrop-blur-2xl saturate-[2] border-b border-border/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-200">
      <div className="container mx-auto flex h-24 items-center justify-between px-4 md:px-8">
        
        {/* LOGO AREA - Enlarged */}
        <Link 
          href="/" 
          className="flex items-center gap-2 active:scale-95 transition-transform duration-200 group"
        >
          <div className="scale-[1.4] md:scale-[1.4] origin-left pl-2 translate-y-3 md:translate-y-1">
            <Image 
              src="/logo.png" 
              alt="The Career Advisors" 
              width={300} 
              height={100} 
              className="h-16 w-auto object-contain group-hover:opacity-90 transition-opacity" 
              priority 
            />
          </div>
        </Link>

        {/* DESKTOP NAVIGATION (High-Contrast Pill) */}
        <nav className="hidden lg:flex items-center gap-1 font-heading text-sm font-bold tracking-wider text-foreground/70 bg-foreground/5 p-1.5 rounded-full border border-border/50 shadow-inner">
          <Link href="/" className="px-5 py-2 rounded-full hover:bg-card hover:text-destructive hover:shadow-sm transition-all duration-200 active:scale-95">
            Home
          </Link>
          <Link href="/universities" className="px-5 py-2 rounded-full hover:bg-card hover:text-destructive hover:shadow-sm transition-all duration-200 active:scale-95">
            Universities
          </Link>
          {/* Services Removed. Success Stories routes to new page */}
          <Link href="/success-stories" className="px-5 py-2 rounded-full hover:bg-card hover:text-destructive hover:shadow-sm transition-all duration-200 active:scale-95">
            Success Stories
          </Link>
          <Link href="/about" className="px-5 py-2 rounded-full hover:bg-card hover:text-destructive hover:shadow-sm transition-all duration-200 active:scale-95">
            About Us
          </Link>
          <Link href="#faq" className="px-5 py-2 rounded-full hover:bg-card hover:text-destructive hover:shadow-sm transition-all duration-200 active:scale-95">
            FAQ
          </Link>
        </nav>

        {/* CTA BUTTONS */}
        <div className="flex items-center gap-5">
          <a 
            href="tel:+917889708059" 
            className="hidden xl:flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 active:scale-95 transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm">
              <Phone className="h-4 w-4" />
            </div>
            <span className="font-heading tracking-wide">+91 78897 08059</span>
          </a>
          
          {/* Primary CTA with sweeping dark overlay */}
          <InquiryModal>
            <Button className="relative overflow-hidden rounded-full bg-destructive text-destructive-foreground hidden md:inline-flex cursor-pointer active:scale-95 transition-all duration-200 px-7 py-6 text-sm font-bold tracking-wide border border-destructive/50 group">
              <span className="absolute inset-0 bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full z-0"></span>
              <span className="relative z-10 flex items-center">
                <Sparkles className="w-4 h-4 mr-2" />
                Get Free Counselling
              </span>
            </Button>
          </InquiryModal>

          <button className="lg:hidden p-2.5 text-foreground active:scale-90 transition-transform duration-200 bg-foreground/5 hover:bg-foreground/10 rounded-full border border-border/50">
            <Menu className="h-6 w-6" />
          </button>
        </div>

      </div>
    </header>
  );
}