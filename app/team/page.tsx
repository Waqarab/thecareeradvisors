"use client";

import { motion } from "framer-motion";
import { Share2, Mail, Phone } from "lucide-react";
import { useEffect } from "react";

const allTeamMembers = [
  {
    category: "Board of Directors",
    members: [
      { name: "Dr. Tariq Ahmed", role: "Founder & Director", desc: "15+ years in medical education.", image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop" },
      { name: "Sarah Khan", role: "Co-Founder & Head of Admissions", desc: "Expert in global university compliances.", image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop" },
    ]
  },
  {
    category: "Academic Counselling Experts",
    members: [
      { name: "Vikram Singh", role: "Senior Medical Counsellor", desc: "Specializes in Russian & CIS universities.", image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop" },
      { name: "Aisha Patel", role: "Career Advisor", desc: "Guides students on FMGE/NEXT preparation.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=600&auto=format&fit=crop" },
      { name: "Rizwan Ali", role: "Student Welfare Officer", desc: "Ensures smooth hostel and campus transition.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=600&auto=format&fit=crop" },
    ]
  },
  {
    category: "Visa & Legal Operations",
    members: [
      { name: "Priya Sharma", role: "Head of Visa Processing", desc: "Maintains a 100% visa success rate.", image: "https://images.unsplash.com/photo-1598550874175-4d0ef436c909?q=80&w=600&auto=format&fit=crop" },
    ]
  }
];

export default function TeamPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24 font-sans">
      
      {/* HEADER */}
      <section className="bg-primary pt-32 pb-20 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="container mx-auto px-4 md:px-8 relative z-10 text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight">
            The Minds Behind <span className="text-accent block mt-2">The Career Advisors</span>
          </h1>
          <p className="text-lg md:text-xl text-primary-foreground/80 font-medium max-w-2xl mx-auto">
            Our entire organization is built on transparency, dedication, and the relentless pursuit of securing your future.
          </p>
        </div>
      </section>

      {/* TEAM DIRECTORY */}
      <section className="container mx-auto px-4 md:px-8 mt-16 space-y-20">
        {allTeamMembers.map((group, groupIdx) => (
          <div key={groupIdx}>
            {/* Category Title */}
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-foreground shrink-0">{group.category}</h2>
              <div className="h-px w-full bg-border/60"></div>
            </div>

            {/* Members Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-x-8 gap-y-12">
              {group.members.map((member, memberIdx) => (
                <motion.div
                  key={memberIdx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: memberIdx * 0.1 }}
                  className="flex gap-5 group"
                >
                  <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 rounded-2xl overflow-hidden bg-muted border border-border/50 shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg md:text-xl font-bold font-heading text-foreground group-hover:text-primary transition-colors leading-tight">{member.name}</h3>
                    <p className="text-xs md:text-sm font-bold text-destructive uppercase tracking-wider mt-1 mb-2">{member.role}</p>
                    <p className="text-sm text-foreground/70 font-medium leading-snug">{member.desc}</p>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <button className="text-foreground/40 hover:text-primary transition-colors"><Share2 className="w-4 h-4" /></button>
                      <button className="text-foreground/40 hover:text-primary transition-colors"><Mail className="w-4 h-4" /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </section>

    </div>
  );
}