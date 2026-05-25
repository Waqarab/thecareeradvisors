"use client";

import { motion, useMotionValue, useSpring, useScroll, useTransform, Variants } from "framer-motion";
import { Target, Eye, History, Globe2, Sparkles, ChevronRight, GraduationCap, MapPin, Users, Award, Quote, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import InquiryModal from "@/components/InquiryModal";
import { useEffect } from "react";

// --- BRAND COLOR PALETTE MAP ---
// Glaucous: #6082B6
// Spicy Paprika: #D85C34
// Porcelain: #F2F3F4
// Ivory: #FFFFF0
// Dusk Blue: #3A5F8B
// Pale Sky: #AEC6CF

// --- ANIMATION VARIANTS ---
const smoothReveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

// --- CUSTOM ANIMATED COMPONENTS ---

const DarkenHighlight = ({ text }: { text: string }) => (
  <span className="relative inline-block px-1 md:px-2 z-10">
    <span className="relative z-10">{text}</span>
    <motion.span
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: "circOut", delay: 0.2 }}
      className="absolute inset-0 bg-[#AEC6CF]/60 mix-blend-darken origin-left -z-10 rounded-sm"
    />
  </span>
);

const AnimatedLine = ({ className = "bg-[#AEC6CF]/40", delay = 0 }: { className?: string, delay?: number }) => (
  <motion.div
    initial={{ scaleX: 0 }}
    whileInView={{ scaleX: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay }}
    className={`h-px w-full origin-left ${className}`}
  />
);

const PulseButton = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    animate={{ 
      boxShadow: ["0px 0px 0px 0px rgba(216,92,52,0.4)", "0px 0px 0px 20px rgba(216,92,52,0)"] 
    }}
    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    className="rounded-full inline-block"
  >
    <Button size="lg" className={`bg-[#D85C34] text-white hover:bg-[#b84c2a] text-base md:text-lg px-8 py-6 md:px-10 md:py-7 rounded-full shadow-lg transition-all font-black tracking-wide flex items-center mx-auto ${className}`}>
      {children}
    </Button>
  </motion.div>
);

