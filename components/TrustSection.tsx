"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Award, Users, ShieldCheck, HeartHandshake } from "lucide-react";

function AnimatedNumber({ value, suffix = "", prefix = "" }: { value: number, suffix?: string, prefix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000;
      const increment = value / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) { setCount(value); clearInterval(timer); }
        else { setCount(Math.floor(start)); }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref} className="text-4xl md:text-5xl font-extrabold text-dusk-blue">{prefix}{count}{suffix}</span>;
}

const trustFactors = [
  { title: "Years Experience", number: 14, suffix: "+", icon: Award },
  { title: "Students Placed", number: 500, suffix: "+", icon: Users },
  { title: "Trustworthy", number: 100, suffix: "%", icon: ShieldCheck },
  { title: "Easy Process", number: 6, prefix: "Easy ", icon: HeartHandshake },
];

export default function TrustSection() {
  return (
    <section className="py-24 bg-porcelain">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold font-heading text-glaucous mb-4">Why Families Trust Us</h2>
          <div className="h-1.5 w-24 bg-spicy-paprika mx-auto rounded-full"></div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFactors.map((factor, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-ivory p-8 rounded-2xl border border-pale-sky/30 shadow-sm text-center">
              <factor.icon className="w-12 h-12 text-spicy-paprika mx-auto mb-6" />
              <AnimatedNumber value={factor.number} suffix={factor.suffix} prefix={factor.prefix} />
              <p className="mt-4 font-bold text-glaucous uppercase tracking-wide text-sm">{factor.title}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}