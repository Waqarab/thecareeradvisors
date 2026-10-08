"use client";

import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, CheckCircle2, MapPin, Phone, Mail, Send } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number required" }),
  neetScore: z.string().optional(),
  preferredCountry: z.string().min(2, { message: "Required" }),
  message: z.string().optional(),
  isUnder18: z.enum(["Yes", "No"], { required_error: "Please select an option", invalid_type_error: "Please select an option" } as any),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the Terms & Privacy Policy" }),
  consentMarketing: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const neetRanges = ["Below 200", "200 - 300", "300 - 400", "400 - 500", "500 - 600", "600+", "Yet to appear"];
const countryOptions = ["Russia", "Kazakhstan", "Bangladesh", "Kyrgyzstan", "Georgia", "Uzbekistan", "Nepal", "Egypt"];

export default function InquirySection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferredCountry: "",
      neetScore: "",
      message: "",
      isUnder18: undefined as any,
      agreeToTerms: false,
      consentMarketing: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      let userSource = "Direct / Other";
      if (typeof window !== "undefined") {
        userSource = localStorage.getItem("tca_user_source") || "Direct / Other";
      }

      const submitData = { ...values } as any;
      submitData.countries = values.preferredCountry ? [values.preferredCountry] : [];
      delete submitData.preferredCountry;

      await addDoc(collection(db, "inquiries"), {
        ...submitData,
        status: "New",
        source: userSource,
        formLocation: "Home Page Section",
        createdAt: serverTimestamp(),
      });

      setIsSuccess(true);
      form.reset();
      
      setTimeout(() => {
        setIsSuccess(false);
      }, 5000);
    } catch (error) {
      console.error("Error saving inquiry: ", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section 
      className="relative py-8 md:py-12 overflow-hidden border-y border-[#1b2f45]/20 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://res.cloudinary.com/drytpdpx3/image/upload/v1791484843/Background_Popup_hr56uo.jpg')" }}
    >
      {/* Dark Vignette overlay for text readability on the left side */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#172539] via-[#172539]/80 md:via-[#172539]/60 to-transparent pointer-events-none z-0"></div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          
          {/* Left Side Content */}
          <div className="w-full lg:w-5/12">
            <div className="inline-flex px-3 py-1.5 rounded-full bg-[#0f7573]/20 border border-[#0f7573]/40 text-xs font-bold mb-4 items-center w-max gap-1.5 text-white">
              <CheckCircle2 className="w-4 h-4 text-[#fac800]" />
              100% Honest & Unbiased Counselling
            </div>
            
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight text-white tracking-tight">
              Take the First Step Toward Your Global Career
            </h2>
            
            <p className="text-base text-white/90 font-medium max-w-lg mb-8">
              Fill out the form to request a <strong>Free Profile Evaluation</strong>. Our expert counselors in Srinagar will review your details and contact you within 24 hours.
            </p>

            <div className="bg-[#1b2f45]/40 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 text-white space-y-4 shadow-xl max-w-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#00c758] mt-0.5 shrink-0" />
                <span className="text-sm font-semibold">2nd Floor, Baghat Chowk, Al Harim Complex, Near Old Cottage Inn, Baghat, Srinagar, J&K – 190005</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#00c758] shrink-0" />
                <span className="text-sm font-semibold">+91 60051 52350 / +91 96826 26537</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#00c758] shrink-0" />
                <span className="text-sm font-semibold">info@thecareeradvisors.in</span>
              </div>
            </div>
          </div>

          {/* Right Side Form */}
          <div className="w-full lg:w-7/12">
            <div className="bg-white rounded-[2rem] p-7 md:p-9 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-16 -mt-16 text-slate-50 opacity-60 pointer-events-none">
                <svg width="250" height="250" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2L1 7L12 12L21 7.9V17H23V7L12 2ZM12 14.1L3.9 10.4L1 11.7L12 16.7L23 11.7L20.1 10.4L12 14.1Z" />
                  <path d="M5 13.5V19.4L12 22.5L19 19.4V13.5L12 16.7L5 13.5Z" />
                </svg>
              </div>

              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2 text-[#2a3b4c]">Request Received!</h3>
                  <p className="text-[#62748e] font-medium text-sm max-w-sm">
                    Thank you. Our expert counsellor will contact you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="text-xs font-bold text-[#0f7573]">Full Name *</label>
                      <Input id="name" placeholder="John Doe" className="bg-white border-[#cad5e2] focus:border-[#0f7573] h-11 rounded-xl text-[#2a3b4c] font-medium placeholder:text-[#90a1b9] placeholder:font-normal shadow-sm" {...form.register("name")} />
                      {form.formState.errors.name && <p className="text-[10px] text-red-500 font-semibold leading-tight">{form.formState.errors.name.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="phone" className="text-xs font-bold text-[#0f7573]">Phone Number *</label>
                      <Input id="phone" type="tel" placeholder="+91 XXXXX XXXXX" className="bg-white border-[#cad5e2] focus:border-[#0f7573] h-11 rounded-xl text-[#2a3b4c] font-medium placeholder:text-[#90a1b9] placeholder:font-normal shadow-sm" {...form.register("phone")} />
                      {form.formState.errors.phone && <p className="text-[10px] text-red-500 font-semibold leading-tight">{form.formState.errors.phone.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="email" className="text-xs font-bold text-[#0f7573]">Email Address *</label>
                      <Input id="email" type="email" placeholder="john@example.com" className="bg-white border-[#cad5e2] focus:border-[#0f7573] h-11 rounded-xl text-[#2a3b4c] font-medium placeholder:text-[#90a1b9] placeholder:font-normal shadow-sm" {...form.register("email")} />
                      {form.formState.errors.email && <p className="text-[10px] text-red-500 font-semibold leading-tight">{form.formState.errors.email.message}</p>}
                    </div>
                    
                    <div className="space-y-1.5 relative">
                      <div className="flex justify-between items-center">
                        <label htmlFor="preferredCountry" className="text-xs font-bold text-[#0f7573]">Preferred Country *</label>
                        <span className="text-[9px] text-[#90a1b9]">0 / 120 chars (Max 10 words)</span>
                      </div>
                      <Input id="preferredCountry" placeholder="e.g. UK, Canada..." className="bg-white border-[#cad5e2] focus:border-[#0f7573] h-11 rounded-xl text-[#2a3b4c] font-medium placeholder:text-[#90a1b9] placeholder:font-normal shadow-sm" {...form.register("preferredCountry")} />
                      {form.formState.errors.preferredCountry && <p className="text-[10px] text-red-500 font-semibold leading-tight">{form.formState.errors.preferredCountry.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0f7573]">NEET Score</label>
                      <Controller
                        control={form.control}
                        name="neetScore"
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger className="bg-white border-[#cad5e2] focus:border-[#0f7573] h-11 rounded-xl text-[#2a3b4c] font-medium shadow-sm data-[placeholder]:text-[#90a1b9] data-[placeholder]:font-normal">
                              <SelectValue placeholder="Select Range (Optional)" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-[#cad5e2]">
                              {neetRanges.map((range) => (
                                <SelectItem key={range} value={range} className="font-medium text-sm text-[#2a3b4c]">{range}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {form.formState.errors.neetScore && <p className="text-[10px] text-red-500 font-semibold leading-tight">{form.formState.errors.neetScore.message}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-xs font-bold text-[#0f7573]">Additional Message (Optional)</label>
                      <Input id="message" placeholder="Tell us about your background or queries..." className="bg-white border-[#cad5e2] focus:border-[#0f7573] h-11 rounded-xl text-[#2a3b4c] font-medium placeholder:text-[#90a1b9] placeholder:font-normal shadow-sm" {...form.register("message")} />
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-[#0f7573]">Are you under 18 years of age? *</label>
                      <Controller
                        control={form.control}
                        name="isUnder18"
                        render={({ field }) => (
                          <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#2a3b4c]">
                              <input type="radio" value="Yes" checked={field.value === "Yes"} onChange={(e) => field.onChange(e.target.value)} className="w-4 h-4 text-[#00c758] focus:ring-[#00c758] border-[#cad5e2]" />
                              Yes
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#2a3b4c]">
                              <input type="radio" value="No" checked={field.value === "No"} onChange={(e) => field.onChange(e.target.value)} className="w-4 h-4 text-[#00c758] focus:ring-[#00c758] border-[#cad5e2]" />
                              No
                            </label>
                          </div>
                        )}
                      />
                      {form.formState.errors.isUnder18 && <p className="text-[10px] text-red-500 font-semibold leading-tight">{form.formState.errors.isUnder18.message}</p>}
                    </div>

                    <div className="space-y-2">
                      <Controller
                        control={form.control}
                        name="agreeToTerms"
                        render={({ field }) => (
                          <label className="flex items-start gap-2.5 cursor-pointer group">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5 w-4 h-4 border-[#cad5e2] data-[state=checked]:bg-[#00c758] data-[state=checked]:border-[#00c758] rounded-[4px]"
                            />
                            <span className="text-[11px] text-[#2a3b4c] leading-tight font-medium">
                              I agree to the <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="text-[#0f7573] underline underline-offset-2 hover:text-[#00c758]">Privacy Policy</a> and <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="text-[#0f7573] underline underline-offset-2 hover:text-[#00c758]">Terms & Conditions</a>. *
                            </span>
                          </label>
                        )}
                      />
                      {form.formState.errors.agreeToTerms && <p className="text-[10px] text-red-500 font-semibold leading-tight">{form.formState.errors.agreeToTerms.message}</p>}

                      <Controller
                        control={form.control}
                        name="consentMarketing"
                        render={({ field }) => (
                          <label className="flex items-start gap-2.5 cursor-pointer group">
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="mt-0.5 w-4 h-4 border-[#cad5e2] data-[state=checked]:bg-[#00c758] data-[state=checked]:border-[#00c758] rounded-[4px]"
                            />
                            <span className="text-[11px] text-[#2a3b4c] leading-tight font-medium">
                              I consent to receive promotional updates, scholarships, and educational information via Email/WhatsApp. <span className="text-[#90a1b9]">(Optional)</span>
                            </span>
                          </label>
                        )}
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={isSubmitting} className="w-full bg-[#00c758] text-white hover:bg-[#00a544] py-6 text-[15px] font-bold rounded-xl shadow-[0_4px_14px_0_rgba(0,199,88,0.39)] active:scale-95 transition-all mt-6">
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <span className="flex items-center">Submit Inquiry <Send className="ml-2 w-4 h-4" /></span>}
                  </Button>
                </form>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
