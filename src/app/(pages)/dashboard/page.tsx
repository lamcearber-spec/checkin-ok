'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useTranslations } from 'next-intl';
import { BarChart3, FileText, Upload, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface UsageData { tier: string; used: number; limit: number; period: string; }

export default function DashboardPage() {
  const { user } = useAuth();
  const t = useTranslations('dashboard');
  const [usage, setUsage] = useState<UsageData | null>(null);
  useEffect(() => { fetch('/api/usage').then(r => r.json()).then(setUsage).catch(() => {}); }, []);
  const tierLabel: Record<string, string> = { FREE: 'Free', STARTER: 'Starter', PROFESSIONAL: 'Professional' };

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-gray-600 mt-1">{t('welcome')}{user?.name ? `, ${user.name}` : ''}.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#eef1fe] rounded-lg">
                <BarChart3 className="text-[#4F6BF6]" size={20} />
              </div>
              <h3 className="text-sm font-medium text-gray-500">{t('currentPlan')}</h3>
            </div>
            <p className="text-2xl font-bold text-gray-900">{tierLabel[user?.tier || 'FREE'] || user?.tier}</p>
          </div>

          {/* Usage Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#eef1fe] rounded-lg">
                <FileText className="text-[#4F6BF6]" size={20} />
              </div>
              <h3 className="text-sm font-medium text-gray-500">{t('usage')}</h3>
            </div>
            {usage ? (
              <>
                <p className="text-2xl font-bold text-gray-900">
                  {usage.used} / {usage.limit === 999999 ? '\u221e' : usage.limit}
                </p>
                <p className="text-gray-500 text-sm mt-1">declarations this {usage.period}</p>
                <div className="mt-3 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#4F6BF6] h-full rounded-full transition-all"
                    style={{ width: `${Math.min(100, (usage.used / (usage.limit === 999999 ? 1 : usage.limit)) * 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <p className="text-gray-400">Loading...</p>
            )}
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#eef1fe] rounded-lg">
                <Upload className="text-[#4F6BF6]" size={20} />
              </div>
              <h3 className="text-sm font-medium text-gray-500">{t('quickActions')}</h3>
            </div>
            <div className="space-y-3">
              <Link href="/#upload" className="flex items-center justify-between text-gray-700 hover:text-[#4F6BF6] transition-colors text-sm">
                Upload file <ArrowRight size={16} />
              </Link>
              <Link href="/history" className="flex items-center justify-between text-gray-700 hover:text-[#4F6BF6] transition-colors text-sm">
                {t('viewHistory')} <ArrowRight size={16} />
              </Link>
              <Link href="/pricing" className="flex items-center justify-between text-gray-700 hover:text-[#4F6BF6] transition-colors text-sm">
                {t('upgradePlan')} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
