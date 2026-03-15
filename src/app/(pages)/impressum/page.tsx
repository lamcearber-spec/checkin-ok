import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('impressumTitle'),
    description: t('impressumDescription'),
  };
}

export default function ImpressumPage() {
  const t = useTranslations('legal');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-navy mb-6">{t('impressumTitle')}</h1>
      <div className="space-y-6 text-sm text-slate-text/80 leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('impressumCompanyTitle')}</h2>
          <p>{t('impressumCompanyText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('impressumAddressTitle')}</h2>
          <p>{t('impressumAddressText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('impressumContactTitle')}</h2>
          <p>{t('impressumContactText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('impressumRegisterTitle')}</h2>
          <p>{t('impressumRegisterText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('impressumVatTitle')}</h2>
          <p>{t('impressumVatText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('impressumCeoTitle')}</h2>
          <p>{t('impressumCeoText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('impressumDisclaimerTitle')}</h2>
          <p>{t('impressumDisclaimerText')}</p>
        </section>
      </div>
    </div>
  );
}
