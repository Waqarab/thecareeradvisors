"use client";

import { motion } from "framer-motion";
import { Quote, ArrowRight, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import InquiryModal from "@/components/InquiryModal";
import { useEffect } from "react";

// --- FRONT HIGHLIGHT ANIMATION 1: The Text Fill ---
function TextFillHighlight({ text }: { text: string }) {
  return (
    <span className="relative inline-block">
      {/* Ghost Text */}
      <span className="opacity-20 text-foreground">{text}</span>
      {/* Colored Text wiping in from left to right */}
      <motion.span
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: "easeInOut", delay: 0.2 }}
        className="absolute inset-0 text-destructive font-black whitespace-nowrap overflow-hidden"
      >
        {text}
      </motion.span>
    </span>
  );
}

// --- FRONT HIGHLIGHT ANIMATION 2: The Cinematic Box Reveal ---
function BoxRevealHighlight({ text }: { text: string }) {
  return (
    <span className="relative inline-flex overflow-hidden px-2 mt-1">
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.1, delay: 0.3 }}
        className="text-primary font-black relative z-10"
      >
        {text}
      </motion.span>
      {/* The Solid Block that slides across */}
      <motion.div
        initial={{ x: "-100%" }}
        whileInView={{ x: "100%" }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="absolute inset-0 z-20 bg-destructive"
      />
    </span>
  );
}