export default function AboutPage() {
  const mouseX = useMotionValue(-1000); 
  const mouseY = useMotionValue(-1000);
  
  const springX = useSpring(mouseX, { stiffness: 800, damping: 30, mass: 0.1 });
  const springY = useSpring(mouseY, { stiffness: 800, damping: 30, mass: 0.1 });

  const { scrollYProgress } = useScroll();
  const yParallaxFast = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const yParallaxSlow = useTransform(scrollYProgress, [0, 1], [0, -80]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // JSON-LD SCHEMA FOR GOOGLE SEARCH & IMAGE RANKING
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "The Career Advisors",
    "alternateName": "Best Educational Consultancy near me",
    "description": "The top-rated educational consultancy in Srinagar, Kashmir, specializing in guaranteed MBBS admission guidance worldwide.",
    "foundingDate": "2016",
    "founder": {
      "@type": "Person",
      "name": "Waqar Abdullah",
      "jobTitle": "Founder & Director",
      "image": "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779560322/waqarportrait_ktr3dd.png",
      "url": "https://thecareeradvisors.in/about"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Srinagar",
      "addressRegion": "Jammu and Kashmir",
      "addressCountry": "IN"
    }
  };

  return (
    <div className="w-full font-sans selection:bg-[#6082B6] selection:text-white bg-[#F2F3F4] relative flex flex-col">
      
      {/* Inject SEO Schema invisibly into the head */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }} />

      <motion.div 
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }} 
        className="fixed top-0 left-0 w-40 h-40 bg-gradient-to-tr from-[#AEC6CF]/60 to-[#86EFAC]/50 blur-[50px] rounded-full pointer-events-none z-[1] hidden md:block" 
      />

      <div className="fixed inset-0 pointer-events-none z-0 opacity-40 mix-blend-multiply bg-[linear-gradient(to_right,#AEC6CF30_1px,transparent_1px),linear-gradient(to_bottom,#AEC6CF30_1px,transparent_1px)] bg-[size:40px_40px]"></div>

      {/* ========================================= */}
      {/* 1. NEWSPAPER EDITORIAL: SEO SECTION 1       */}
      {/* ========================================= */}
      <section className="relative pt-32 pb-12 md:pt-40 md:pb-16 z-10 bg-[#FFFFF0]">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
          
          {/* THE MASTER H1 FOR SEO */}
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="text-center mb-8 md:mb-12 border-b-2 border-[#22354a] pb-8">
            <motion.p variants={smoothReveal} className="text-[#6082B6] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
              Est. 2016 • Srinagar, Jammu & Kashmir
            </motion.p>
            <motion.h1 variants={smoothReveal} className="text-4xl md:text-6xl lg:text-[4.5rem] font-serif font-black text-[#22354a] leading-[1.05] tracking-tight">
              The Career Advisors: <br />
              <span className="font-sans font-extrabold text-[#3A5F8B] text-3xl md:text-5xl lg:text-6xl tracking-tight">
                Best Educational Consultancy Near Me in Srinagar, Kashmir.
              </span>
            </motion.h1>
          </motion.div>

          {/* Newspaper Column Layout */}
          <motion.div variants={smoothReveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-[#22354a] md:columns-2 gap-10 md:gap-16 text-justify space-y-6 md:space-y-0 text-base md:text-lg leading-relaxed">
            <p className="first-letter:text-6xl md:first-letter:text-7xl first-letter:font-serif first-letter:font-black first-letter:text-[#6082B6] first-letter:mr-3 first-letter:float-left first-letter:leading-none">
              When students and parents search for the <strong>"best educational consultancy near me"</strong> in Srinagar, Kashmir, or across J&K, they are looking for more than just an admissions broker; they are looking for a trusted mentor. Established in 2016, The Career Advisors was founded with a singular, powerful vision: to bridge the gap between ambitious medical aspirants in Jammu and Kashmir and world-class universities globally. 
            </p>
            <p>
              Over the years, we have organically grown to become the most sought-after education consultancy in Srinagar. We recognized early on that navigating the complexities of international medical admissions—from NMC regulations and WHO approvals to visa processing—was overwhelming. Our foundation is built on absolute transparency, ensuring every student who walks through our doors is given realistic, accurate, and highly personalized guidance.
            </p>
            <p>
              Our primary aim is not just to secure an admission seat, but to carefully curate a pathway that guarantees a successful medical career. We meticulously evaluate universities based on FMGE/NEXT passing ratios, clinical exposure, infrastructure, and safety protocols before we ever recommend them to our students.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 2. NEWSPAPER EDITORIAL: SEO SECTION 2       */}
      {/* ========================================= */}
      <section className="relative py-12 md:py-16 z-10 bg-white border-t border-b border-[#AEC6CF]/40">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl relative z-10">
          
          {/* H2 FOR SEO SUB-TOPIC */}
          <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-8 md:mb-12">
            <motion.h2 variants={smoothReveal} className="text-3xl md:text-5xl font-serif font-black text-[#22354a] leading-tight border-l-4 border-[#D85C34] pl-4 md:pl-6">
              Guiding Dreams: Why We Are The Top MBBS Admission Consultancy in J&K
            </motion.h2>
          </motion.div>

          <motion.div variants={smoothReveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-[#3A5F8B] text-base md:text-lg leading-relaxed space-y-6">
            <p>
              Our core motive is student empowerment. We believe that financial constraints or a lack of accurate information should never be the reason a deserving candidate gives up on their dream of wearing the white coat. By providing honest fee structures without hidden charges, complete documentation support, and continuous post-arrival assistance, we ensure our students focus entirely on their medical education.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-[#FFFFF0] p-6 border border-[#AEC6CF]/30 shadow-sm">
                <h3 className="font-bold text-[#22354a] text-xl mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#6082B6]" /> 100% Transparent Processing</h3>
                <p className="text-sm md:text-base">No hidden charges, no false promises. As the leading education consultancy in Kashmir, we provide a complete breakdown of expenses from day one.</p>
              </div>
              <div className="bg-[#FFFFF0] p-6 border border-[#AEC6CF]/30 shadow-sm">
                <h3 className="font-bold text-[#22354a] text-xl mb-2 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-[#6082B6]" /> Direct University Tie-ups</h3>
                <p className="text-sm md:text-base">We are official representatives of top-tier, WHO, and NMC approved medical institutions, making us the top choice for MBBS abroad.</p>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ========================================= */}
      {/* 3. FOUNDER'S NOTE                           */}
      {/* ========================================= */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 z-10 overflow-hidden bg-[#F2F3F4]">
        <motion.div style={{ y: yParallaxFast }} className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#6082B6]/20 rounded-full blur-[100px] -z-10 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            
            <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="lg:col-span-7">
              <motion.div variants={smoothReveal} className="flex items-center gap-2 text-[#3A5F8B] font-bold tracking-[0.15em] uppercase mb-6 text-xs md:text-sm">
                <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-[#6082B6]" /> A Message from the Founder
              </motion.div>

              <motion.h2 variants={smoothReveal} className="text-4xl md:text-5xl lg:text-6xl font-black text-[#22354a] leading-[1.1] mb-6 tracking-tight">
                Empowering Your Dream to <br className="hidden md:block" />
                <DarkenHighlight text="Heal the World." />
              </motion.h2>

              <AnimatedLine className="bg-[#6082B6]/30 mb-6 max-w-sm" delay={0.4} />
              
              <motion.div variants={smoothReveal} className="space-y-4 md:space-y-6 text-base md:text-lg text-[#3A5F8B]/80 font-medium leading-relaxed max-w-2xl">
                <p>
                  As children, many of us dream of becoming doctors. This noble profession not only earns societal respect but opens doors to <DarkenHighlight text="endless global opportunities" />. Unfortunately, many miss this chance simply due to a lack of proper guidance.
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                  className="py-4 pl-6 md:py-6 md:pl-8 border-l-4 border-[#D85C34] relative group"
                >
                  <Quote className="absolute -top-2 -left-3 md:-top-3 md:-left-4 w-6 h-6 md:w-8 md:h-8 text-[#AEC6CF]/50 rotate-180 -z-10 group-hover:scale-125 group-hover:text-[#6082B6]/30 transition-all duration-500" />
                  <p className="text-[#3A5F8B] font-serif italic text-xl md:text-2xl leading-snug">
                    "At The Career Advisors, we are dedicated to helping you realize your dreams of studying MBBS worldwide. Your ambition is our mission."
                  </p>
                </motion.div>

                <p>
                  We have successfully guided tens of thousands of students from India and abroad. Our expert consultants provide <DarkenHighlight text="personalized support" /> tailored to your unique profile and eligibility, ensuring you step confidently into your medical career.
                </p>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }} 
              whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }} 
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} 
              className="lg:col-span-5 relative mt-8 lg:mt-0"
            >
              <div className="absolute -inset-3 md:-inset-4 bg-[#AEC6CF]/30 rounded-[1.5rem] md:rounded-[2rem] -z-10 rotate-3 animate-pulse"></div>
              
              <div className="relative aspect-[4/5] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl bg-[#FFFFF0] group">
                <img 
                  src="https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779560322/waqarportrait_ktr3dd.png" 
                  alt="Waqar Abdullah - Founder & Director of The Career Advisors, Best Education Consultancy in Srinagar, J&K" 
                  title="Waqar Abdullah - Founder & Director"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1b2f45] via-[#1b2f45]/20 to-transparent"></div>
                
                <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 md:right-8">
                  <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">Waqar Abdullah</h3>
                    <p className="text-[#AEC6CF] font-bold text-xs md:text-sm tracking-widest uppercase mt-1 md:mt-2">Founder & Director- The Career Advisors</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 4. THE PILLARS                              */}
      {/* ========================================= */}
      <section className="py-16 md:py-24 relative z-10 bg-transparent">
        <AnimatedLine className="bg-[#6082B6]/20 mb-16 max-w-7xl mx-auto" />
        
        <div className="container mx-auto px-4 md:px-8 max-w-7xl">
          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            className="grid md:grid-cols-2 gap-10 md:gap-16 lg:gap-20"
          >
            {[
              { title: "About Us", icon: Users, color: "text-[#6082B6]", bg: "bg-[#6082B6]/10", desc: "We guide students through the exact processes needed to reach their dream of becoming a doctor, tailored for specific eligibilities. Our team ensures you get admitted into courses best suited for your aspirations." },
              { title: "Our Mission", icon: Target, color: "text-[#D85C34]", bg: "bg-[#D85C34]/10", desc: "To empower students by providing end-to-end guidance. From university selection to visas, we simplify international education. We aim to equip students with confidence and resources for global success." },
              { title: "Our Vision", icon: Eye, color: "text-[#3A5F8B]", bg: "bg-[#3A5F8B]/10", desc: "To become a trusted leader in international education consultancy. We provide transparent support and comprehensive solutions, transforming raw aspirations into successfully recognized medical careers." },
              { title: "Our History", icon: History, color: "text-[#6082B6]", bg: "bg-[#AEC6CF]/30", desc: "A premier consultancy with years of expertise. We understand the challenges of studying abroad and prioritize integrity and student-centric guidance to make the global transition completely seamless." }
            ].map((pillar, i) => (
              <motion.div key={i} variants={smoothReveal} className="flex flex-col sm:flex-row gap-4 md:gap-6 group">
                <div className={`shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#FFFFF0] shadow-md border border-[#AEC6CF]/30 flex items-center justify-center ${pillar.color} ${pillar.bg} group-hover:rotate-12 transition-transform duration-500`}>
                  <pillar.icon className="w-6 h-6 md:w-8 md:h-8" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-[#22354a] mb-2 md:mb-3 tracking-tight">{pillar.title}</h3>
                  <AnimatedLine className="bg-[#AEC6CF]/40 mb-3" />
                  <p className="text-[#3A5F8B]/80 font-medium text-sm md:text-base leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="mt-20 md:mt-32 max-w-4xl mx-auto text-center"
          >
            <h2 className="text-xs md:text-sm font-bold tracking-[0.2em] text-[#6082B6] uppercase mb-4 md:mb-6">The Impact We Make</h2>
            <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif italic text-[#22354a] leading-tight mb-6 md:mb-8">
              "We take great pride in our journey, ensuring access to <DarkenHighlight text="high-quality education" /> and international exposure."
            </h3>
            <p className="text-base md:text-lg text-[#3A5F8B]/80 font-medium leading-relaxed px-4 md:px-0">
              Our services cover MBBS, MDS, MS/MD, and Ph.D. programs, making global medical education accessible. From initial counseling to application processing and visa guidance, our team provides <DarkenHighlight text="transparent support" />. Today, The Career Advisors is recognized globally as a highly reliable partner.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 5. OUR REACH                                */}
      {/* ========================================= */}
      <section className="py-20 md:py-32 bg-[#3A5F8B] text-[#FFFFF0] relative z-10 overflow-hidden">
        <motion.div style={{ y: yParallaxFast }} className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#6082B6]/30 rounded-full blur-[100px] pointer-events-none" />
        <motion.div style={{ y: yParallaxSlow }} className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#AEC6CF]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
          
          <div className="text-center mb-16 md:mb-20">
            <motion.h2 variants={smoothReveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-3xl md:text-5xl lg:text-6xl font-black text-[#FFFFF0] mb-4 md:mb-6 tracking-tight">
              Our Global <span className="font-serif italic font-normal text-[#AEC6CF]">Reach</span>
            </motion.h2>
            <AnimatedLine className="bg-[#AEC6CF]/30 mb-6 max-w-md mx-auto" />
            <motion.p variants={smoothReveal} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-[#AEC6CF] font-medium text-base md:text-lg max-w-2xl mx-auto">
              Numbers that reflect our dedication, transparency, and your unwavering trust in us.
            </motion.p>
          </div>

          <motion.div 
            variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12 mb-20 md:mb-24"
          >
            {[
              { label: "Students Counselled", value: "5,000+", icon: Users },
              { label: "Placed Abroad", value: "500+", icon: GraduationCap },
              { label: "Universities Supported", value: "56+", icon: Globe2 },
              { label: "Years of Excellence", value: "10+", icon: Award },
            ].map((stat, i) => (
              <motion.div key={i} variants={smoothReveal} className="text-center group">
                <stat.icon className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-4 md:mb-6 text-[#AEC6CF] group-hover:text-[#FFFFF0] group-hover:scale-110 transition-all duration-500" />
                <h3 className="text-3xl md:text-5xl font-black mb-2 text-[#FFFFF0] drop-shadow-sm tracking-tighter">
                  {stat.value}
                </h3>
                <p className="text-xs md:text-sm text-[#AEC6CF]/80 font-bold uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div>
            <h3 className="text-xl md:text-2xl font-bold text-[#FFFFF0] mb-8 text-center tracking-tight">Top Destinations for our Students</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-6">
              {[
                { name: "Kyrgyzstan", students: "90+ Placed", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Flag_of_Kyrgyzstan.svg/1280px-Flag_of_Kyrgyzstan.svg.png" },
                { name: "Uzbekistan", students: "300+ Placed", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Flag_of_Uzbekistan.svg/330px-Flag_of_Uzbekistan.svg.png" },
                { name: "Kazakhstan", students: "150+ Placed", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Flag_of_Kazakhstan_%283-2%29.svg/1280px-Flag_of_Kazakhstan_%283-2%29.svg.png" },
                { name: "Bangladesh", students: "250+ Placed", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Flag_of_Bangladesh.svg/1280px-Flag_of_Bangladesh.svg.png" },
                { name: "Egypt", students: "200+ Placed", img: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Flag_of_Egypt.svg/1280px-Flag_of_Egypt.svg.png" }
              ].map((country, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ delay: idx * 0.1, duration: 0.6 }}
                  key={country.name} className="relative aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden group cursor-pointer border border-[#6082B6]/40 shadow-lg"
                >
                  <img src={country.img} alt={`MBBS in ${country.name}`} title={`Study MBBS in ${country.name} with The Career Advisors`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1b2f45] via-[#1b2f45]/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-5 md:left-5 md:right-5">
                    <h4 className="text-[#FFFFF0] font-black text-lg md:text-xl mb-1.5 md:mb-2 flex items-center gap-1.5 md:gap-2"><MapPin className="w-3 h-3 md:w-4 md:h-4 text-[#AEC6CF]" /> {country.name}</h4>
                    <span className="inline-block border border-[#AEC6CF]/30 bg-[#6082B6]/20 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-md md:rounded-lg text-[10px] md:text-xs font-bold text-[#FFFFF0] uppercase tracking-wider">
                      {country.students}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ========================================= */}
      {/* 6. CTA SECTION                              */}
      {/* ========================================= */}
      <section className="pt-20 pb-16 md:pt-32 md:pb-24 relative z-10 bg-[#FFFFF0] overflow-hidden">
        
        <motion.img
          src="https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779390076/download_1_-Photoroom_1_tepfkp.png"
          alt="Happy Medical Student smiling - The Career Advisors"
          initial={{ x: -150, opacity: 0, rotate: -5 }}
          whileInView={{ x: 0, opacity: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 bottom-0 w-[200px] md:w-[300px] lg:w-[350px] xl:w-[450px] object-contain opacity-20 md:opacity-90 pointer-events-none z-0 transform translate-y-12 md:translate-y-4 lg:translate-x-4"
        />

        <motion.img
          src="https://res.cloudinary.com/drytpdpx3/image/upload/f_webp/q_auto:eco/Best_Diagnostic_Centre_in_Chandigarh_Offering_Advanced_Imaging_and_Lab_Services_Sanjivini_Diagnost-Photoroom_ohgj9w.png"
          alt="Female Doctor with Stethoscope - The Career Advisors"
          initial={{ x: 150, opacity: 0, rotate: 5 }}
          whileInView={{ x: 0, opacity: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="absolute right-0 bottom-0 w-[200px] md:w-[300px] lg:w-[350px] xl:w-[450px] object-contain opacity-20 md:opacity-90 pointer-events-none z-0 transform translate-y-12 md:translate-y-4 lg:-translate-x-4"
        />

        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl relative z-10">
          <motion.div variants={smoothReveal} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-50px" }}>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-[#22354a] mb-4 md:mb-6 tracking-tighter">
                Ready to wear the <br className="hidden md:block" /> 
                <span className="relative inline-block">
                  <span className="font-serif italic font-normal text-[#6082B6] relative z-10">White Coat?</span>
                  <AnimatedLine className="absolute bottom-1 md:bottom-2 left-0 h-2 md:h-3 bg-[#AEC6CF]/40 z-0" delay={0.5} />
                </span>
              </h2>
            </motion.div>

            <p className="text-base md:text-xl text-[#3A5F8B]/80 mb-10 md:mb-12 font-medium leading-relaxed max-w-2xl mx-auto px-2">
              Sit down with our experts for a completely free, highly transparent counselling session. Let's find the absolute best medical university for you.
            </p>
            
            <InquiryModal>
              <PulseButton>
                Book Free Consultation
                <ChevronRight className="ml-2 w-5 h-5 md:w-6 md:h-6 text-white" />
              </PulseButton>
            </InquiryModal>
          </motion.div>
        </div>
      </section>

      {/* ========================================= */}
      {/* 7. DEDICATED FOOTER CLEARANCE SPACER        */}
      {/* ========================================= */}
      <div className="h-32 md:h-48 w-full bg-[#FFFFF0] relative z-0 shrink-0 border-none m-0 p-0"></div>

    </div>
  );
}