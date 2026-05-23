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
  currentCountry: z.string().min(2, { message: "Current country required" }),
  address: z.string().min(5, { message: "Address is required" }),
  neetScore: z.string().nonempty({ message: "Please select your NEET score" }),
  countries: z.array(z.string()).refine((value) => value.length > 0, {
    message: "You have to select at least one preferred country.",
  }),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const neetRanges = ["Below 200", "200 - 300", "300 - 400", "400 - 500", "500 - 600", "600+", "Yet to appear"];
const countryOptions = ["Russia", "Kazakhstan", "Bangladesh", "Kyrgyzstan", "Georgia", "Uzbekistan", "Nepal", "Egypt"];

export default function InquiryModal({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      currentCountry: "",
      address: "",
      countries: [],
      message: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    
    try {
      // 1. Fetch Approximate Location via IP
      let ipLocation = "Unknown Location";
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (data.city && data.country_name) {
          ipLocation = `${data.city}, ${data.country_name} (IP: ${data.ip})`;
        }
      } catch (e) {
        console.log("Could not fetch IP location");
      }

      // 2. Save to Firestore
      await addDoc(collection(db, "inquiries"), {
        ...values,
        ipLocation, // Captured Location
        status: "New",
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
        
        <DialogContent className="sm:max-w-[550px] w-[95vw] max-h-[90vh] overflow-y-auto rounded-3xl p-6 md:p-8 bg-card">
          
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-bold font-heading mb-3 text-foreground">Request Received!</h3>
              <p className="text-foreground/70 font-medium text-lg">
                Thank you. Our expert counsellor will contact you within 24 hours.
              </p>
            </div>
          ) : (
            <>
              <DialogHeader className="flex flex-col items-center text-center sm:text-center mb-2">
                <Image 
                  src="/logo.png" 
                  alt="The Career Advisors" 
                  width={160} 
                  height={60} 
                  className="h-12 w-auto object-contain mb-3"
                  priority
                />
                <DialogTitle className="text-2xl font-bold font-heading text-foreground">
                  Free Global Counselling
                </DialogTitle>
                <DialogDescription className="text-sm font-medium">
                  Response within 24 hours. Your info is 100% secure.
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
                
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-foreground/60">Student Name*</label>
                  <Input id="name" placeholder="e.g. Ayaan Bhat" className="bg-muted/50 py-5 rounded-xl border-border/50 focus:border-primary" {...form.register("name")} />
                  {form.formState.errors.name && <p className="text-xs text-destructive font-semibold">{form.formState.errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-foreground/60">Email Address*</label>
                    <Input id="email" type="email" placeholder="student@example.com" className="bg-muted/50 py-5 rounded-xl border-border/50 focus:border-primary" {...form.register("email")} />
                    {form.formState.errors.email && <p className="text-xs text-destructive font-semibold">{form.formState.errors.email.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-foreground/60">WhatsApp Number*</label>
                    <Input id="phone" type="tel" placeholder="+91 00000 00000" className="bg-muted/50 py-5 rounded-xl border-border/50 focus:border-primary" {...form.register("phone")} />
                    {form.formState.errors.phone && <p className="text-xs text-destructive font-semibold">{form.formState.errors.phone.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="currentCountry" className="text-xs font-bold uppercase tracking-wider text-foreground/60">Current Country*</label>
                    <Input id="currentCountry" placeholder="e.g. India" className="bg-muted/50 py-5 rounded-xl border-border/50 focus:border-primary" {...form.register("currentCountry")} />
                    {form.formState.errors.currentCountry && <p className="text-xs text-destructive font-semibold">{form.formState.errors.currentCountry.message}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-foreground/60">City / Full Address*</label>
                    <Input id="address" placeholder="e.g. Srinagar, J&K" className="bg-muted/50 py-5 rounded-xl border-border/50 focus:border-primary" {...form.register("address")} />
                    {form.formState.errors.address && <p className="text-xs text-destructive font-semibold">{form.formState.errors.address.message}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="neetScore" className="text-xs font-bold uppercase tracking-wider text-foreground/60">NEET Score*</label>
                  <Controller
                    control={form.control}
                    name="neetScore"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="bg-muted/50 py-5 rounded-xl border-border/50 focus:border-primary">
                          <SelectValue placeholder="Select score range" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {neetRanges.map((range) => (
                            <SelectItem key={range} value={range} className="font-medium">{range}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {form.formState.errors.neetScore && <p className="text-xs text-destructive font-semibold">{form.formState.errors.neetScore.message}</p>}
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-foreground/60">Preferred Destination*</div>
                  <Controller
                    control={form.control}
                    name="countries"
                    render={({ field }) => {
                      const currentValues = Array.isArray(field.value) ? field.value : [];
                      return (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {countryOptions.map((country) => (
                            <label key={country} className="flex items-center gap-2 rounded-xl border border-border/50 bg-muted/30 p-2.5 hover:bg-muted/50 cursor-pointer transition-colors">
                              <Checkbox
                                checked={currentValues.includes(country)}
                                onCheckedChange={(checked) => {
                                  const nextValues = checked
                                    ? [...currentValues, country]
                                    : currentValues.filter((value) => value !== country);
                                  field.onChange(nextValues);
                                }}
                                className="border-primary/50 data-[state=checked]:bg-[#D85C34] data-[state=checked]:border-[#D85C34] data-[state=checked]:text-white"
                              />
                              <span className="text-xs font-bold">{country}</span>
                            </label>
                          ))}
                        </div>
                      );
                    }}
                  />
                  {form.formState.errors.countries && <p className="text-xs text-destructive font-semibold">{form.formState.errors.countries.message}</p>}
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-foreground/60">Message (Optional)</label>
                  <Textarea id="message" placeholder="Any specific questions about universities or visa?" className="resize-none bg-muted/50 rounded-xl border-border/50 focus:border-primary min-h-[80px]" {...form.register("message")} />
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full bg-[#D85C34] text-white hover:bg-[#b84c2a] py-6 text-lg font-bold rounded-xl shadow-lg shadow-[#D85C34]/30 active:scale-95 transition-all mt-4">
                  {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <span className="flex items-center">Submit Application <ArrowRight className="ml-2 w-5 h-5" /></span>}
                </Button>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}