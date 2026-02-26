import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import { AttendanceProvider } from '@/contexts/AttendanceContext';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CookieConsent } from '@/components/CookieConsent';
import './globals.css';

export const metadata: Metadata = {
  title: 'Checkin OK — Belgian NSSO Attendance Compliance',
  description: 'Automated Checkinatwork & CIAO declarations. Upload CSV/Excel, validate NISS/BIS/Limosa, generate NSSO-compliant XML. Zero data retention.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex">
        <NextIntlClientProvider messages={messages}>
          <AttendanceProvider>
            <Sidebar />
            <div className="flex-1 flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <CookieConsent />
          </AttendanceProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
