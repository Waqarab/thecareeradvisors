"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const faqs = [
  { question: "Is MBBS abroad a good option?", answer: "Yes, pursuing MBBS abroad in WHO-recognized universities is an excellent option. It offers high-quality education, global exposure, and is often more affordable." },
  { question: "Which countries are best for MBBS?", answer: "Popular destinations include Russia, Georgia, Kazakhstan, and the Philippines due to their advanced medical infrastructure and affordable fees." },
  { question: "What is the total cost of MBBS abroad?", answer: "The cost varies by country and university, generally ranging from 15 to 35 Lakhs INR, including tuition and hostel fees." },
  { question: "Do you provide admission in government universities?", answer: "Yes, we partner with top-ranked government medical universities that are fully recognized globally." }
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 bg-card/50">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-primary mb-10 text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-secondary/50 transition-colors"
              >
                <span className="font-semibold text-foreground">{faq.question}</span>
                <ChevronDown className={`w-5 h-5 text-primary transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`} />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-6 pt-0 text-foreground/70 border-t border-border/50 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>     
      </div>
    </section>
  );
}