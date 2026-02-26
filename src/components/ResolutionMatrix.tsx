'use client';

import { useTranslations } from 'next-intl';
import { useAttendance } from '@/contexts/AttendanceContext';
import { Check, X, Sparkles } from 'lucide-react';

export function ResolutionMatrix() {
  const t = useTranslations('resolution');
  const { parsedData, approveCorrection, rejectCorrection, approveAllCorrections } = useAttendance();

  if (!parsedData || parsedData.aiCorrections.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-border rounded-lg">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <h3 className="text-sm font-semibold text-navy flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-warning" />
            {t('title')}
          </h3>
          <p className="text-xs text-slate-text/60">{t('subtitle')}</p>
        </div>
        <button
          onClick={approveAllCorrections}
          className="text-xs font-medium px-3 py-1.5 bg-corp-green text-white rounded hover:bg-corp-green-dark transition-colors"
        >
          {t('approveAll')}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs" aria-label="Resolution matrix">
          <thead className="bg-slate-bg border-b border-border">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-slate-text/70">#</th>
              <th className="px-3 py-2 text-left font-medium text-slate-text/70">{t('field')}</th>
              <th className="px-3 py-2 text-left font-medium text-slate-text/70">{t('original')}</th>
              <th className="px-3 py-2 text-left font-medium text-slate-text/70">{t('corrected')}</th>
              <th className="px-3 py-2 text-center font-medium text-slate-text/70">{t('confidence')}</th>
              <th className="px-3 py-2 text-center font-medium text-slate-text/70">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {parsedData.aiCorrections.map((correction) => {
              const fields: { name: string; original: string; corrected: string }[] = [];
              if (correction.correctedNiss) {
                fields.push({ name: 'NISS/BIS', original: correction.originalRow.niss, corrected: correction.correctedNiss });
              }
              if (correction.correctedDate) {
                fields.push({ name: 'Date', original: correction.originalRow.dateOfPresence, corrected: correction.correctedDate });
              }
              if (correction.correctedLimosaId) {
                fields.push({ name: 'Limosa', original: correction.originalRow.limosaId || '', corrected: correction.correctedLimosaId });
              }
              if (correction.correctedName) {
                fields.push({ name: 'Name', original: correction.originalRow.workerName || '', corrected: correction.correctedName });
              }
              if (correction.correctedArrival) {
                fields.push({ name: 'Arrival', original: correction.originalRow.timeOfArrival || '', corrected: correction.correctedArrival });
              }
              if (correction.correctedDeparture) {
                fields.push({ name: 'Departure', original: correction.originalRow.timeOfDeparture || '', corrected: correction.correctedDeparture });
              }

              return fields.map((field, fIdx) => (
                <tr key={`${correction.rowIndex}-${fIdx}`} className="hover:bg-slate-bg/50">
                  {fIdx === 0 && (
                    <td className="px-3 py-2 text-slate-text/60 font-mono" rowSpan={fields.length}>
                      {correction.rowIndex + 1}
                    </td>
                  )}
                  <td className="px-3 py-2 font-medium text-navy">{field.name}</td>
                  <td className="px-3 py-2">
                    <span className="inline-block px-1.5 py-0.5 bg-error-light text-error rounded font-mono text-xs border border-error/20">
                      {field.original || '\u2014'}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-block px-1.5 py-0.5 bg-success-light text-success rounded font-mono text-xs border border-success/20">
                      {field.corrected}
                    </span>
                  </td>
                  {fIdx === 0 && (
                    <>
                      <td className="px-3 py-2 text-center" rowSpan={fields.length}>
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                          correction.confidence >= 85 ? 'bg-success-light text-success' : 'bg-warning-light text-warning'
                        }`}>
                          {Math.round(correction.confidence)}%
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center" rowSpan={fields.length}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => approveCorrection(correction)}
                            className="p-1 bg-success-light text-success rounded hover:bg-success/20 transition-colors"
                            title={t('approve')}
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => rejectCorrection(correction.rowIndex)}
                            className="p-1 bg-error-light text-error rounded hover:bg-error/20 transition-colors"
                            title={t('reject')}
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
