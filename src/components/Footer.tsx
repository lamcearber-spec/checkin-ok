'use client';

import { useTranslations } from 'next-intl';
import { ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className="bg-white border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <ClipboardCheck className="h-5 w-5 text-corp-green" />
              <span className="font-bold text-navy text-sm">Checkin OK</span>
            </div>
            <p className="text-xs text-slate-text/60 leading-relaxed">{t('description')}</p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-navy mb-3 uppercase tracking-wider">{t('product')}</h4>
            <ul className="space-y-2 text-xs text-slate-text/60">
              <li><a href="/#features" className="hover:text-corp-green transition-colors">{t('features')}</a></li>
              <li><Link href="/pricing" className="hover:text-corp-green transition-colors">{t('pricing')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-navy mb-3 uppercase tracking-wider">{t('legal')}</h4>
            <ul className="space-y-2 text-xs text-slate-text/60">
              <li><Link href="/privacy" className="hover:text-corp-green transition-colors">{t('privacy')}</Link></li>
              <li><Link href="/terms" className="hover:text-corp-green transition-colors">{t('terms')}</Link></li>
              <li><Link href="/impressum" className="hover:text-corp-green transition-colors">{t('impressum')}</Link></li>
              <li><Link href="/contact" className="hover:text-corp-green transition-colors">{t('contact')}</Link></li>
              <li><Link href="/blog" className="hover:text-corp-green transition-colors">{t('blog')}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center">
          <p className="text-xs text-slate-text/40">{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
