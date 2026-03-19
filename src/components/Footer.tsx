'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="border-t border-gray-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            {t('copyright')}
          </p>
          <nav className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              {t('privacy')}
            </Link>
            <Link href="/impressum" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              {t('impressum')}
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              {t('terms')}
            </Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              {t('contact')}
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
