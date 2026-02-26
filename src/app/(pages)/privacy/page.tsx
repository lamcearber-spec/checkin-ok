import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('legal');

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-navy mb-6">{t('privacyTitle')}</h1>
      <div className="space-y-6 text-sm text-slate-text/80 leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('privacyIntroTitle')}</h2>
          <p>{t('privacyIntroText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('privacyDataTitle')}</h2>
          <p>{t('privacyDataText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('privacyRetentionTitle')}</h2>
          <p>{t('privacyRetentionText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('privacyCookiesTitle')}</h2>
          <p>{t('privacyCookiesText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('privacyRightsTitle')}</h2>
          <p>{t('privacyRightsText')}</p>
        </section>
        <section>
          <h2 className="text-base font-semibold text-navy mb-2">{t('privacyContactTitle')}</h2>
          <p>{t('privacyContactText')}</p>
        </section>
      </div>
    </div>
  );
}
