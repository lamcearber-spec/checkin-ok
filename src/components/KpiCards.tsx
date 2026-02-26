'use client';

import { useTranslations } from 'next-intl';
import { ScanLine, Sparkles, AlertTriangle } from 'lucide-react';
import { useAttendance } from '@/contexts/AttendanceContext';

export function KpiCards() {
  const t = useTranslations('kpi');
  const { kpi } = useAttendance();

  const cards = [
    { label: t('totalScans'), value: kpi.totalScans, icon: ScanLine, color: 'text-corp-green', bg: 'bg-corp-green-light' },
    { label: t('aiCorrections'), value: kpi.aiCorrections, icon: Sparkles, color: 'text-warning', bg: 'bg-warning-light' },
    { label: t('apiFaults'), value: kpi.apiFaults, icon: AlertTriangle, color: 'text-error', bg: 'bg-error-light' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div key={card.label} className="bg-white border border-border rounded-lg p-4 flex items-center gap-4">
          <div className={`${card.bg} p-2.5 rounded-lg`}>
            <card.icon className={`h-5 w-5 ${card.color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-navy">{card.value}</p>
            <p className="text-xs text-slate-text/60 font-medium">{card.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
