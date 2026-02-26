'use client';

import { useTranslations } from 'next-intl';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Download, FileCode } from 'lucide-react';

export function DeclarationTable() {
  const t = useTranslations('results');
  const { parsedData } = useAttendance();

  if (!parsedData || parsedData.validRows.length === 0) {
    return (
      <div className="text-center py-10 text-slate-text/50">
        <p className="text-sm">{t('noData')}</p>
      </div>
    );
  }

  const handleGenerateXml = async () => {
    try {
      const response = await fetch('/api/generate-xml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ records: parsedData.validRows }),
      });

      if (!response.ok) throw new Error('XML generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'nsso-declarations.xml';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // silently fail
    }
  };

  const handleExportCsv = () => {
    const header = 'NISS,Limosa,WorkplaceID,Date,Arrival,Departure,Type';
    const rows = parsedData.validRows.map((r) =>
      [r.niss, r.limosaId || '', r.workplaceId, r.dateOfPresence, r.timeOfArrival || '', r.timeOfDeparture || '', r.declarationType].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'valid-declarations.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-border rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-navy">{t('title')}</h3>
          <p className="text-xs text-slate-text/60">{parsedData.validRows.length} {t('transactions')}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 border border-border text-slate-text rounded hover:bg-slate-bg transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            {t('exportCsv')}
          </button>
          <button
            onClick={handleGenerateXml}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-corp-green text-white rounded hover:bg-corp-green-dark transition-colors"
          >
            <FileCode className="h-3.5 w-3.5" />
            {t('generateXml')}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs" aria-label="Valid declarations">
          <thead className="bg-slate-bg border-b border-border">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-slate-text/70">{t('niss')}</th>
              <th className="px-3 py-2 text-left font-medium text-slate-text/70">{t('limosa')}</th>
              <th className="px-3 py-2 text-left font-medium text-slate-text/70">{t('workplace')}</th>
              <th className="px-3 py-2 text-left font-medium text-slate-text/70">{t('date')}</th>
              <th className="px-3 py-2 text-left font-medium text-slate-text/70">{t('arrival')}</th>
              <th className="px-3 py-2 text-left font-medium text-slate-text/70">{t('departure')}</th>
              <th className="px-3 py-2 text-center font-medium text-slate-text/70">{t('type')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {parsedData.validRows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-bg/50">
                <td className="px-3 py-2 font-mono text-navy">{row.niss}</td>
                <td className="px-3 py-2 font-mono text-slate-text/70">{row.limosaId || '\u2014'}</td>
                <td className="px-3 py-2 font-mono text-slate-text">{row.workplaceId}</td>
                <td className="px-3 py-2 text-navy whitespace-nowrap">{row.dateOfPresence}</td>
                <td className="px-3 py-2 text-slate-text">{row.timeOfArrival || '\u2014'}</td>
                <td className="px-3 py-2 text-slate-text">{row.timeOfDeparture || '\u2014'}</td>
                <td className="px-3 py-2 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    row.declarationType === 'ciao' ? 'bg-warning-light text-warning' : 'bg-corp-green-light text-corp-green'
                  }`}>
                    {row.declarationType === 'ciao' ? t('ciao') : t('checkinatwork')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
