"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, MessageCircle, CalendarDays } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card w-full border-t border-border/40 mt-auto">
      
      {/* PRE-FOOTER CTA */}
      <div className="container mx-auto px-4 md:px-8 relative -top-12">
        <div className="bg-primary rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl gap-6">
          <div className="flex items-center gap-6">
            <div className="bg-primary-foreground/10 p-4 rounded-xl hidden sm:block">
              <CalendarDays className="w-10 h-10 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Book Your Free 1-to-1 Counselling Session
              </h3>
              <p className="text-primary-foreground/80">
                Let our experts help you choose the right university and make your dream a reality.
              </p>
            </div>
          </div>
          <Button size="lg" className="w-full md:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 text-lg px-8 py-6 rounded-full whitespace-nowrap shadow-xl shadow-destructive/20 transition-transform active:scale-95">
            Book Now <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="container mx-auto px-4 md:px-8 pb-12 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand & Intro */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
               <Image 
                src="/logo.png" 
                alt="The Career Advisors" 
                width={1868} 
                height={832} 
                className="w-[240px] md:w-[280px] h-auto object-contain"
              />
            </Link>
            <p className="text-foreground/70 leading-snug text-sm">
              The Career Advisors - Best Career Consultancy in Jammu and Kashmir. The Career Advisors is choosed by everybody for its transparency, experience, and dedicated team. <br/><br/> <b><i>Choose us and Feel the difference.</i></b>
            </p>
            <div className="flex items-center gap-4 text-primary pt-2">
              <a href="#" className="hover:text-destructive transition-colors"><SocialIcon type="facebook" /></a>
              <a href="#" className="hover:text-destructive transition-colors"><SocialIcon type="instagram" /></a>
              <a href="#" className="hover:text-destructive transition-colors"><SocialIcon type="youtube" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-4 text-sm text-foreground/70 font-medium">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/#universities" className="hover:text-primary transition-colors">Destinations</Link></li>
              <li><Link href="/universities" className="hover:text-primary transition-colors">All Universities</Link></li>
              <li><Link href="/#testimonials" className="hover:text-primary transition-colors">Student Testimonials</Link></li>
              <li><Link href="/#faq" className="hover:text-primary transition-colors">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Popular Countries */}
          <div>
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Popular Countries</h4>
            <ul className="space-y-4 text-sm text-foreground/70 font-medium">
              <li><Link href="/universities?country=Russia" className="hover:text-primary transition-colors">MBBS in Russia</Link></li>
              <li><Link href="/universities?country=Kazakhstan" className="hover:text-primary transition-colors">MBBS in Kazakhstan</Link></li>
              <li><Link href="/universities?country=Bangladesh" className="hover:text-primary transition-colors">MBBS in Bangladesh</Link></li>
              <li><Link href="/universities?country=Georgia" className="hover:text-primary transition-colors">MBBS in Georgia</Link></li>
              <li><Link href="/universities?country=Egypt" className="hover:text-primary transition-colors">MBBS in Egypt</Link></li>
            </ul>
          </div>

          {/* Contact Us & Map */}
          <div className="flex flex-col h-full">
            <h4 className="font-bold text-foreground mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
            <ul className="space-y-4 text-sm text-foreground/70 font-medium mb-6">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href="tel:+916005152350" className="hover:text-primary transition-colors">+91 60051 52350</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href="mailto:info@thecareeradvisors.in" className="hover:text-primary transition-colors">info@thecareeradvisors.in</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                <span>2nd Floor, Baghat Chowk, Al Harim Complex, Near Old Cottage Inn, Baghat, Srinagar, J&K – 190005</span>
              </li>
            </ul>

            {/* OPTIMIZED GOOGLE MAP IFRAME */}
            <div className="w-full h-32 rounded-xl overflow-hidden shadow-inner border border-border/50 bg-muted mb-4 relative z-0">
              <iframe 
                src="https://maps.google.com/maps?q=34.04370278770152,74.80279324538682&z=15&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="The Career Advisors Location"
                className="absolute inset-0"
              />
            </div>

            <a href="https://wa.me/916005152350" target="_blank" rel="noopener noreferrer" className="mt-auto block">
              <Button variant="outline" className="w-full border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                <MessageCircle className="w-4 h-4 mr-2" /> Chat on WhatsApp
              </Button>
            </a>
          </div>

        </div>
      </div>

      {/* COPYRIGHT BAR */}
      <div className="bg-[#1b2f45] py-4">
        <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#AEC6CF]/80 gap-3">
          <p>© {new Date().getFullYear()} The Career Advisors. All rights reserved.</p>
          
          <div className="flex gap-6 mt-1 md:mt-0 items-center">
            <div className="flex gap-4">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms & Conditions</Link>
            </div>
            <div className="hidden md:block w-px h-3 bg-[#AEC6CF]/30"></div>
            
            {/* DEVELOPER CREDIT */}
            <p className="flex items-center gap-1.5">
              Developed by 
              <a 
                href="http://haadi.publicvm.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-bold text-white hover:text-emerald-400 transition-colors"
              >
                H Studio
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

// Helper components to replace Lucide brand icons
function ArrowRightIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
  );
}

function SocialIcon({ type }: { type: string }) {
  if (type === "facebook") return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
  if (type === "instagram") return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>;
  if (type === "youtube") return <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>;
  return null;
}