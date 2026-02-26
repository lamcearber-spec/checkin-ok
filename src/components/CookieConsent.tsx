'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export function CookieConsent() {
  const t = useTranslations('cookie');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setVisible(true);
  }, []);

  const handle = (choice: 'accept' | 'decline') => {
    localStorage.setItem('cookie-consent', choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <p className="text-xs text-slate-text/70 flex-1">{t('message')}</p>
        <div className="flex gap-2">
          <button
            onClick={() => handle('decline')}
            className="px-3 py-1.5 text-xs text-slate-text/60 border border-border rounded hover:bg-slate-bg transition-colors"
          >
            {t('decline')}
          </button>
          <button
            onClick={() => handle('accept')}
            className="px-3 py-1.5 text-xs bg-corp-green text-white rounded hover:bg-corp-green-dark transition-colors"
          >
            {t('accept')}
          </button>
        </div>
      </div>
    </div>
  );
}
