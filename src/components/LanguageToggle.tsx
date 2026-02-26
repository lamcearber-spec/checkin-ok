'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { setLocale } from '@/lib/locale';

const locales = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'nl', label: 'NL' },
];

export function LanguageToggle() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSelect = async (code: string) => {
    await setLocale(code);
    setOpen(false);
    window.location.reload();
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-slate-text/70 hover:text-navy border border-border rounded transition-colors"
        aria-label="Language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="text-xs font-medium">EN / FR / NL</span>
      </button>
      {open && (
        <div className="absolute right-0 mt-1 bg-white border border-border rounded shadow-lg z-50 min-w-[80px]">
          {locales.map((l) => (
            <button
              key={l.code}
              onClick={() => handleSelect(l.code)}
              className="block w-full text-left px-3 py-2 text-sm text-slate-text hover:bg-slate-bg transition-colors"
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
