import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import { Mail, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('contactTitle'),
    description: t('contactDescription'),
  };
}

export default function ContactPage() {
  const t = useTranslations('contact');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-navy mb-2">{t('title')}</h1>
      <p className="text-sm text-slate-text/70 mb-8">{t('subtitle')}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-corp-green-light p-2 rounded">
              <Mail className="h-4 w-4 text-corp-green" />
            </div>
            <h2 className="text-sm font-semibold text-navy">{t('emailLabel')}</h2>
          </div>
          <p className="text-sm text-slate-text/70 mb-4">{t('email')}</p>
          <a
            href={`mailto:${t('email')}`}
            className="inline-block bg-corp-green text-white py-2.5 px-5 rounded text-sm font-medium hover:bg-corp-green-dark transition-colors"
          >
            {t('cta')}
          </a>
        </div>
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-corp-green-light p-2 rounded">
              <MapPin className="h-4 w-4 text-corp-green" />
            </div>
            <h2 className="text-sm font-semibold text-navy">{t('addressLabel')}</h2>
          </div>
          <p className="text-sm text-slate-text/70 whitespace-pre-line">{t('address')}</p>
        </div>
      </div>
    </div>
  );
}
