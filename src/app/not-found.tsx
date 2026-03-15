import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="bg-corp-green-light p-4 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
        <AlertTriangle className="h-8 w-8 text-corp-green" />
      </div>
      <h1 className="text-2xl font-bold text-navy mb-3">{t('title')}</h1>
      <p className="text-sm text-slate-text/70 mb-6">{t('message')}</p>
      <Link
        href="/"
        className="inline-block bg-corp-green text-white py-2.5 px-5 rounded text-sm font-medium hover:bg-corp-green-dark transition-colors"
      >
        {t('back')}
      </Link>
    </div>
  );
}
