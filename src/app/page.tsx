import { useTranslations } from 'next-intl';
import { KpiCards } from '@/components/KpiCards';
import { UploadZone } from '@/components/UploadZone';
import { ResolutionMatrix } from '@/components/ResolutionMatrix';
import { DeclarationTable } from '@/components/DeclarationTable';
import { FAQ } from '@/components/FAQ';
import Link from 'next/link';
import { Shield, Sparkles, FileCode, Lock, ClipboardCheck, ArrowRight, Award, Server } from 'lucide-react';
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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero */}
      <section className="pt-8 sm:pt-16 pb-12 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-4 sm:mb-6 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-base sm:text-xl text-[#6b7280] mb-6 sm:mb-10 max-w-3xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <a href="#upload" className="w-full sm:w-auto">
                <span className="inline-flex items-center justify-center w-full sm:w-auto bg-[#4F6BF6] hover:bg-[#3D5BD9] text-white shadow-lg shadow-[#4F6BF6]/25 px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-semibold rounded-lg transition-colors">
                  {t('bottomCta.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              </a>
              <a href="#features" className="w-full sm:w-auto">
                <span className="inline-flex items-center justify-center w-full sm:w-auto border border-[#e5e7eb] text-[#6b7280] hover:bg-gray-50 px-6 sm:px-8 py-4 sm:py-5 text-base sm:text-lg font-medium rounded-lg transition-colors">
                  {t('hero.trusted')}
                </span>
              </a>
            </div>
          </div>

          {/* Upload Zone */}
          <div id="upload" className="max-w-2xl mx-auto">
            <UploadZone />
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-y border-[#e5e7eb] bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {[
              { label: t('trust.gdpr'), icon: Shield, color: 'text-[#4F6BF6]' },
              { label: t('trust.euServers'), icon: Server, color: 'text-[#10b981]' },
              { label: t('trust.zero'), icon: Lock, color: 'text-[#f59e0b]' },
              { label: t('trust.free'), icon: Award, color: 'text-[#6b7280]' },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-2 text-[#6b7280]">
                <badge.icon className={`w-5 h-5 ${badge.color}`} />
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resolution Matrix (AI corrections) */}
      <section className="px-4 sm:px-6 lg:px-8 bg-white pb-16 pt-16">
        <div className="max-w-6xl mx-auto">
          <ResolutionMatrix />
        </div>
      </section>

      {/* Valid Declarations Table */}
      <section className="px-4 sm:px-6 lg:px-8 bg-white pb-16">
        <div className="max-w-6xl mx-auto">
          <DeclarationTable />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">
              {t('features.validation')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {[
              { icon: Shield, title: t('features.validation'), desc: t('features.validationDesc'), iconColor: 'text-[#4F6BF6]', iconBg: 'bg-[#4F6BF6]/10' },
              { icon: Sparkles, title: t('features.ai'), desc: t('features.aiDesc'), iconColor: 'text-[#10b981]', iconBg: 'bg-[#10b981]/10' },
              { icon: FileCode, title: t('features.xml'), desc: t('features.xmlDesc'), iconColor: 'text-[#f59e0b]', iconBg: 'bg-[#f59e0b]/10' },
              { icon: Lock, title: t('features.privacy'), desc: t('features.privacyDesc'), iconColor: 'text-purple-600', iconBg: 'bg-purple-100' },
            ].map((f) => (
              <div key={f.title} className="p-6 rounded-2xl bg-gray-50/50 border border-[#e5e7eb] hover:border-[#4F6BF6]/30 hover:shadow-sm transition-all">
                <div className={`w-12 h-12 ${f.iconBg} rounded-xl flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 ${f.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{f.title}</h3>
                <p className="text-[#6b7280] text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">{t('pricing.title')}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className={`relative bg-white rounded-2xl p-6 sm:p-8 flex flex-col text-left ${
                  tier.featured ? 'border-2 border-[#4F6BF6] ring-2 ring-[#4F6BF6]/20 shadow-xl' : 'border-2 border-[#e5e7eb] hover:border-[#4F6BF6]/30'
                } transition-all`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F6BF6] text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-1">{t(`pricingPage.${tier.key}`)}</h3>
                <p className="text-[#6b7280] text-sm mb-4">{t(`pricingPage.${tier.key}Desc`)}</p>
                <p className="text-sm text-[#6b7280]/70 mb-6">{tier.limit}</p>
                <ul className="space-y-2 mb-6 flex-1">
                  {Array.from({ length: tier.features }, (_, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-[#6b7280]">
                      <Shield className="h-4 w-4 text-[#10b981] flex-shrink-0 mt-0.5" />
                      {t(`pricingPage.feature_${tier.key}_${i + 1}`)}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.free ? '/#upload' : '/pricing'}
                  className={`block w-full text-center py-3 rounded-lg text-sm font-semibold transition-colors ${
                    tier.featured
                      ? 'bg-[#4F6BF6] text-white hover:bg-[#3D5BD9]'
                      : 'bg-gray-100 text-[#1a1a1a] hover:bg-gray-200'
                  }`}
                >
                  {t('pricingPage.getStarted')}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm text-[#4F6BF6] font-medium hover:text-[#3D5BD9] transition-colors"
            >
              {t('pricing.homeCta')}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <FAQ />
        </div>
      </section>


      {/* Bottom CTA */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-2xl p-8 md:p-16 text-center" style={{ background: 'linear-gradient(135deg, #4F6BF6, #3D5BD9)' }}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">{t('bottomCta.title')}</h2>
          <p className="text-base sm:text-lg text-white/80 mb-8 max-w-lg mx-auto">{t('bottomCta.subtitle')}</p>
          <a
            href="/#upload"
            className="inline-flex items-center gap-2 bg-white text-[#4F6BF6] py-4 px-8 rounded-lg text-base font-semibold hover:bg-white/90 transition-colors shadow-lg"
          >
            {t('bottomCta.cta')}
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </section>
    </div>
  );
}
