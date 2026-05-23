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
        <div className="space-y-10 text-foreground/80 leading-relaxed font-medium">
          
          <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-2xl text-foreground/90 italic">
            At The Career Advisors, we value the trust of our students, parents, and website visitors. This Privacy Policy explains how we collect, use, protect, and manage personal information shared with us through our website, counseling services, admission procedures, and communication channels.
            <br/><br/>
            By using our website or services, you agree to the terms outlined in this Privacy Policy.
          </div>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">1. Information We Collect</h2>
            <p className="mb-4">The Career Advisors may collect the following information from students or website visitors:</p>
            
            <h3 className="text-lg font-bold text-foreground mt-4 mb-2">Personal Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>Full Name</li>
              <li>Phone Number</li>
              <li>Email Address</li>
              <li>Residential Address</li>
              <li>Date of Birth</li>
              <li>Passport Details</li>
              <li>Academic Information</li>
              <li>NEET Details (if applicable)</li>
              <li>Parent/Guardian Information</li>
            </ul>

            <h3 className="text-lg font-bold text-foreground mt-4 mb-2">Educational Information</h3>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>Academic records</li>
              <li>Certificates & mark sheets</li>
              <li>Entrance examination details</li>
              <li>University preferences</li>
              <li>Scholarship-related information</li>
            </ul>

            <h3 className="text-lg font-bold text-foreground mt-4 mb-2">Technical & Digital Information</h3>
            <p className="mb-2">When visiting our website, certain technical information may automatically be collected, including:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information and operating system</li>
              <li>Website usage data and interaction analytics</li>
              <li>Cookies and local storage data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">2. Purpose of Information Collection</h2>
            <p className="mb-2">We collect student information for purposes including:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>Admission counseling</li>
              <li>University applications</li>
              <li>Scholarship processing</li>
              <li>Visa guidance</li>
              <li>Documentation support</li>
              <li>Student communication</li>
              <li>Website improvement and security monitoring</li>
              <li>Customer support services</li>
            </ul>
            <p className="mb-2">Information may also be used to provide updates regarding:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500">
              <li>Admission deadlines</li>
              <li>Scholarship opportunities</li>
              <li>University announcements</li>
              <li>Educational programs</li>
              <li>Events and seminars</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">3. Confidentiality & Data Protection</h2>
            <p className="mb-4">The Career Advisors is committed to protecting student privacy and maintaining the confidentiality of personal information. We implement reasonable administrative and technical security measures to protect information against:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>Unauthorized access</li>
              <li>Data misuse</li>
              <li>Disclosure</li>
              <li>Alteration</li>
              <li>Loss of information</li>
            </ul>
            <p>Student data is shared only when strictly necessary for University applications, Visa processing, Scholarship procedures, or Government/embassy requirements.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">4. Sharing of Information</h2>
            <p className="mb-4">The Career Advisors does not sell, rent, or trade student information to unauthorized third parties. Information may be shared strictly for admission and educational processing purposes with:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500">
              <li>Partner universities</li>
              <li>Embassies & visa authorities</li>
              <li>Government departments</li>
              <li>Authorized admission partners</li>
              <li>Official processing agencies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">5. Cookies & Website Analytics</h2>
            <p className="mb-4">Our website may use cookies, web beacons, and third-party analytics tools to improve user experience, monitor website performance, and understand visitor behavior.</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>Improve website performance and loading speeds</li>
              <li>Remember user preferences and form inputs</li>
              <li>Analyze traffic, engagement, and security threats</li>
              <li>Enhance website functionality</li>
            </ul>
            <p>Users may disable cookies through their browser settings, though this may affect certain functionalities of the website.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">6. Third-Party Links & Integrations</h2>
            <p>Our website may contain links to external university websites, social media platforms, or third-party service providers. The Career Advisors is not responsible for the privacy practices, data collection policies, or content of external websites. Users are encouraged to review the privacy policies of third-party websites separately before providing them with personal information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">7. Student Responsibility</h2>
            <p className="mb-2">Students and applicants are strictly responsible for:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>Providing accurate, lawful, and truthful information</li>
              <li>Submitting genuine, un-forged documents</li>
              <li>Updating information immediately if changes occur</li>
            </ul>
            <p>False or misleading information may severely affect admission, scholarship, or visa procedures. The Career Advisors holds no liability for rejections resulting from fraudulent document submission by the user.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">8. Communication Consent</h2>
            <p className="mb-2">By submitting inquiries, forms, or engaging with our live chat through our website, students explicitly consent to receive communication from The Career Advisors through:</p>
            <ul className="list-disc pl-6 space-y-1 text-foreground/70 marker:text-orange-500 mb-4">
              <li>Phone calls</li>
              <li>WhatsApp messages</li>
              <li>Emails</li>
              <li>SMS notifications</li>
              <li>Social media communication</li>
            </ul>
            <p>This communication may include admission updates, scholarship opportunities, counseling support, educational promotions, and event information.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">9. Data Retention</h2>
            <p>Student information may be retained for admission processing, legal compliance, student support purposes, and internal record maintenance. The Career Advisors reserves the right to maintain records indefinitely as required by applicable laws, regulatory authorities, and internal operational requirements.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">10. Limitation of Liability (Digital & Technical)</h2>
            <p className="mb-4">While we take reasonable and industry-standard precautions to protect data, no online platform, server, or database can guarantee 100% complete security.</p>
            <p className="mb-2">By using this website, you agree that <strong>The Career Advisors</strong>, its management, and the <strong>Website Developer/Development Agency</strong> shall not be held liable, legally or financially, for:</p>
            <ul className="list-disc pl-6 space-y-2 text-foreground/70 marker:text-orange-500 mb-4">
              <li><strong>Cyber Attacks:</strong> Internet-related security breaches, unauthorized third-party hacking, database leaks, or malicious software (malware/ransomware) attacks.</li>
              <li><strong>Server & Technical Failures:</strong> Downtime, data loss, transmission errors, or technical failures caused by hosting providers, third-party APIs, or circumstances beyond reasonable control.</li>
              <li><strong>Phishing & Impersonation:</strong> Scams, financial losses, or identity theft resulting from third parties impersonating The Career Advisors via spoofed emails, fake domains, or fraudulent phone calls. Always verify official communication channels.</li>
              <li><strong>"As-Is" Provision:</strong> The website and its digital services are provided on an "as is" and "as available" basis without warranties of any kind, either express or implied.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4 border-l-4 border-orange-500 pl-3">11. Changes to Privacy Policy</h2>
            <p>The Career Advisors reserves the right to update, amend, or modify this Privacy Policy at any time without prior individual notice. Updated policies will become effective immediately upon publication on the website. Continued use of the website following such changes constitutes your acceptance of the revised policy.</p>
          </section>

          <section className="bg-muted p-8 rounded-3xl border border-border/50">
            <h2 className="text-2xl font-bold text-foreground mb-4">12. Contact Information</h2>
            <p className="mb-6">
              For any privacy-related concerns, data removal requests, or queries, students may contact us at:
            </p>
            <address className="not-italic grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-orange-500 mb-2">Head Office</h3>
                <p className="text-foreground/80">
                  <strong>The Career Advisors</strong><br />
                  2nd Floor, Baghat Chowk, Al Harim Complex<br />
                  Near Old Cottage Inn, Baghat<br />
                  Srinagar, Jammu & Kashmir – 190005<br />
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