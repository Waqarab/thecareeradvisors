"use client";

import { motion } from "framer-motion";
import { Target, ShieldCheck, Award, HeartHandshake, ArrowRight, Quote, CheckCircle2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import InquiryModal from "@/components/InquiryModal";
import { useEffect } from "react";

// --- CUSTOM ANIMATIONS ---
function FadeUp({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function DarkHighlightReveal({ text }: { text: string }) {
  return (
    <span className="relative inline-flex items-center justify-center px-4 py-1 mx-1 rounded-lg overflow-hidden shadow-sm">
      <motion.span
        initial={{ width: "0%" }}
        whileInView={{ width: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-gray-950 rounded-lg"
      />
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="relative z-10 block text-destructive font-heading font-black tracking-wide"
      >
        {text}
      </motion.span>
    </span>
  );
}

export default function AboutPage() {
  // Ensure the page snaps to the top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background font-sans overflow-hidden">
      
      {/* HERO SECTION: Split Layout with Team/Founder Image */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-24 overflow-hidden border-b border-border/40">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10"></div>
        
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center max-w-7xl mx-auto">
            
            {/* Left Content */}
            <div className="max-w-2xl z-10">
              <FadeUp>
                <span className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary text-sm font-bold tracking-wider uppercase mb-6 border border-primary/20 shadow-sm">
                  The Career Advisors
                </span>
              </FadeUp>
              
              <FadeUp delay={0.1}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-heading text-foreground leading-[1.1] tracking-tight mb-6">
                  We don't just secure admissions. We build <DarkHighlightReveal text="Medical Careers." />
                </h1>
              </FadeUp>
              
              <FadeUp delay={0.2}>
                <p className="text-lg md:text-xl text-foreground/70 font-medium leading-relaxed mb-8 max-w-lg">
                  Since 2010, we have stood against hidden fees and false promises, guiding over 500+ families through a completely transparent, stress-free admission journey.
                </p>
              </FadeUp>
            </div>

            {/* Right Image (Founder / Team) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
              className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square max-w-lg mx-auto lg:ml-auto group"
            >
              {/* Decorative Frame */}
              <div className="absolute inset-0 bg-primary/10 rounded-[3rem] -rotate-3 transition-transform duration-500 group-hover:-rotate-6 -z-10"></div>
              <div className="absolute inset-0 bg-destructive/10 rounded-[3rem] rotate-3 transition-transform duration-500 group-hover:rotate-6 -z-10"></div>
              
              {/* Main Image */}
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden border-4 border-card shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop" 
                  alt="Our Expert Team" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Floating Trust Badge over image */}
                <div className="absolute bottom-6 left-6 right-6 bg-background/90 backdrop-blur-md p-4 rounded-2xl border border-border/50 shadow-lg flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-600 shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold font-heading text-foreground leading-tight">Govt. Approved</p>
                    <p className="text-xs font-medium text-foreground/60">Certified Consultancy</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* THE FOUNDER'S MOTIVE (Dark Editorial Section) */}
      <section className="py-24 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-destructive/20 rounded-full blur-[120px] pointer-events-none translate-y-1/2 -translate-x-1/3"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-5xl">
          <FadeUp>
            <div className="flex justify-center mb-8">
              <Quote className="w-16 h-16 text-destructive/40 rotate-180" />
            </div>
          </FadeUp>
          
          <FadeUp delay={0.1}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading text-center leading-tight mb-12">
              "We started this agency because we saw too many deserving students lose their careers to fraudulent agents and hidden fee traps."
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-12 text-white/70 text-lg leading-relaxed font-medium">
            <FadeUp delay={0.2}>
              <p>
                In the early 2010s, the medical admission sector was plagued by a lack of transparency. Agents would promise one fee structure in India, only for students to face massive, unexpected "donations" upon landing abroad. Families were being held hostage by their own dreams.
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <p>
                The Career Advisors was born out of a rebellion against this system. Our motive is singular: absolute transparency. We visit the universities, audit their clinical facilities, verify their WHO/NMC standings, and present you with the unvarnished truth. Your success is our reputation.
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.4}>
            <div className="mt-16 flex items-center justify-center gap-6 border-t border-white/10 pt-10">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/20">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop" alt="Founder" className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-bold font-heading text-xl text-white">Director's Name</h4>
                <p className="text-sm text-destructive font-bold tracking-wider uppercase">Founder & CEO</p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* WHY CHOOSE US (The Pillars) */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <FadeUp>
              <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-foreground mb-4">The Pillars of Our Trust</h2>
              <p className="text-lg text-foreground/70 font-medium max-w-2xl mx-auto">
                Here is why hundreds of doctors currently practicing globally started their journey with us.
              </p>
            </FadeUp>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Pillar 1 */}
            <FadeUp delay={0.1}>
              <div className="bg-card p-10 rounded-3xl shadow-sm border border-border/50 hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4">100% Transparency</h3>
                <p className="text-foreground/70 leading-relaxed font-medium flex-1">
                  We put everything in writing. No hidden charges, no sudden "consultancy fees" after you land. You get a crystal-clear budget breakdown before you make a decision.
                </p>
              </div>
            </FadeUp>

            {/* Pillar 2 */}
            <FadeUp delay={0.2}>
              <div className="bg-card p-10 rounded-3xl shadow-sm border border-border/50 hover:shadow-xl transition-all duration-300 group h-full flex flex-col relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center text-destructive mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <Target className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4 relative z-10">Verified Universities</h3>
                <p className="text-foreground/70 leading-relaxed font-medium flex-1 relative z-10">
                  We don't just partner with anyone. We rigorously audit every university for WHO recognition, NMC approval, safety, and clinical infrastructure before recommending it.
                </p>
              </div>
            </FadeUp>

            {/* Pillar 3 */}
            <FadeUp delay={0.3}>
              <div className="bg-card p-10 rounded-3xl shadow-sm border border-border/50 hover:shadow-xl transition-all duration-300 group h-full flex flex-col">
                <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center text-accent mb-6 group-hover:scale-110 transition-transform duration-500">
                  <HeartHandshake className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold font-heading mb-4">End-to-End Care</h3>
                <p className="text-foreground/70 leading-relaxed font-medium flex-1">
                  Our job doesn't end at the visa. We travel with our student batches, help you settle into your hostel, assist with local SIM cards, and remain your guardian throughout your degree.
                </p>
              </div>
            </FadeUp>

          </div>
        </div>
      </section>

      {/* FINAL CTA (Bringing it back to conversion) */}
      <section className="container mx-auto px-4 md:px-8 py-24">
        <FadeUp>
          <div className="bg-primary rounded-[3rem] p-10 md:p-16 lg:p-20 text-center text-primary-foreground shadow-2xl relative overflow-hidden max-w-6xl mx-auto group">
            
            {/* Animated Background Orbs */}
            <div className="absolute top-0 left-0 w-full h-full bg-primary-foreground/5 blur-[100px] rounded-full translate-x-1/2 translate-y-1/2 group-hover:bg-primary-foreground/10 transition-colors duration-700"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-destructive/10 blur-[100px] rounded-full -translate-x-1/2 -translate-y-1/2 group-hover:bg-destructive/20 transition-colors duration-700"></div>
            
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold font-heading mb-6 relative z-10 tracking-tight leading-[1.1]">
              Ready to map out your <br className="hidden md:block" /> medical career?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto relative z-10 font-medium">
              Sit down with our experts for a completely free, highly transparent counselling session. Let's find the best university for your NEET score.
            </p>
            
            <div className="relative z-10">
              <InquiryModal>
                <Button size="lg" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-lg px-10 py-7 rounded-full shadow-xl shadow-destructive/20 group cursor-pointer active:scale-95 transition-all font-bold tracking-wide">
                  Get Free Counselling
                  <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
              </InquiryModal>
            </div>
            
          </div>
        </FadeUp>
      </section>

    </div>
  );
}