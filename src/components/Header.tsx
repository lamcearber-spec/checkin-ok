'use client';

import { ClipboardCheck } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-2 lg:hidden">
        <ClipboardCheck className="h-5 w-5 text-corp-green" />
        <span className="font-bold text-navy text-sm">Checkin OK</span>
      </div>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-3">
        <LanguageToggle />
      </div>
    </header>
  );
}
