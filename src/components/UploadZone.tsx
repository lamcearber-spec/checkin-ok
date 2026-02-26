'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileSpreadsheet, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useAttendance } from '@/contexts/AttendanceContext';
import type { ParsedAttendance } from '@/schema/attendanceSchema';

export function UploadZone() {
  const t = useTranslations('upload');
  const { setParsedData, setFileName, setKpi } = useAttendance();
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const processFile = useCallback(async (file: File) => {
    setStatus('processing');
    setFileName(file.name);
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Parse failed');
      }

      const data: ParsedAttendance = await response.json();
      setParsedData(data);
      setKpi({
        totalScans: data.validRows.length + data.invalidRows.length,
        aiCorrections: data.aiCorrections.length,
        apiFaults: 0,
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [setParsedData, setFileName, setKpi]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && processFile(files[0]),
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
    disabled: status === 'processing',
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-200 ${
        status === 'processing' ? 'border-corp-green bg-corp-green-light/30 cursor-wait' :
        status === 'success' ? 'border-success bg-success-light' :
        status === 'error' ? 'border-error bg-error-light' :
        isDragActive ? 'border-corp-green bg-corp-green-light/30 scale-[1.005]' :
        'border-border-dark hover:border-corp-green/50 hover:bg-slate-bg'
      }`}
      aria-label={t('dropzone')}
    >
      <input {...getInputProps()} aria-label="File upload input" />
      <div className="flex flex-col items-center gap-3">
        {status === 'processing' ? (
          <>
            <Loader2 className="h-12 w-12 text-corp-green animate-spin" />
            <p className="text-sm text-navy font-medium">{t('processing')}</p>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle className="h-12 w-12 text-success" />
            <p className="text-sm text-navy font-medium">{t('success')}</p>
          </>
        ) : status === 'error' ? (
          <>
            <AlertCircle className="h-12 w-12 text-error" />
            <p className="text-sm text-navy font-medium">{t('error')}</p>
            <p className="text-xs text-error/80">{errorMsg}</p>
          </>
        ) : (
          <>
            {isDragActive ? <FileSpreadsheet className="h-12 w-12 text-corp-green" /> : <Upload className="h-12 w-12 text-slate-text/30" />}
            <p className="text-sm text-navy font-medium">{t('dropzone')}</p>
            <p className="text-xs text-slate-text/50">{t('dropzoneAlt')}</p>
            <p className="text-xs text-slate-text/40 mt-1">{t('formats')}</p>
          </>
        )}
      </div>
    </div>
  );
}
