"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What services does The Career Advisors provide?",
    answer: "The Career Advisors provides international education guidance including MBBS abroad admissions, scholarship assistance, university selection, visa guidance, documentation support, and student counseling for various countries."
  },
  {
    question: "Which countries do you work with?",
    answer: "We provide admission support for countries including Bangladesh, Uzbekistan, Egypt, Russia, Kazakhstan, Kyrgyzstan, Tajikistan, Italy, China, UK, Canada, Australia, New Zealand, and Malaysia."
  },
  {
    question: "Do I need NEET for MBBS abroad?",
    answer: "Yes, NEET qualification is mandatory for Indian students planning to pursue MBBS abroad according to current NMC guidelines."
  },
  {
    question: "Are the universities recognized?",
    answer: "Yes, we work with internationally recognized universities approved by relevant authorities and recognized by organizations such as NMC and WHO."
  },
  {
    question: "Do you provide scholarship guidance?",
    answer: "Yes, we assist students with scholarship opportunities available in countries like Bangladesh, Egypt, Italy, China, Kazakhstan, and other destinations depending on eligibility."
  },
  {
    question: "What is the SAARC scholarship in Bangladesh?",
    answer: "SAARC scholarship is a tuition fee concession opportunity available for students from SAARC countries in selected Bangladeshi medical colleges."
  },
  {
    question: "What is IMAT in Italy?",
    answer: "IMAT (International Medical Admissions Test) is the entrance exam for English-medium medical universities in Italy."
  },
  {
    question: "Do you help with visas?",
    answer: "Yes, we provide complete visa guidance including documentation support, application assistance, and interview preparation."
  },
  {
    question: "Do you provide hostel and accommodation support?",
    answer: "Yes, we assist students with hostel arrangements, accommodation guidance, and settlement support abroad."
  },
  {
    question: "Can students apply for programs other than MBBS?",
    answer: "Yes, we also assist students for Undergraduate, Postgraduate, Diploma, and Doctorate programs in multiple countries."
  },
  {
    question: "Is education abroad affordable?",
    answer: "Yes, many countries offer affordable tuition fees, scholarship opportunities, and budget-friendly living costs for international students."
  },
  {
    question: "Do you provide counseling sessions?",
    answer: "Yes, we provide personalized counseling sessions to help students choose the right country, university, and course."
  },
  {
    question: "Where are your offices located?",
    answer: "Our offices are located in Srinagar, Chandigarh, Dhaka, Tashkent, and Cairo."
  },
  {
    question: "How can students contact The Career Advisors?",
    answer: "Students can contact us through phone calls, WhatsApp, website inquiry forms, social media platforms, and office visits."
  },
  {
    question: "Why should students choose The Career Advisors?",
    answer: "Students choose The Career Advisors because of honest guidance, experienced counselors, scholarship support, international presence, and complete admission assistance."
  }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  const initialCount = 7;
  const displayedFaqs = showAll ? faqs : faqs.slice(0, initialCount);

  return (
    <section id="faq" className="py-10 lg:py-16 pb-24 lg:pb-32 bg-card/50 relative z-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1b2f45] mb-8 text-center tracking-tight">
          Frequently Asked Questions
        </h2>
        
        <div className="columns-1 md:columns-2 gap-4 md:gap-6">
          {displayedFaqs.map((faq, index) => (
            <div key={index} className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm break-inside-avoid mb-4">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-semibold text-[#172539] pr-4">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-primary shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 md:p-6 pt-0 text-[#62748e] border-t border-border/50 mt-2 text-sm md:text-base leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* View More / View Less Button */}
        {faqs.length > initialCount && (
          <div className="mt-10 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all duration-300 shadow-sm"
            >
              {showAll ? "View Less" : `View ${faqs.length - initialCount} More FAQs`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}