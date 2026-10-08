"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

// FIREBASE IMPORTS
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  phone: z.string().min(10, { message: "Valid phone number required" }),
  neetScore: z.string().nonempty({ message: "Please select your NEET score" }),
  countries: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one preferred country.",
  }),
  message: z.string().optional(),
  isUnder18: z.enum(["Yes", "No"], { errorMap: () => ({ message: "Please select an option" }) } as any),
  agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the Terms & Privacy Policy" }),
  consentMarketing: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const neetRanges = ["Below 200", "200 - 300", "300 - 400", "400 - 500", "500 - 600", "600+", "Yet to appear"];
const countryOptions = ["Russia", "Kazakhstan", "Bangladesh", "Kyrgyzstan", "Georgia", "Uzbekistan", "Nepal", "Egypt"];

export default function InquiryModal({ children, source = "General Inquiry" }: { children: React.ReactNode, source?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      countries: [],
      message: "",
      isUnder18: undefined as any,
      agreeToTerms: false,
      consentMarketing: false,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    try {
      // Pull the real traffic source saved by the TrafficTracker component
      let userSource = "Direct / Other";
      if (typeof window !== "undefined") {
        userSource = localStorage.getItem("tca_user_source") || "Direct / Other";
      }

      await addDoc(collection(db, "inquiries"), {
        ...values,
        status: "New",
        source: userSource, // REAL TRACKING: "Meta Ads", "Instagram", etc.
        formLocation: source, // Tells you which button/page they used to open the form
        createdAt: serverTimestamp(),
      });

      setIsSuccess(true);
      form.reset();
      
      setTimeout(() => {
        setIsOpen(false);
        setIsSuccess(false);
      }, 3000);

    } catch (error) {
      console.error("Error saving inquiry: ", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setIsSuccess(false);
      }}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 bg-white border-none shadow-premium sm:rounded-[32px]">
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-[#6082B6]/10 rounded-full flex items-center justify-center text-[#6082B6] mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold font-heading mb-3 text-[#1A2E44]">Request Received!</h3>
              <p className="text-[#3A5F8B] font-medium text-lg">
                Thank you. Our expert counsellor will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader className="flex flex-col items-center text-center sm:text-center mb-4">
                <Image 
                  src="/logo.png" 
                  alt="The Career Advisors" 
                  width={160} 
                  height={60} 
                  className="h-12 w-auto object-contain mb-3"
                  priority
                />
                <DialogTitle className="text-2xl md:text-3xl font-bold font-heading text-[#1A2E44]">
                  Free Global Counselling
                </DialogTitle>
                <DialogDescription className="text-sm font-medium text-[#3A5F8B]">
                  Response within 24 hours. Your info is 100% secure.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-[#3A5F8B]">Student Name*</label>
                  <Input id="name" placeholder="e.g. Ayaan Bhat" className="bg-[#F4F7F8] py-5 px-4 rounded-xl border-[#AEC6CF]/40 focus:border-[#6082B6] font-medium text-[#1A2E44] shadow-inner shadow-[#AEC6CF]/10 placeholder:text-[#3A5F8B]/40 focus-visible:ring-1 focus-visible:ring-[#6082B6]/50" {...form.register("name")} />
                  {form.formState.errors.name && <p className="text-xs text-destructive font-semibold">{form.formState.errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-[#3A5F8B]">Email Address*</label>
                    <Input id="email" type="email" placeholder="student@example.com" className="bg-[#F4F7F8] py-5 px-4 rounded-xl border-[#AEC6CF]/40 focus:border-[#6082B6] font-medium text-[#1A2E44] shadow-inner shadow-[#AEC6CF]/10 placeholder:text-[#3A5F8B]/40 focus-visible:ring-1 focus-visible:ring-[#6082B6]/50" {...form.register("email")} />
                    {form.formState.errors.email && <p className="text-xs text-destructive font-semibold">{form.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-[11px] font-bold uppercase tracking-wider text-[#3A5F8B]">WhatsApp Number*</label>
                    <Input id="phone" type="tel" placeholder="+91 00000 00000" className="bg-[#F4F7F8] py-5 px-4 rounded-xl border-[#AEC6CF]/40 focus:border-[#6082B6] font-medium text-[#1A2E44] shadow-inner shadow-[#AEC6CF]/10 placeholder:text-[#3A5F8B]/40 focus-visible:ring-1 focus-visible:ring-[#6082B6]/50" {...form.register("phone")} />
                    {form.formState.errors.phone && <p className="text-xs text-destructive font-semibold">{form.formState.errors.phone.message}</p>}
                  </div>
                </div>


                <div className="space-y-1.5">
                  <label htmlFor="neetScore" className="text-[11px] font-bold uppercase tracking-wider text-[#3A5F8B]">NEET Score*</label>
                  <Controller
                    control={form.control}
                    name="neetScore"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-[#F4F7F8] py-5 px-4 rounded-xl border-[#AEC6CF]/40 focus:border-[#6082B6] font-medium text-[#1A2E44] shadow-inner shadow-[#AEC6CF]/10 placeholder:text-[#3A5F8B]/40 focus-visible:ring-1 focus-visible:ring-[#6082B6]/50">
                          <SelectValue placeholder="Select score range" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#AEC6CF]/40 bg-white">
                          {neetRanges.map((range) => (
                            <SelectItem key={range} value={range} className="font-medium text-[#1A2E44]">{range}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.neetScore && <p className="text-xs text-destructive font-semibold">{form.formState.errors.neetScore.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[#3A5F8B]">Preferred Destination*</div>
                  <Controller
                    control={form.control}
                    name="countries"
                    render={({ field }) => {
                      const currentValues = Array.isArray(field.value) ? field.value : [];
                      return (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {countryOptions.map((country) => (
                            <label key={country} className="flex items-center gap-2 rounded-xl border border-[#AEC6CF]/40 bg-[#F4F7F8] p-2.5 hover:bg-[#6082B6]/10 hover:border-[#6082B6]/40 cursor-pointer transition-colors shadow-sm">
                              <Checkbox
                                checked={currentValues.includes(country)}
                                onCheckedChange={(checked) => {
                                  const nextValues = checked
                                    ? [...currentValues, country]
                                    : currentValues.filter((value) => value !== country);
                                  field.onChange(nextValues);
                                }}
                                className="border-[#6082B6]/40 data-[state=checked]:bg-[#6082B6] data-[state=checked]:border-[#6082B6] data-[state=checked]:text-white rounded-sm"
                              />
                              <span className="text-[13px] font-bold text-[#1A2E44]">{country}</span>
                            </label>
                          ))}
                        </div>
                      );
                    }}
                  />
                  {form.formState.errors.countries && <p className="text-xs text-destructive font-semibold">{form.formState.errors.countries.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-wider text-[#3A5F8B]">Message (Optional)</label>
                  <Textarea id="message" placeholder="Any specific questions about universities or visa?" className="resize-none bg-[#F4F7F8] p-4 rounded-xl border-[#AEC6CF]/40 focus:border-[#6082B6] font-medium text-[#1A2E44] shadow-inner shadow-[#AEC6CF]/10 placeholder:text-[#3A5F8B]/40 focus-visible:ring-1 focus-visible:ring-[#6082B6]/50 min-h-[80px]" {...form.register("message")} />
                </div>

                <div className="space-y-4 pt-2 pb-2">
                  <div className="space-y-2">
                    <label className="text-[13px] font-bold text-[#1A2E44]">Are you under 18 years of age? *</label>
                    <Controller
                      control={form.control}
                      name="isUnder18"
                      render={({ field }) => (
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#3A5F8B] hover:text-[#1A2E44] transition-colors">
                            <input type="radio" value="Yes" checked={field.value === "Yes"} onChange={(e) => field.onChange(e.target.value)} className="w-4 h-4 text-[#D85C34] focus:ring-[#D85C34] border-[#AEC6CF]" />
                            Yes
                          </label>
                          <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-[#3A5F8B] hover:text-[#1A2E44] transition-colors">
                            <input type="radio" value="No" checked={field.value === "No"} onChange={(e) => field.onChange(e.target.value)} className="w-4 h-4 text-[#D85C34] focus:ring-[#D85C34] border-[#AEC6CF]" />
                            No
                          </label>
                        </div>
                      )}
                    />
                    {form.formState.errors.isUnder18 && <p className="text-xs text-destructive font-semibold">{form.formState.errors.isUnder18.message}</p>}
                  </div>

                  <div className="space-y-3">
                    <Controller
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <label className="flex items-start gap-2.5 cursor-pointer group">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5 border-[#AEC6CF] data-[state=checked]:bg-[#D85C34] data-[state=checked]:border-[#D85C34] rounded-sm transition-colors"
                          />
                          <span className="text-xs text-[#3A5F8B] leading-snug">
                            I agree to the <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="font-semibold text-[#1A2E44] underline underline-offset-2 hover:text-[#D85C34] transition-colors">Privacy Policy</a> and <a href="#" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="font-semibold text-[#1A2E44] underline underline-offset-2 hover:text-[#D85C34] transition-colors">Terms & Conditions</a>. *
                          </span>
                        </label>
                      )}
                    />
                    {form.formState.errors.agreeToTerms && <p className="text-xs text-destructive font-semibold">{form.formState.errors.agreeToTerms.message}</p>}

                    <Controller
                      control={form.control}
                      name="consentMarketing"
                      render={({ field }) => (
                        <label className="flex items-start gap-2.5 cursor-pointer group">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-0.5 border-[#AEC6CF] data-[state=checked]:bg-[#6082B6] data-[state=checked]:border-[#6082B6] rounded-sm transition-colors"
                          />
                          <span className="text-[11px] text-[#3A5F8B] leading-snug">
                            I consent to receive promotional updates, scholarships, and educational information via Email/WhatsApp. (Optional)
                          </span>
                        </label>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-[#12A150] hover:bg-[#0e8541] text-white font-bold py-6 rounded-xl shadow-[0_4px_14px_0_rgba(18,161,80,0.39)] hover:shadow-[0_6px_20px_rgba(18,161,80,0.23)] hover:-translate-y-0.5 transition-all duration-200 uppercase tracking-wide flex items-center justify-center gap-2 group mt-4"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <>Submit Inquiry <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                  )}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}