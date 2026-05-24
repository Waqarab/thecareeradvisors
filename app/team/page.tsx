"use client";

import { motion } from "framer-motion";
import { Phone, Mail, Award } from "lucide-react";
import { useEffect } from "react";

// Unified Team Data
const teamMembers = [
  { 
    id: 1, 
    name: "Waqar Abdullah", 
    role: "Founder & CEO", 
    experience: "10+ Years",
    desc: "Leading The Career Advisors with a vision to transform international medical education and ensure transparent guidance for every student.", 
    image: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779560322/waqarportrait_ktr3dd.png",
    phone: "+91 60051 52350",
    isFounder: true
  },
  { 
    id: 2, 
    name: "Dr. Gurwinder Singh", 
    role: "Punjab Office Head", 
    experience: "10+ Years",
    desc: "Heads the Punjab operations. Plays an important role in helping students and parents make informed decisions regarding overseas education.", 
    image: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779612288/Gurwinder_iueopx.jpg",
    phone: "+91 79733 03699"
  },
  { 
    id: 3, 
    name: "Mr. Salman Yousuf", 
    role: "Manager", 
    experience: "5 Years",
    desc: "Plays a key role in managing organizational operations, student coordination, and administrative activities to ensure smooth communication.", 
    image: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779570304/WhatsApp_Image_2026-05-24_at_02.30.20_rzydzz.jpg",
    phone: "+91 96826 23762"
  },
  { 
    id: 4, 
    name: "Mr. Danish Shafi", 
    role: "Head Counsellor", 
    experience: "4 Years",
    desc: "Leads the counseling department and guides students regarding university selection, country options, scholarships, and career planning.", 
    image: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779570303/WhatsApp_Image_2026-05-24_at_02.34.36_gagizs.jpg",
    phone: "+91 96226 18773"
  },
  { 
    id: 5, 
    name: "Ms. Sadiya Sofi", 
    role: "Student Relationship Manager", 
    experience: "5 Years",
    desc: "Specializes in student relationship management. Works closely with students and parents throughout counseling and admission procedures.", 
    image: "https://cdn.vectorstock.com/i/500p/60/84/faceless-woman-in-blue-hijab-vector-61316084.jpg",
    phone: "+91 96826 26537"
  },
  { 
    id: 6, 
    name: "Ms. Maroosha Shabir", 
    role: "Student Support Executive", 
    experience: "5 Years",
    desc: "Responsible for assisting students with documentation, communication, and application support to ensure a smooth admission journey.", 
    image: "https://cdn.vectorstock.com/i/500p/60/84/faceless-woman-in-blue-hijab-vector-61316084.jpg", // Placeholder
    phone: "+91 91499 15420"
  },
  { 
    id: 7, 
    name: "Mr. Junaid Aslam", 
    role: "Counsellor", 
    experience: "2 Years",
    desc: "Assists students with admission counseling, university information, and application procedures according to their academic goals.", 
    image: "https://res.cloudinary.com/drytpdpx3/image/upload/q_auto/f_auto/v1779570304/WhatsApp_Image_2026-05-24_at_02.33.29_yxfwdt.jpg", // Placeholder
    phone: "+91 60055 28734"
  }
];

export default function TeamPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-24 font-sans selection:bg-blue-100">
      
      {/* SLIM, HIGH-IMPACT HEADER */}
      <section className="relative pt-12 pb-8 lg:pt-16 lg:pb-10 overflow-hidden bg-white border-b border-slate-100 shadow-sm">
        {/* Modern background mesh effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[100%] max-w-[1200px] h-full flex justify-center opacity-40 pointer-events-none">
          <div className="w-1/2 h-full bg-blue-100 blur-[80px] rounded-full mix-blend-multiply"></div>
          <div className="w-1/2 h-full bg-orange-50 blur-[80px] rounded-full mix-blend-multiply -ml-20"></div>
        </div>

        <div className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10 text-center">

          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight text-balance"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            The Minds Behind - The Career Advisors
            
          </motion.h1>
        </div>
      </section>

      {/* UNIFIED TEAM DIRECTORY (Modern Card Grid) */}
      <section className="container max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 mt-12 lg:mt-16">
        
        {/* Premium Grid: 1 col on mobile, 2 on tablet, 3 or 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {teamMembers.map((member, memberIdx) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: memberIdx * 0.1 }}
              className={`group bg-white rounded-3xl p-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_15px_35px_-10px_rgba(37,99,235,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden ${
                member.isFounder ? 'border-2 border-yellow-400/50' : 'border border-slate-100'
              }`}
            >
              {/* Premium Glow for Founder */}
              {member.isFounder && (
                <div className="absolute inset-0 bg-gradient-to-b from-yellow-50/50 to-transparent pointer-events-none rounded-3xl"></div>
              )}

              {/* Portrait Image Area */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-4 bg-slate-100 z-10">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Experience Badge overlaying image */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm flex items-center gap-1 border border-white/40">
                  <Award className="w-3 h-3 text-blue-600" />
                  {member.experience} Exp.
                </div>

                {/* Inner shadow for depth */}
                <div className="absolute inset-0 border border-black/5 rounded-2xl pointer-events-none"></div>
              </div>

              {/* Content Area */}
              <div className="px-3 pb-2 flex-1 flex flex-col z-10">
                <h3 
                  className={`text-xl font-bold leading-tight mb-1 transition-colors ${
                    member.isFounder ? 'text-slate-900 group-hover:text-yellow-600' : 'text-slate-900 group-hover:text-blue-600'
                  }`}
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {member.name}
                </h3>
                <p className="text-[11px] font-bold text-orange-500 uppercase tracking-widest mb-3">
                  {member.role}
                </p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed mb-4 flex-1">
                  {member.desc}
                </p>
                
                {/* Footer Actions */}
                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  {/* Interactive Phone Button */}
                  <a 
                    href={`tel:${member.phone.replace(/\s+/g, '')}`} 
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-xl border border-slate-200 hover:border-blue-200 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    {member.phone}
                  </a>
                  
                  {/* Quick Mail Button */}
                  <a 
                    href="mailto:info@thecareeradvisors.in" 
                    className="w-10 h-10 shrink-0 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-blue-600 rounded-xl border border-slate-200 transition-colors"
                    aria-label="Send Email"
                  >
                    <Mail className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
}