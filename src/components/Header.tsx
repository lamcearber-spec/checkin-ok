'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ClipboardCheck, Menu, X } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import Link from 'next/link';

export function Header() {
  const t = useTranslations('nav');
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const navLinks = [
    { label: t('home'), href: '/' },
    { label: t('pricing'), href: '/pricing' },
    { label: t('contact'), href: '/contact' },
    { label: t('blog'), href: '/blog' },
  ];

  return (
    <header ref={menuRef} className="bg-white border-b border-border sticky top-0 z-30">
      <div className="h-14 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2 lg:hidden">
          <ClipboardCheck className="h-5 w-5 text-corp-green" />
          <span className="font-bold text-navy text-sm">Checkin OK</span>
        </div>
        <div className="hidden lg:block" />
        <div className="flex items-center gap-3">
          <LanguageToggle />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden p-1.5 text-slate-text/70 hover:text-navy border border-border rounded transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down nav */}
      {menuOpen && (
        <nav className="lg:hidden border-t border-border bg-white px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2.5 text-sm text-slate-text/70 hover:text-navy hover:bg-slate-bg rounded transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-border mt-2">
            <LanguageToggle />
          </div>
        </nav>
      )}
    </header>
  );
}
