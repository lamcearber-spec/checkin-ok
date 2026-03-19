'use client';

import { useTranslations } from 'next-intl';
import { ScanLine, Sparkles, AlertTriangle } from 'lucide-react';
import { useAttendance } from '@/contexts/AttendanceContext';

export function KpiCards() {
  const t = useTranslations('kpi');
  const { kpi } = useAttendance();

  const cards = [
    { label: t('totalScans'), value: kpi.totalScans, icon: ScanLine, iconColor: 'text-[#4F6BF6]', iconBg: 'bg-[#4F6BF6]/10' },
    { label: t('aiCorrections'), value: kpi.aiCorrections, icon: Sparkles, iconColor: 'text-[#f59e0b]', iconBg: 'bg-[#f59e0b]/10' },
    { label: t('apiFaults'), value: kpi.apiFaults, icon: AlertTriangle, iconColor: 'text-red-500', iconBg: 'bg-red-50' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {cards.map((card) => (
        <div key={card.label} className="bg-white border border-[#e5e7eb] rounded-2xl p-6 text-center hover:border-[#4F6BF6]/30 hover:shadow-sm transition-all">
          <div className={`w-14 h-14 ${card.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
            <card.icon className={`h-7 w-7 ${card.iconColor}`} />
          </div>
          <p className="text-3xl font-bold text-[#1a1a1a]">{card.value}</p>
          <p className="text-sm text-[#6b7280] font-medium mt-1">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