// --- FRONT HIGHLIGHT ANIMATION 3: The Metallic Gradient Shine ---
function GradientShineHighlight({ text }: { text: string }) {
  return (
    <motion.span
      initial={{ backgroundPosition: "200% center" }}
      whileInView={{ backgroundPosition: "0% center" }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
      className="inline-block bg-[linear-gradient(110deg,#0f172a,45%,#d85c34,55%,#d85c34)] bg-[length:200%_100%] bg-clip-text text-transparent font-black tracking-tight"
    >
      {text}
    </motion.span>
  );
}

// --- STORY DATA ---
const stories = [
  {
    id: 1,
    student: "Ayaan Bhat",
    university: "Kazan Federal University, Russia",
    currentStatus: "3rd Year Medical Student",
    titlePrefix: "Overcoming NEET Anxiety to",
    titleHighlight: "Thriving in Kazan",
    highlightType: "fill",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=1000&auto=format&fit=crop",
    story: "Ayaan had a dream of wearing the white coat, but when his NEET scores hovered around the borderline, panic set in. The prospect of losing a year or paying exorbitant private college fees in India was daunting for his family.\n\nWhen Ayaan approached The Career Advisors, our expert counsellors immediately mapped his score to government-approved universities in Russia. We handled his entire documentation process—from apostille to visa—ensuring zero delays. Today, Ayaan is excelling in his 3rd year at Kazan Federal, completely focused on his studies rather than administrative stress."
  },
  {
    id: 2,
    student: "Zara Sheikh",
    university: "Tbilisi State Medical University, Georgia",
    currentStatus: "FMGE Cleared, Practicing in India",
    titlePrefix: "Lost in Paperwork to a",
    titleHighlight: "Seamless Flight to Georgia",
    highlightType: "box",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop",
    story: "Zara was clear about her destination: Georgia. However, she had previously been misled by unregistered agents who demanded hidden fees and delayed her admission letter for months.\n\nShe came to us seeking transparency. Within 48 hours, our team secured her direct admission letter. We provided her family with a strict, transparent fee structure with absolutely zero hidden charges. We didn't just stop at the visa; our representative travelled with Zara's batch to Tbilisi, ensuring she settled comfortably into her hostel. She recently cleared her FMGE on the first attempt."
  },
  {
    id: 3,
    student: "Rohan Verma",
    university: "Alexandria University, Egypt",
    currentStatus: "Clinical Rotation Phase",
    titlePrefix: "A Small-Town Dream to",
    titleHighlight: "Global Medical Excellence",
    highlightType: "shine",
    image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=1000&auto=format&fit=crop",
    story: "Coming from a humble background, Rohan’s primary concern was finding an affordable medical education without compromising on clinical exposure and WHO recognition. Egypt wasn't initially on his radar.\n\nOur counselling team sat down with Rohan and his parents to explain the high clinical standards and affordability of Egyptian universities. We guided him toward Alexandria University. Thanks to the rigorous curriculum and our continuous academic support through our alumni network, Rohan is now in his clinical rotation phase, gaining hands-on experience in world-class hospitals."
  }
];

export default function SuccessStoriesPage() {
  // Ensure the page snaps to the top when navigating from another route
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24 font-sans">
      
      {/* ULTRA-COMPACT HEADER */}
      <section className="relative pt-10 pb-10 overflow-hidden bg-primary text-primary-foreground border-b border-border/20">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight leading-tight">
            Real Journeys. <br className="md:hidden" />
            <span className="text-accent ml-2">Extraordinary Outcomes.</span>
          </h1>
          {/* Subtle vertical divider on desktop */}
          <div className="hidden md:block w-px h-12 bg-primary-foreground/20"></div>
          <p className="text-sm md:text-base text-primary-foreground/80 font-medium max-w-md text-left hidden md:block">
            Behind every admission letter is a story of determination. Read how we helped these aspiring doctors navigate their path to success.
          </p>
        </div>
      </section>

      {/* STORIES FEED */}
      <section className="container mx-auto px-4 md:px-8 mt-16 space-y-24">
        {stories.map((story, index) => {
          const isEven = index % 2 === 0;

          return (
            <div key={story.id} className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-16 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
              
              {/* IMAGE BLOCK */}
              <motion.div 
                initial={{ opacity: 0, x: isEven ? -40 : 40 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full lg:w-1/2 relative group"
              >
                <div className="absolute inset-0 bg-primary/10 translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 rounded-3xl -z-10 transition-transform group-hover:translate-x-5 group-hover:translate-y-5"></div>
                <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-border/50 shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={story.image} alt={story.student} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Student Tag */}
                  <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-bold font-heading text-2xl drop-shadow-md">{story.student}</p>
                    <div className="flex items-center gap-2 text-sm font-bold text-white/90 mt-1">
                      <GraduationCap className="w-4 h-4 text-destructive" /> {story.currentStatus}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* CONTENT BLOCK */}
              <div className="w-full lg:w-1/2">
                {/* Dynamic Front-Highlighted Title */}
                <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-foreground mb-6 leading-[1.1] tracking-tight">
                  {story.titlePrefix} <br className="hidden sm:block" />
                  {story.highlightType === 'fill' && <TextFillHighlight text={story.titleHighlight} />}
                  {story.highlightType === 'box' && <BoxRevealHighlight text={story.titleHighlight} />}
                  {story.highlightType === 'shine' && <GradientShineHighlight text={story.titleHighlight} />}
                </h2>

                <div className="flex items-center gap-2 mb-6 px-4 py-2 bg-muted/60 rounded-xl border border-border/50 w-fit shadow-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-foreground/80">{story.university}</span>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-4 -left-4 w-12 h-12 text-primary/10 rotate-180" />
                  {story.story.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-base md:text-lg text-foreground/70 leading-relaxed mb-4 relative z-10 font-medium">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

            </div>
          );
        })}
      </section>

      {/* BOTTOM CTA */}
      <section className="container mx-auto px-4 md:px-8 mt-24">
        <div className="bg-card rounded-3xl p-10 md:p-16 text-center border border-border/50 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors duration-700"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-destructive/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 group-hover:bg-destructive/10 transition-colors duration-700"></div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading mb-4 relative z-10 text-foreground tracking-tight">
            Your story could be next.
          </h2>
          <p className="text-base md:text-lg text-foreground/60 mb-10 max-w-2xl mx-auto relative z-10 font-medium">
            Stop worrying about cutoffs and hidden fees. Let our experts craft a personalized medical admission roadmap for you today.
          </p>
          
          <div className="relative z-10">
            <InquiryModal>
              <Button size="lg" className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-lg px-10 py-7 rounded-full shadow-lg shadow-destructive/20 active:scale-95 transition-all cursor-pointer font-bold tracking-wide">
                Start Your Journey Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </InquiryModal>
          </div>
        </div>
      </section>

    </div>
  );
}