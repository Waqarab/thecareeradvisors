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
// --- OPTIMIZED STORY DATA ---
// Only first story fully filled, others kept as placeholders for future updates

const stories = [
  {
    id: 1,
    student: "Mehek Rasool",
    university: "Cairo University, Egypt",
    currentStatus: "4th Year Medical Student",
    
    // Strong premium heading
    titlePrefix: "From Uncertainty to a",
    titleHighlight: "White Coat Dream",
    
    // Best animation for emotional impact
    highlightType: "shine",

    // Better responsive image
    image:
      "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779564959/IMG-20260523-WA0087-02_hhv8rd.jpg",

    // Optimized storytelling (shorter for mobile readability)
    story:
      "After completing her schooling, Mehek dreamed of studying medicine abroad but felt overwhelmed by university options, scholarship concerns, and financial pressure.\n\nThat changed when she connected with The Career Advisors. From counseling and university selection to scholarships, visa guidance, and travel preparation — every step was handled with complete transparency and support.\n\nWith the right mentorship and guidance, Mehek successfully secured admission with a scholarship opportunity at Cairo University, Egypt. Today, she is proudly pursuing her 4th year in medicine and building the future she once only dreamed about."
  },

  // --- DUMMY PLACEHOLDERS ---
  {
    id: 2,
    student: "Anzila Tariq",
    university: "AMU Astana, Kazakhstan",
    currentStatus: "5th Year Student & Future Doctor",
    titlePrefix: "Guided Toward Success:",
    titleHighlight: "My Study Abroad Experience",
    highlightType: "box",
    image:
      "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779610868/Anzila_Tariq_ajhjtc.jpg",
    story:
      "“Choosing to study abroad was one of the biggest decisions of my life. I wanted a university that could provide quality education, good clinical exposure, and an affordable fee structure, but finding the right guidance was very difficult in the beginning. That’s when I connected with The Career Advisors. Their team guided me throughout the complete process with honesty and professionalism. They explained different country options, universities, fee structures, and future opportunities in detail, which helped me make the right decision with confidencee. The Career Advisors assisted me in every step including counseling, documentation, admission process, visa guidance, and travel preparation. Their support made the entire journey smooth and stress-free for me and my family. With their guidance, I successfully secured admission at AMU Astana, Kazakhstan. Today, I am proudly pursuing my 5th year of studies and moving closer to achieving my dream careerr. I’m truly thankful to The Career Advisors for their continuous support, genuine guidance, and for helping me take such an important step toward my future.”"
  },

  {
    id: 3,
    student: "Tehreem",
    university: "East West Medical College, Dhaka, Bangladesh",
    currentStatus: "Future Doctor",
    titlePrefix: "Guidance That Changed ",
    titleHighlight: "My Life",
    highlightType: "fill",
    image:
      "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779615176/photo_2026-05-24_15-02-40_klov7b.jpg",
    story:
      "“Before planning to study abroad, I had many doubts regarding safety, education quality, and whether I would be able to adjust to a completely new country and environment. My family was also concerned about choosing the right college and finding genuine guidance. After meeting the team at The Career Advisors, things became much clearer and more comfortable for us. They patiently answered all our questions and helped us understand every part of the process in a very practical and transparent way. What impressed me the most was how supportive they were even after my admission was completed. From documentation and visa procedures to travel guidance and settling in Bangladesh, they stayed connected and helped me whenever needed. With their support, I successfully got admission at East West Medical College, Dhaka, and today I am happily continuing my studies there with confidence. Studying abroad felt challenging at first, but The Career Advisors made the entire journey simple and manageable for me. I’m thankful for their support, honesty, and the trust they built with my family.” "
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
      <section className="relative py-6 md:py-8 overflow-hidden bg-primary text-white border-b border-border/20 shadow-md">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
          <h1 className="text-2xl md:text-4xl font-black font-heading tracking-tight leading-tight drop-shadow-md">
            Real Journeys. <br className="md:hidden" />
            <span className="text-orange-400 ml-1 md:ml-2">Extraordinary Outcomes.</span>
          </h1>
          {/* Subtle vertical divider on desktop */}
          <div className="hidden md:block w-px h-10 bg-white/20"></div>
          <p className="text-xs md:text-sm text-white/90 font-bold max-w-md text-left hidden md:block drop-shadow-sm leading-relaxed">
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
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-0"></div>
                  
                  {/* Student Tag */}
                  <div className="absolute bottom-6 left-6 text-white z-10">
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
                      {paragraph.split(/(The Career Advisors)/g).map((part, index) => 
                        part === "The Career Advisors" ? (
                          <strong key={index} className="font-extrabold italic text-foreground">{part}</strong>
                        ) : (
                          part
                        )
                      )}
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