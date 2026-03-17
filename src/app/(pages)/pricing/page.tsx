'use client';

import { useTranslations } from 'next-intl';
import { Check, AlertTriangle, ArrowRight } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const tierKeys = ['anonymous', 'registered', 'starter', 'professional'] as const;

export default function PricingPage() {
  const t = useTranslations('pricingPage');
  const { user } = useAuth();
  const router = useRouter();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = async (tier: string) => {
    if (!user) {
      router.push('/auth');
      return;
    }
    if (tier === 'anonymous' || tier === 'registered') {
      router.push('/#upload');
      return;
    }
    setLoadingTier(tier);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: tier.toUpperCase() }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned');
      }
    } catch (e) {
      console.error('Checkout error:', e);
    }
    setLoadingTier(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold text-navy tracking-tight">{t('title')}</h1>
        <p className="text-sm text-slate-text/70 mt-3 max-w-lg mx-auto">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {tierKeys.map((key) => {
          const isPro = key === 'professional';
          return (
            <div
              key={key}
              className={`relative bg-white rounded-lg p-6 flex flex-col ${
                isPro
                  ? 'border-2 border-corp-green shadow-lg'
                  : 'border border-border'
              }`}
            >
              {isPro && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-corp-green text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {t('popular')}
                </div>
              )}
              <h3 className="text-sm font-semibold text-navy">{t(`tiers.${key}.name`)}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-navy">{t(`tiers.${key}.price`)}</span>
                {(key === 'starter' || key === 'professional') && (
                  <span className="text-sm text-slate-text/50">{t('perMonth')}</span>
                )}
                {(key === 'anonymous' || key === 'registered') && (
                  <span className="text-sm text-slate-text/50">{t('free')}</span>
                )}
              </div>
              <p className="text-xs text-slate-text/60 mt-1">{t(`tiers.${key}.limit`)}</p>
              <ul className="mt-4 space-y-2 flex-1">
                {(t.raw(`tiers.${key}.features`) as string[]).map((feature: string) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-slate-text/70">
                    <Check className="h-3.5 w-3.5 text-corp-green flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(key)}
                disabled={loadingTier === key}
                className={`w-full mt-5 py-2.5 rounded text-sm font-medium transition-colors disabled:opacity-50 ${
                  isPro
                    ? 'bg-corp-green text-white hover:bg-corp-green-dark'
                    : 'bg-slate-bg text-navy border border-border hover:bg-white'
                }`}
              >
                {loadingTier === key ? 'Loading...' : t('cta')}
                {isPro && loadingTier !== key && <ArrowRight className="inline h-3.5 w-3.5 ml-1" />}
              </button>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8 text-xs text-error/80">
        <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
        {t('risk')}
      </div>
    </div>
  );
}
