'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

const featureCounts: Record<string, number> = {
  freeAnonymous: 2,
  freeRegistered: 3,
  starter: 3,
  professional: 3,
  business: 3,
  enterprise: 2,
};

const tiers = [
  {
    key: 'freeAnonymous',
    tier: null,
    price: 0,
    yearlyPrice: 0,
    limit: '1',
    limitType: 'day',
    featured: false,
    green: true,
    priceIdMonthly: null,
    priceIdYearly: null,
  },
  {
    key: 'freeRegistered',
    tier: 'FREE',
    price: 0,
    yearlyPrice: 0,
    limit: '5',
    limitType: 'day',
    featured: false,
    green: true,
    priceIdMonthly: null,
    priceIdYearly: null,
  },
  {
    key: 'starter',
    tier: 'STARTER',
    price: 20,
    yearlyPrice: 200,
    limit: '200',
    limitType: 'month',
    featured: false,
    green: false,
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_MONTHLY || null,
    priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_YEARLY || null,
  },
  {
    key: 'professional',
    tier: 'PROFESSIONAL',
    price: 50,
    yearlyPrice: 500,
    limit: '1,000',
    limitType: 'month',
    featured: true,
    green: false,
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_MONTHLY || null,
    priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_YEARLY || null,
  },

  {
    key: 'business',
    tier: 'BUSINESS',
    price: 99,
    yearlyPrice: 990,
    limit: '3,000',
    limitType: 'month',
    featured: false,
    green: false,
    priceIdMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_MONTHLY || null,
    priceIdYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_BUSINESS_YEARLY || null,
  },
  {
    key: 'enterprise',
    tier: 'ENTERPRISE',
    price: -1,
    yearlyPrice: -1,
    limit: '',
    limitType: 'custom',
    featured: false,
    green: false,
    priceIdMonthly: null,
    priceIdYearly: null,
  },
];

export default function PricingPage() {
  const t = useTranslations('pricingPage');
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [yearly, setYearly] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('success') === 'true' || searchParams.get('checkout') === 'success') {
      setToast({ message: t('subscriptionActivated'), type: 'success' });
      setTimeout(() => setToast(null), 5000);
    } else if (searchParams.get('canceled') === 'true' || searchParams.get('checkout') === 'cancel') {
      setToast({ message: t('checkoutCanceled'), type: 'warning' });
      setTimeout(() => setToast(null), 5000);
    }
  }, [searchParams, t]);

  const handleCheckout = async (priceId: string | null) => {
    if (!priceId) return;
    if (!user) {
      window.location.href = '/auth';
      return;
    }
    setLoading(priceId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setToast({ message: 'Checkout failed. Please try again.', type: 'warning' });
      setTimeout(() => setToast(null), 5000);
    } finally {
      setLoading(null);
    }
  };

  const handlePortal = async () => {
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {}
  };

  const isCurrentTier = (tierKey: string | null) => {
    if (!user) return false;
    if (tierKey === 'FREE' && user.tier === 'FREE') return true;
    return user.tier === tierKey;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      {toast && (
        <div className={`mb-6 text-center py-3 px-6 rounded-lg text-sm font-medium ${
          toast.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">{t('title')}</h1>
        <p className="text-lg text-slate-text/70 mb-8">{t('subtitle')}</p>

        <div className="inline-flex items-center gap-3 bg-gray-100 rounded-full p-1">
          <button
            onClick={() => setYearly(false)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              !yearly ? 'bg-white text-corp-green shadow-sm' : 'text-gray-500'
            }`}
          >
            {t('monthly')}
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              yearly ? 'bg-white text-corp-green shadow-sm' : 'text-gray-500'
            }`}
          >
            {t('yearly')}
            <span className="ml-1 text-xs text-[#4F6BF6] font-semibold">({t('yearlyDiscount')})</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => {
          const current = isCurrentTier(tier.tier);
          const priceId = yearly ? tier.priceIdYearly : tier.priceIdMonthly;

          return (
            <div
              key={tier.key}
              className={`relative rounded-2xl p-6 ${
                tier.featured
                  ? 'bg-corp-green text-white ring-2 ring-corp-green shadow-xl scale-105'
                  : tier.green
                  ? 'bg-[#eef1fe] border border-[#c7d2fe]'
                  : 'bg-white border border-border shadow-sm'
              }`}
            >
              {current && (
                <span className="absolute top-3 right-3 bg-[#4F6BF6] text-white text-xs font-bold px-2 py-1 rounded-full">
                  {t('currentPlan')}
                </span>
              )}

              <h3 className={`text-lg font-bold mb-1 ${tier.featured ? 'text-white' : 'text-navy'}`}>
                {t(tier.key)}
              </h3>
              <p className={`text-sm mb-4 ${tier.featured ? 'text-white/70' : 'text-slate-text/60'}`}>
                {t(`${tier.key}Desc`)}
              </p>

              <div className="mb-6">
                {tier.price === -1 ? (
                  <span className={`text-3xl font-bold ${tier.featured ? 'text-white' : 'text-navy'}`}>
                    {t('custom')}
                  </span>
                ) : tier.price === 0 ? (
                  <span className={`text-3xl font-bold ${tier.green ? 'text-[#4F6BF6]' : 'text-navy'}`}>
                    {t('free')}
                  </span>
                ) : (
                  <>
                    <span className={`text-3xl font-bold ${tier.featured ? 'text-white' : 'text-navy'}`}>
                      &euro;{yearly ? tier.yearlyPrice : tier.price}
                    </span>
                    <span className={`text-sm ${tier.featured ? 'text-white/70' : 'text-slate-text/60'}`}>
                      {yearly ? t('perYear') : t('perMonth')}
                    </span>
                  </>
                )}
              </div>

              <div className={`space-y-2 mb-6 text-sm ${tier.featured ? 'text-white/80' : 'text-slate-text/70'}`}>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 flex-shrink-0" />
                  {tier.limitType === 'custom' ? (
                    <span>{t('custom')}</span>
                  ) : (
                    <span>
                      {tier.limit} {tier.limitType === 'day' ? t(tier.limit === '1' ? 'declarationPerDay' : 'declarationsPerDay') : t('declarationsPerMonth')}
                    </span>
                  )}
                </div>
                {Array.from({ length: featureCounts[tier.key] || 0 }, (_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4 flex-shrink-0" />
                    <span>{t(`feature_${tier.key}_${i + 1}`)}</span>
                  </div>
                ))}
              </div>

              {current ? (
                <button
                  onClick={handlePortal}
                  className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-navy hover:bg-gray-200 transition-colors"
                >
                  {t('manage')}
                </button>
              ) : tier.price === -1 ? (
                <a
                  href="mailto:info@checkin-ok.be"
                  className="block w-full text-center py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-navy hover:bg-gray-200 transition-colors"
                >
                  {t('contact')}
                </a>
              ) : priceId ? (
                <button
                  onClick={() => handleCheckout(priceId)}
                  disabled={loading === priceId}
                  className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 ${
                    tier.featured
                      ? 'bg-white text-corp-green hover:bg-white/90'
                      : 'bg-corp-green text-white hover:bg-corp-green/90'
                  }`}
                >
                  {loading === priceId ? '...' : t('getStarted')}
                </button>
              ) : (
                <Link href={tier.price === 0 && tier.tier === 'FREE' ? '/auth' : '/#upload'}
                  className={`block w-full text-center py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    tier.green
                      ? 'bg-[#4F6BF6] text-white hover:bg-[#3D5BD9]'
                      : 'bg-corp-green text-white hover:bg-corp-green/90'
                  }`}
                >
                  {t('getStarted')}
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
