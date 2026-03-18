import { useTranslations } from 'next-intl';
import { KpiCards } from '@/components/KpiCards';
import { UploadZone } from '@/components/UploadZone';
import { ResolutionMatrix } from '@/components/ResolutionMatrix';
import { DeclarationTable } from '@/components/DeclarationTable';
import { FAQ } from '@/components/FAQ';
import { Testimonials } from '@/components/Testimonials';
import Link from 'next/link';
import { Shield, Sparkles, FileCode, Lock, ClipboardCheck, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  return {
    title: t('homeTitle'),
    description: t('homeDescription'),
  };
}

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
      <section id="pricing" className="space-y-4">
        <h2 className="text-lg font-bold text-navy">{t('pricing.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {([
            { key: 'freeAnonymous', free: true, featured: false, limit: '1 declaration/day', features: 2 },
            { key: 'freeRegistered', free: true, featured: false, limit: '5 declarations/day', features: 3 },
            { key: 'starter', free: false, featured: false, limit: '200 declarations/mo', features: 4 },
            { key: 'professional', free: false, featured: true, limit: '1,000 declarations/mo', features: 5 },
            { key: 'business', free: false, featured: false, limit: '3,000 declarations/mo', features: 5 },
            { key: 'enterprise', free: false, featured: false, limit: 'Custom', features: 5 },
          ] as const).map((tier) => (
            <div
              key={tier.key}
              className={`relative bg-white border rounded-lg p-5 flex flex-col ${
                tier.featured ? 'border-corp-green ring-2 ring-corp-green' : 'border-border'
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-corp-green text-white text-xs font-semibold px-3 py-0.5 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-sm font-semibold text-navy">{t(`pricingPage.${tier.key}`)}</h3>
              <p className="text-xs text-slate-text/50 mt-1 mb-2">{t(`pricingPage.${tier.key}Desc`)}</p>
              <p className="text-xs text-slate-text/40 mb-3">{tier.limit}</p>
              <ul className="space-y-1.5 mb-4 flex-1">
                {Array.from({ length: tier.features }, (_, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-text/70">
                    <Shield className="h-3.5 w-3.5 text-corp-green flex-shrink-0 mt-0.5" />
                    {t(`pricingPage.feature_${tier.key}_${i + 1}`)}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.free ? '/#upload' : '/pricing'}
                className={`block w-full text-center py-2 rounded text-xs font-medium transition-colors ${
                  tier.featured
                    ? 'bg-corp-green text-white hover:bg-corp-green-dark'
                    : 'bg-slate-bg text-navy border border-border hover:bg-white'
                }`}
              >
                {t('pricingPage.getStarted')}
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-sm text-corp-green font-medium hover:text-corp-green-dark transition-colors"
          >
            {t('pricing.homeCta')}
            <ArrowRight className="h-4 w-4" />
          </Link>
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

      {/* FAQ */}
      <FAQ />

      {/* Testimonials */}
      <Testimonials />

      {/* Bottom CTA */}
      <section className="rounded-lg p-8 md:p-12 text-center" style={{ background: 'linear-gradient(135deg, #059669, #047857)' }}>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3">{t('bottomCta.title')}</h2>
        <p className="text-sm text-white/80 mb-6 max-w-lg mx-auto">{t('bottomCta.subtitle')}</p>
        <a
          href="/#upload"
          className="inline-flex items-center gap-2 bg-white text-corp-green py-3 px-6 rounded text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          {t('bottomCta.cta')}
          <ArrowRight className="h-4 w-4" />
        </a>
      </section>
    </div>
  );
}
