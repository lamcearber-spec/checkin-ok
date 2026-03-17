import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { AttendanceProvider } from '@/contexts/AttendanceContext';
import { AuthProvider } from '@/components/AuthProvider';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import './globals.css';

export const metadata: Metadata = {
  title: 'Checkin OK — Belgian NSSO Attendance Compliance',
  description: 'Automated Checkinatwork & CIAO declarations. Upload CSV/Excel, validate NISS/BIS/Limosa, generate NSSO-compliant XML. Zero data retention.',
  icons: {
    icon: '/favicon.svg',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'Checkin OK — Belgian NSSO Attendance Compliance',
    description: 'Automated Checkinatwork & CIAO declarations. Upload CSV/Excel, validate NISS/BIS/Limosa, generate NSSO-compliant XML. Zero data retention.',
    url: 'https://checkin-ok.be',
    siteName: 'Checkin OK',
    locale: 'nl_BE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Checkin OK — Belgian NSSO Attendance Compliance',
    description: 'Automated Checkinatwork & CIAO declarations. Upload CSV/Excel, validate NISS/BIS/Limosa, generate NSSO-compliant XML. Zero data retention.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Checkin-OK.be',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  description: 'Geautomatiseerde Checkinatwork & CIAO-aangiften. Upload CSV/Excel, valideer INSZ/BIS/Limosa, genereer RSZ-conforme XML. Geen gegevensopslag.',
  url: 'https://checkin-ok.be',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '50',
    priceCurrency: 'EUR',
    offerCount: '4',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <AttendanceProvider>
              <Sidebar />
              <div className="flex-1 flex flex-col min-h-screen">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <CookieConsent />
            </AttendanceProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
