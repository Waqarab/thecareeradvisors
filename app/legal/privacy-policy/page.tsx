import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | The Career Advisors",
  description: "Privacy Policy and Data Protection guidelines for The Career Advisors.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16 font-sans">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-primary hover:text-orange-500 font-medium mb-8 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-12 border-b border-border/50 pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight font-heading">
            Privacy <span className="text-orange-500">Policy</span>
          </h1>
          <p className="text-foreground/60 font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="space-y-8 text-foreground/80 leading-relaxed font-medium">
          
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">1. Introduction</h2>
            <p>
              Welcome to The Career Advisors. We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at info@thecareeradvisors.in.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">2. Information We Collect</h2>
            <p className="mb-3">We collect personal information that you voluntarily provide to us when you express an interest in obtaining information about us or our services. The personal information that we collect depends on the context of your interactions with us and the website, the choices you make, and the products and features you use. The personal information we collect may include the following:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/70 marker:text-orange-500">
              <li>Names, Phone Numbers, and Email Addresses</li>
              <li>Educational background and academic records</li>
              <li>Passport and visa-related documents (only when explicitly provided for admission purposes)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">3. How We Use Your Information</h2>
            <p>
              We use personal information collected via our website for a variety of business purposes described below. We process your personal information for these purposes in reliance on our legitimate business interests, in order to enter into or perform a contract with you, with your consent, and/or for compliance with our legal obligations. We use the information we collect or receive:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3 text-foreground/70 marker:text-orange-500">
              <li>To facilitate university admissions and visa processing.</li>
              <li>To send administrative information to you.</li>
              <li>To fulfill and manage your requests for counseling and guidance.</li>
              <li>To respond to your inquiries and offer support.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">4. Will Your Information Be Shared With Anyone?</h2>
            <p>
              We only share information with your consent, to comply with laws, to provide you with services, to protect your rights, or to fulfill business obligations. We may need to process your data or share your personal information in the following situations:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-3 text-foreground/70 marker:text-orange-500">
              <li><strong>Vendors, Consultants, and Other Third-Party Service Providers:</strong> We may share your data with third-party vendors (such as international universities) specifically to facilitate your admission process.</li>
              <li><strong>Legal Obligations:</strong> We may disclose your information where we are legally required to do so in order to comply with applicable law, governmental requests, a judicial proceeding, court order, or legal process.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">5. Contact Us</h2>
            <p>
              If you have questions or comments about this notice, you may email us at info@thecareeradvisors.in or by post to:
            </p>
            <address className="mt-4 not-italic pl-4 border-l-4 border-orange-500 bg-muted/30 p-4 rounded-r-lg text-foreground/70">
              <strong>The Career Advisors</strong><br />
              2nd Floor, Baghat Chowk, Al Harim Complex<br />
              Near Old Cottage Inn, Baghat<br />
              Srinagar, J&K – 190005<br />
              India
            </address>
          </section>

        </div>
      </div>
    </div>
  );
}