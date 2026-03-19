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
      className={`border-2 border-dashed rounded-2xl p-6 sm:p-12 text-center cursor-pointer transition-all duration-200 group ${
        status === 'processing' ? 'border-[#4F6BF6] bg-[#4F6BF6]/5 cursor-wait' :
        status === 'success' ? 'border-[#10b981] bg-[#10b981]/5' :
        status === 'error' ? 'border-red-400 bg-red-50' :
        isDragActive ? 'border-[#4F6BF6] bg-[#4F6BF6]/5 scale-[1.02]' :
        'border-[#e5e7eb] hover:border-[#4F6BF6]/50'
      }`}
      aria-label={t('dropzone')}
    >
      <input {...getInputProps()} aria-label="File upload input" />
      <div className="flex flex-col items-center gap-3">
        {status === 'processing' ? (
          <>
            <div className="w-16 h-16 bg-[#4F6BF6]/20 rounded-2xl flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-[#4F6BF6] animate-spin" />
            </div>
            <p className="text-[#6b7280] text-lg">{t('processing')}</p>
          </>
        ) : status === 'success' ? (
          <>
            <div className="w-16 h-16 bg-[#10b981]/20 rounded-2xl flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-[#10b981]" />
            </div>
            <p className="text-[#6b7280] text-lg">{t('success')}</p>
          </>
        ) : status === 'error' ? (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-[#6b7280] text-lg">{t('error')}</p>
            <p className="text-sm text-red-500">{errorMsg}</p>
          </>
        ) : (
          <>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-colors ${
              isDragActive ? 'bg-[#4F6BF6]/20' : 'bg-[#4F6BF6]/10 group-hover:bg-[#4F6BF6]/20'
            }`}>
              {isDragActive ? <FileSpreadsheet className="h-8 w-8 text-[#4F6BF6]" /> : <Upload className="h-8 w-8 text-[#4F6BF6]" />}
            </div>
            <p className="text-[#6b7280] text-lg">{t('dropzone')}</p>
            <p className="text-sm text-[#6b7280]/70">{t('dropzoneAlt')}</p>
            <p className="text-sm text-[#6b7280]/50 mt-1">{t('formats')}</p>
          </>
        )}
      </div>
    </div>
  );
}
