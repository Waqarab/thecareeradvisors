import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | The Career Advisors",
  description: "Terms and Conditions for using The Career Advisors website and services.",
};

export default function TermsConditions() {
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
            Terms & <span className="text-orange-500">Conditions</span>
          </h1>
          <p className="text-foreground/60 font-medium">Last Updated: {new Date().toLocaleDateString()}</p>
        </div>

        {/* Content */}
        <div className="space-y-10 text-foreground/80 leading-relaxed font-medium">
          
          <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl text-foreground/90 italic">
            Welcome to The Career Advisors. By accessing and using our website, services, counseling sessions, or admission support services, you agree to comply with the following Terms & Conditions. Please read them carefully before using our services.
          </div>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">1. General Information</h2>
            <p className="mb-4">
              The Career Advisors is an international education consultancy providing counseling, admission guidance, scholarship assistance, visa support, and related services for students seeking educational opportunities abroad.
            </p>
            <p>
              All information provided on this website is for general informational purposes only and may be updated, modified, or changed without prior notice.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">2. Admission & University Information</h2>
            <p className="mb-4">The Career Advisors acts as a consultancy and guidance platform for students. Final admission decisions are made solely by the respective universities, government authorities, embassies, or institutions. We do not guarantee:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>Admission confirmation</li>
              <li>Visa approval</li>
              <li>Scholarship approval</li>
              <li>Specific university allotment</li>
              <li>Future licensing or job placement</li>
            </ul>
            <p className="mb-2">Admission criteria may vary depending on:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>University regulations</li>
              <li>Government policies</li>
              <li>Academic eligibility</li>
              <li>Documentation verification</li>
              <li>Country-specific laws</li>
            </ul>
            <p className="font-semibold text-orange-500">Students are advised to verify all information before final application submission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">3. Fee Structures & Scholarship Information</h2>
            <p className="mb-4">Tuition fees, scholarship offers, hostel charges, and other educational expenses mentioned on the website are approximate and subject to change by universities or government authorities without prior notice.</p>
            <p className="mb-2">Scholarships and tuition discounts are:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>Subject to eligibility</li>
              <li>Based on academic performance</li>
              <li>Dependent on seat availability</li>
              <li>Governed by university policies</li>
            </ul>
            <p>The Career Advisors does not guarantee scholarship approval or fee concessions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">4. Visa & Immigration Disclaimer</h2>
            <p className="mb-4">Visa issuance is completely under the authority of respective embassies and immigration departments. The Career Advisors assists students with:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>Documentation guidance</li>
              <li>Application procedures</li>
              <li>Interview preparation</li>
              <li>Visa filing support</li>
            </ul>
            <p>However, visa approval or rejection remains solely at the discretion of the concerned embassy or immigration authority.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">5. Student Responsibility</h2>
            <p className="mb-2">Students are strictly responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>Providing accurate documents</li>
              <li>Submitting genuine information</li>
              <li>Following university guidelines</li>
              <li>Meeting eligibility requirements</li>
              <li>Complying with immigration and visa regulations</li>
            </ul>
            <p className="mb-2">Any false documentation or misrepresentation may result in:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500">
              <li>Admission cancellation</li>
              <li>Visa rejection</li>
              <li>Scholarship cancellation</li>
              <li>Legal action by authorities</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">6. Website Content & Intellectual Property</h2>
            <p className="mb-4">All content available on this website including Text, Graphics, Logos, Images, Videos, Documents, and University information is the intellectual property of The Career Advisors unless otherwise stated.</p>
            <p>Unauthorized copying, reproduction, or redistribution of website content, code, or design elements is strictly prohibited without written permission.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">7. Third-Party Universities & Institutions</h2>
            <p className="mb-4">The Career Advisors collaborates with universities and institutions internationally. However, we are not directly responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>University management decisions</li>
              <li>Academic curriculum changes</li>
              <li>Hostel arrangements by universities</li>
              <li>Policy updates by institutions</li>
              <li>Internal university matters</li>
            </ul>
            <p>Students must follow the rules and regulations of their respective institutions.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">8. Financial Transactions</h2>
            <p className="mb-4">Any payments made towards Application fees, Registration fees, University processing, or Consultancy services must be verified through official company communication channels only.</p>
            <p className="font-semibold text-red-500">Students are strictly advised not to make payments to unauthorized individuals, third-party agents, or unofficial accounts.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">9. Limitation of Liability (General & Digital Disclaimer)</h2>
            <p className="mb-4">By accessing our website and services, you explicitly agree that <strong>The Career Advisors</strong>, its management, and its <strong>Website Development Agency (H Studio)</strong> shall not be held liable, financially or legally, for any direct, indirect, incidental, or consequential losses arising from:</p>
            
            <h3 className="text-lg font-bold text-foreground mt-4 mb-2">Service & Admissions Limitations</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>University policy changes, admission revocations, or curriculum updates</li>
              <li>Visa delays, rejections, or government regulation changes</li>
              <li>Travel restrictions or flight delays</li>
              <li>Currency fluctuations affecting tuition fees</li>
              <li>Scholarship withdrawal or rejection by universities</li>
            </ul>

            <h3 className="text-lg font-bold text-foreground mt-4 mb-2">Digital & Infrastructure Limitations</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li><strong>Server & Hosting Failures:</strong> Unavailability of the website due to hosting downtime (e.g., Vercel), database crashes (e.g., Firebase), or domain registry issues.</li>
              <li><strong>Cyber Security:</strong> Data loss, breaches, or corruption caused by malicious third-party activities such as hacking, DDoS attacks, or malware.</li>
              <li><strong>"As-Is" Software:</strong> The website platform, forms, and chatbots are provided "as is" and "as available". The developer makes no guarantees regarding uninterrupted access or bug-free performance.</li>
              <li><strong>Third-Party Integrations:</strong> Errors caused by external services including WhatsApp APIs, Google Recaptcha, or Cloudinary content delivery networks.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">10. Privacy Policy</h2>
            <p className="mb-4">Student information shared with The Career Advisors is handled with confidentiality and used exclusively for Admission processing, University applications, Visa procedures, and Student support services.</p>
            <p>We do not sell or intentionally disclose personal information to unauthorized third parties. For full details, please review our <Link href="/legal/privacy-policy" className="text-orange-500 hover:underline">Privacy Policy</Link>.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">11. Modification of Terms</h2>
            <p>The Career Advisors reserves the right to update or modify these Terms & Conditions at any time without prior notice. Continued use of the website or services after updates constitutes acceptance of the revised terms.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">12. Governing Jurisdiction</h2>
            <p>Any disputes related to services, website usage, financial transactions, or consultancy operations shall be exclusively subject to the jurisdiction of the courts in <strong>Srinagar, Jammu & Kashmir, India</strong>.</p>
          </section>

          <section className="bg-muted p-8 rounded-3xl border border-border/50 mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">13. Contact Information</h2>
            <p className="mb-6">
              For any queries regarding these Terms & Conditions, students may contact us at:
            </p>
            <address className="not-italic grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-orange-500 mb-2">Head Office</h3>
                <p className="text-foreground/80">
                  <strong>The Career Advisors</strong><br />
                  Srinagar, Jammu & Kashmir<br />
                  India
                </p>
              </div>
              <div>
                <h3 className="font-bold text-orange-500 mb-2">Additional Offices</h3>
                <ul className="text-foreground/80 space-y-1">
                  <li>• Chandigarh, India</li>
                  <li>• Dhaka, Bangladesh</li>
                  <li>• Tashkent, Uzbekistan</li>
                  <li>• Cairo, Egypt</li>
                </ul>
              </div>
            </address>
          </section>

        </div>
      </div>
    </div>
  );
}