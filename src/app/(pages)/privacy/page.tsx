import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy — Checkin OK',
  description: 'Privacy policy for Checkin OK, the Belgian NSSO attendance compliance platform.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Privacy Policy</h1>
          <p className="text-sm text-[#6b7280] mb-8">Last updated: March 2026</p>

          <div className="prose prose-sm max-w-none text-[#374151] leading-relaxed space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">1. Privacy at a Glance</h2>
              <p>The following information provides a simple overview of what happens to your personal data when you visit our website and use our services. Personal data is any data with which you could be personally identified. This policy is governed by the General Data Protection Regulation (GDPR, Regulation (EU) 2016/679) and the Belgian Data Protection Act (Kaderwet of 30 July 2018).</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">2. Responsible Party</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm">
                <p className="font-medium">RADOM UG (haftungsbeschränkt)</p>
                <p>Taunusanlage 8</p>
                <p>60329 Frankfurt am Main, Germany</p>
                <p className="mt-2">Email: <a href="mailto:support@checkin-ok.be" className="text-[#4F6BF6] hover:underline">support@checkin-ok.be</a></p>
              </div>
              <p className="mt-3">Due to the size of our company, no data protection officer has been appointed. For data protection inquiries, please contact us at the email address above.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">3. Data Collection on Our Website</h2>
              <h3 className="text-base font-medium text-[#1a1a1a] mb-2">Cookies</h3>
              <p>Our website uses technically necessary cookies to ensure proper functionality. These include session cookies and authentication tokens. We use a single authentication cookie (&quot;auth-token&quot;) to keep you logged in. No third-party tracking cookies are used.</p>

              <h3 className="text-base font-medium text-[#1a1a1a] mt-4 mb-2">Server Log Files</h3>
              <p>Our hosting provider automatically collects and stores information in server log files, which your browser transmits to us. These include your IP address, browser type, operating system, the referring URL, and the time of the server request. This data cannot be assigned to specific persons and is not combined with other data sources.</p>

              <h3 className="text-base font-medium text-[#1a1a1a] mt-4 mb-2">Registration and User Account</h3>
              <p>When you create an account, we collect your email address, name (optional), and company name (optional). Passwords are stored only in hashed form using bcrypt. Your account data is used to provide our services, manage subscriptions, and communicate with you about your account.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">4. Third-Party Services</h2>
              <h3 className="text-base font-medium text-[#1a1a1a] mb-2">Azure OpenAI (Document Processing)</h3>
              <p>When you upload attendance files, we may use Microsoft Azure OpenAI Service to process and correct data using AI. Data is processed in European data centers. Microsoft does not use your data to train their models.</p>

              <h3 className="text-base font-medium text-[#1a1a1a] mt-4 mb-2">Stripe (Payment Processing)</h3>
              <p>For paid subscriptions, we use Stripe as our payment processor. When you subscribe, your payment information is processed directly by Stripe and is not stored on our servers. Stripe&apos;s privacy policy applies to all payment data. See: <a href="https://stripe.com/privacy" className="text-[#4F6BF6] hover:underline" target="_blank" rel="noopener noreferrer">stripe.com/privacy</a></p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">5. Data Processing for Our Service</h2>
              <h3 className="text-base font-medium text-[#1a1a1a] mb-2">Uploaded Documents</h3>
              <p>When you upload attendance files (CSV, Excel, PDF), the data is processed in memory to generate NSSO-compliant XML declarations. For anonymous users, no uploaded data is retained after processing. For registered users, we store declaration metadata (file name, record count, status, date) but do not permanently store the original uploaded files.</p>

              <h3 className="text-base font-medium text-[#1a1a1a] mt-4 mb-2">Storage Duration</h3>
              <p>Uploaded files are processed in memory and not stored on disk. Generated XML declarations and metadata are automatically deleted after 90 days. Account data is stored for the duration of your account. You may delete your account and all associated data at any time via the Settings page.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">6. Your Rights</h2>
              <p>Under the GDPR, you have the following rights regarding your personal data:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>Right of access</strong> — You can request information about the data we store about you.</li>
                <li><strong>Right to rectification</strong> — You can request correction of inaccurate data.</li>
                <li><strong>Right to erasure</strong> — You can request deletion of your data. You can also delete your account yourself via Settings.</li>
                <li><strong>Right to restriction of processing</strong> — You can request that we restrict processing of your data.</li>
                <li><strong>Right to data portability</strong> — You can request your data in a machine-readable format.</li>
                <li><strong>Right to object</strong> — You can object to the processing of your data.</li>
                <li><strong>Right to withdraw consent</strong> — You can withdraw any consent you have given at any time.</li>
                <li><strong>Right to complain</strong> — You have the right to lodge a complaint with a supervisory authority.</li>
              </ul>
              <p className="mt-3">As our services are primarily offered in Belgium, you may lodge a complaint with the Belgian Data Protection Authority: Gegevensbeschermingsautoriteit (GBA) / Autorité de protection des données (APD), Drukpersstraat / Rue de la Presse 35, 1000 Brussels, Belgium. Website: <a href="https://www.dataprotectionauthority.be" className="text-[#4F6BF6] hover:underline" target="_blank" rel="noopener noreferrer">dataprotectionauthority.be</a></p>
              <p className="mt-2">The supervisory authority responsible for our company is: Hessischer Beauftragter für Datenschutz und Informationsfreiheit, Postfach 3163, 65021 Wiesbaden, Germany.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">7. Data Security</h2>
              <p>We use SSL/TLS encryption for all data transmissions. Passwords are hashed with bcrypt. Access to user data is restricted to authorized personnel only. Our infrastructure is hosted in European data centers.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">8. Changes to This Privacy Policy</h2>
              <p>We reserve the right to update this privacy policy to reflect changes in our practices or for legal, regulatory, or operational reasons. We will notify registered users of material changes via email.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
