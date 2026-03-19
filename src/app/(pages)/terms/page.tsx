import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Checkin OK',
  description: 'General terms and conditions for Checkin OK.',
};

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Terms &amp; Conditions</h1>
          <p className="text-sm text-[#6b7280] mb-8">Last updated: March 2026</p>

          <div className="prose prose-sm max-w-none text-[#374151] leading-relaxed space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">§ 1 Scope</h2>
              <p>(1) These General Terms and Conditions (GTC) apply to all contracts concluded between RADOM UG (haftungsbeschränkt), Taunusanlage 8, 60329 Frankfurt am Main, Germany (hereinafter &quot;Provider&quot;) and users of the Checkin OK platform at checkin-ok.be (hereinafter &quot;Service&quot;).</p>
              <p>(2) Deviating terms and conditions of the user are not recognized unless the Provider expressly agrees to their validity in writing.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">§ 2 Service Description</h2>
              <p>(1) Checkin OK is a web-based platform for Belgian NSSO attendance compliance. The Service allows users to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Upload attendance data in CSV, Excel, or PDF format</li>
                <li>Validate employee identifiers (NISS, BIS, Limosa numbers)</li>
                <li>Apply AI-assisted corrections to invalid records</li>
                <li>Generate NSSO-compliant XML declarations (Checkinatwork &amp; CIAO)</li>
                <li>Download generated declarations for submission</li>
              </ul>
              <p className="mt-2">(2) The Service is provided &quot;as is&quot;. The Provider does not guarantee that generated declarations will be accepted by the NSSO. Users are responsible for verifying the accuracy of their declarations before submission to authorities.</p>
              <p>(3) The Provider reserves the right to modify, expand, or restrict the Service at any time.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">§ 3 Contract Conclusion and Registration</h2>
              <p>(1) The Service can be used in limited scope without registration (anonymous use). Extended features require a free or paid registration.</p>
              <p>(2) By registering, the user makes an offer to conclude a contract. The contract is concluded when the Provider activates the user account.</p>
              <p>(3) The user must provide accurate and complete information during registration and keep this information up to date.</p>
              <p>(4) The user is responsible for maintaining the confidentiality of their login credentials.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">§ 4 Prices and Payment</h2>
              <p>(1) The Service offers free and paid subscription tiers. Current prices are displayed on the pricing page.</p>
              <p>(2) All prices are in Euros and include applicable VAT.</p>
              <p>(3) Payment is processed via Stripe. The user agrees to Stripe&apos;s terms of service for payment processing.</p>
              <p>(4) Paid subscriptions are billed monthly or annually in advance, depending on the selected billing period.</p>
              <p>(5) The Provider reserves the right to change prices. Price changes for existing subscriptions take effect at the next renewal period.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">§ 5 Usage Rights and Restrictions</h2>
              <p>(1) The user receives a non-exclusive, non-transferable right to use the Service for the duration of the contract.</p>
              <p>(2) The user may not:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Use the Service for illegal purposes or to process fraudulent data</li>
                <li>Attempt to circumvent usage limits or technical restrictions</li>
                <li>Reverse-engineer, decompile, or disassemble any part of the Service</li>
                <li>Share login credentials with third parties or create multiple accounts to circumvent limits</li>
                <li>Use automated tools (bots, scrapers) to access the Service without prior written consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">§ 6 Data and Confidentiality</h2>
              <p>(1) The Provider processes user data in accordance with the applicable privacy policy.</p>
              <p>(2) Uploaded attendance data is processed in memory for the purpose of generating declarations. The Provider does not permanently store the content of uploaded files for anonymous users.</p>
              <p>(3) The user is responsible for ensuring they have the right to upload and process the attendance data they submit.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">§ 7 Availability</h2>
              <p>(1) The Provider endeavors to ensure an availability of 99% on an annual average. Excluded from this are times of maintenance, force majeure, and disruptions beyond the Provider&apos;s control.</p>
              <p>(2) The Provider reserves the right to temporarily restrict access to the Service for maintenance purposes.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">§ 8 Liability</h2>
              <p>(1) The Provider is liable without limitation for damages caused by intent or gross negligence.</p>
              <p>(2) For slight negligence, the Provider is only liable for breach of essential contractual obligations (cardinal obligations). In this case, liability is limited to the foreseeable, contract-typical damage.</p>
              <p>(3) The Provider is not liable for the accuracy or completeness of generated declarations. The user is solely responsible for verifying declarations before submission to the NSSO or other authorities.</p>
              <p>(4) The above limitations of liability do not apply to damages resulting from injury to life, body, or health.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">§ 9 Contract Duration and Termination</h2>
              <p>(1) Free accounts can be terminated at any time by the user via the account settings (Delete Account).</p>
              <p>(2) Paid subscriptions can be cancelled at any time. Cancellation takes effect at the end of the current billing period.</p>
              <p>(3) The right to extraordinary termination for good cause remains unaffected for both parties.</p>
              <p>(4) Upon termination, the user&apos;s data will be deleted in accordance with the privacy policy.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">§ 10 Right of Withdrawal for Consumers</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="font-medium mb-2">Withdrawal Instructions</p>
                <p>You have the right to withdraw from this contract within fourteen (14) days without giving any reason. The withdrawal period will expire after 14 days from the day of the conclusion of the contract.</p>
                <p className="mt-2">To exercise the right of withdrawal, you must inform us (RADOM UG, Taunusanlage 8, 60329 Frankfurt am Main, Germany, email: support@checkin-ok.be) of your decision to withdraw from this contract by an unequivocal statement (e.g. a letter sent by post or email).</p>
                <p className="mt-2">If you requested that the service begins during the withdrawal period, you shall pay us an amount proportional to the services provided up to the time you communicated your withdrawal.</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">§ 11 Final Provisions</h2>
              <p>(1) The law of the Federal Republic of Germany applies, excluding the UN Convention on Contracts for the International Sale of Goods (CISG).</p>
              <p>(2) If the user is a merchant, a legal entity under public law, or a special fund under public law, the exclusive place of jurisdiction for all disputes arising from this contract is Frankfurt am Main, Germany.</p>
              <p>(3) Should individual provisions of these GTC be or become invalid, this shall not affect the validity of the remaining provisions.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
