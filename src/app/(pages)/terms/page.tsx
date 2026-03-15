import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('termsTitle'),
    description: t('termsDescription'),
  };
}

export default function TermsPage() {
  const t = useTranslations('legal');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-navy mb-6">{t('termsTitle')}</h1>
      <div className="space-y-6 text-sm text-slate-text/80 leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('termsIntroTitle')}</h2>
          <p>{t('termsIntroText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('termsServiceTitle')}</h2>
          <p>{t('termsServiceText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('termsLiabilityTitle')}</h2>
          <p>{t('termsLiabilityText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('termsTerminationTitle')}</h2>
          <p>{t('termsTerminationText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('termsGoverningTitle')}</h2>
          <p>{t('termsGoverningText')}</p>
        </section>
      </div>
    </div>
  );
}
