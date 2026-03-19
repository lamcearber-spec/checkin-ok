import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Impressum — Checkin OK',
  description: 'Legal notice (Impressum) for Checkin OK.',
};

export default function ImpressumPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-10">
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Impressum</h1>
          <p className="text-sm text-[#6b7280] mb-8">Legal Notice according to § 5 TMG</p>

          <div className="prose prose-sm max-w-none text-[#374151] leading-relaxed space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Information according to § 5 TMG</h2>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 text-sm">
                <p className="font-medium">RADOM UG (haftungsbeschränkt)</p>
                <p>Telemannstr. 2</p>
                <p>60323 Frankfurt am Main</p>
                <p>Germany</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Contact</h2>
              <p>Email: <a href="mailto:support@checkin-ok.be" className="text-[#4F6BF6] hover:underline">support@checkin-ok.be</a></p>
              <p>Website: <a href="https://checkin-ok.be" className="text-[#4F6BF6] hover:underline">www.checkin-ok.be</a></p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Managing Director</h2>
              <p>Arber Lamce</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Commercial Register</h2>
              <p>Registration Court: Amtsgericht Frankfurt am Main</p>
              <p>Registration Number: HRB 141671</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">VAT Identification Number</h2>
              <p>VAT ID according to § 27a Umsatzsteuergesetz: pending assignment.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Responsible for Content (§ 55 Abs. 2 RStV)</h2>
              <p>Arber Lamce</p>
              <p>Telemannstr. 2, 60323 Frankfurt am Main, Germany</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">EU Dispute Resolution</h2>
              <p>The European Commission provides a platform for online dispute resolution (OS): <a href="https://ec.europa.eu/consumers/odr" className="text-[#4F6BF6] hover:underline" target="_blank" rel="noopener noreferrer">https://ec.europa.eu/consumers/odr</a></p>
              <p className="mt-2">Our email address can be found above.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Consumer Dispute Resolution</h2>
              <p>We are not willing or obliged to participate in dispute resolution proceedings before a consumer arbitration board.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Liability for Content</h2>
              <p>As a service provider, we are responsible for our own content on these pages according to § 7 para. 1 TMG. However, according to §§ 8 to 10 TMG, we are not obligated to monitor transmitted or stored third-party information or to investigate circumstances indicating illegal activity. Obligations to remove or block the use of information under general law remain unaffected.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Liability for Links</h2>
              <p>Our website may contain links to external third-party websites whose content is beyond our control. Therefore, we cannot assume any liability for this external content. The respective provider or operator of the linked pages is always responsible for the content of the linked pages.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">Copyright</h2>
              <p>The content and works created by the site operators on these pages are subject to German copyright law. Duplication, processing, distribution, and any form of commercialization of such material beyond the scope of copyright law require the prior written consent of the respective author or creator.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
