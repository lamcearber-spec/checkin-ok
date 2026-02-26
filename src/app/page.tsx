import { useTranslations } from 'next-intl';
import { KpiCards } from '@/components/KpiCards';
import { UploadZone } from '@/components/UploadZone';
import { ResolutionMatrix } from '@/components/ResolutionMatrix';
import { DeclarationTable } from '@/components/DeclarationTable';
import { Shield, Sparkles, FileCode, Lock, ClipboardCheck, AlertTriangle, Check } from 'lucide-react';

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Hero */}
      <section className="bg-white border border-border rounded-lg p-6 md:p-8">
        <div className="max-w-2xl">
          <h1 className="text-2xl md:text-3xl font-bold text-navy tracking-tight leading-tight">{t('hero.title')}</h1>
          <p className="text-sm text-slate-text/70 mt-3 leading-relaxed">{t('hero.subtitle')}</p>
          <p className="text-xs text-slate-text/40 mt-2 font-mono">{t('hero.trusted')}</p>
        </div>
      </section>

      {/* KPI Cards */}
      <KpiCards />

      {/* Upload Zone */}
      <section>
        <h2 className="text-sm font-semibold text-navy mb-3">{t('upload.title')}</h2>
        <UploadZone />
      </section>

      {/* Resolution Matrix (AI corrections) */}
      <ResolutionMatrix />

      {/* Valid Declarations Table */}
      <DeclarationTable />

      {/* Features */}
      <section id="features" className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Shield, title: t('features.validation'), desc: t('features.validationDesc') },
          { icon: Sparkles, title: t('features.ai'), desc: t('features.aiDesc') },
          { icon: FileCode, title: t('features.xml'), desc: t('features.xmlDesc') },
          { icon: Lock, title: t('features.privacy'), desc: t('features.privacyDesc') },
        ].map((f) => (
          <div key={f.title} className="bg-white border border-border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-corp-green-light p-2 rounded">
                <f.icon className="h-4 w-4 text-corp-green" />
              </div>
              <h3 className="text-sm font-semibold text-navy">{f.title}</h3>
            </div>
            <p className="text-xs text-slate-text/60 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-white border border-border rounded-lg p-6 md:p-8">
        <h2 className="text-lg font-bold text-navy mb-6">{t('pricing.title')}</h2>
        <div className="max-w-sm">
          <div className="border-2 border-corp-green rounded-lg p-6">
            <h3 className="text-sm font-semibold text-navy">{t('pricing.business')}</h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-bold text-navy">{t('pricing.businessPrice')}</span>
              <span className="text-sm text-slate-text/50">{t('pricing.businessPeriod')}</span>
            </div>
            <p className="text-xs text-slate-text/60 mt-2">{t('pricing.businessDesc')}</p>
            <ul className="mt-4 space-y-2">
              {(t.raw('pricing.features') as string[]).map((feature: string) => (
                <li key={feature} className="flex items-center gap-2 text-xs text-slate-text/70">
                  <Check className="h-3.5 w-3.5 text-corp-green flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            <button className="w-full mt-5 bg-corp-green text-white py-2.5 rounded text-sm font-medium hover:bg-corp-green-dark transition-colors">
              {t('pricing.cta')}
            </button>
            <div className="flex items-center gap-2 mt-3 text-xs text-error/80">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
              {t('pricing.risk')}
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="flex flex-wrap justify-center gap-6 py-4">
        {[t('trust.gdpr'), t('trust.gba'), t('trust.zero'), t('trust.nsso')].map((badge) => (
          <div key={badge} className="flex items-center gap-2 text-xs text-slate-text/50">
            <ClipboardCheck className="h-3.5 w-3.5 text-corp-green" />
            {badge}
          </div>
        ))}
      </section>
    </div>
  );
}
