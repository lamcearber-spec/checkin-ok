'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ChevronDown, LayoutDashboard, Settings, LogOut, User, Menu, X } from 'lucide-react';
import { LanguageToggle } from './LanguageToggle';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export function Header() {
  const t = useTranslations('nav');
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header ref={headerRef} className="border-b border-[#e5e7eb] bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-[#4F6BF6] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">CO</span>
            </div>
            <span className="text-xl font-bold text-[#1a1a1a]">
              Checkin OK
            </span>
          </Link>

          {/* Desktop actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <Link
                href="/dashboard"
                className="hidden sm:flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-[#4F6BF6] bg-[#4F6BF6] hover:bg-[#3D5BD9] text-white transition-colors"
              >
                {t('dashboard')}
              </Link>
            )}
            <Link
              href="/pricing"
              className="hidden sm:flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
            >
              {t('pricing')}
            </Link>
            <a
              href="/#faq"
              className="hidden sm:flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
            >
              FAQ
            </a>
            <Link
              href="/blog"
              className="hidden sm:flex items-center px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
            >
              Blog
            </Link>
            <LanguageToggle />

            {/* Auth section */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-[#4F6BF6] rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.name?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user.name || user.email}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        {t('dashboard')}
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4" />
                        {t('settings')}
                      </Link>
                      <button
                        onClick={() => { setShowUserMenu(false); logout(); }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/auth"
                  className="px-3 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 text-gray-700 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/auth?tab=register"
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-[#4F6BF6] text-white hover:bg-[#3D5BD9] transition-colors"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileMenuOpen && (
        <nav className="sm:hidden border-t border-gray-200 bg-white px-4 py-3 space-y-1">
          <Link
            href="/pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            {t('pricing')}
          </Link>
          <a
            href="/#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            FAQ
          </a>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Blog
          </Link>
          {!user && (
            <div className="pt-2 border-t border-gray-200 mt-2 space-y-1">
              <Link
                href="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {t('login')}
              </Link>
              <Link
                href="/auth?tab=register"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 text-sm font-medium text-[#4F6BF6] hover:bg-gray-50 rounded-lg transition-colors"
              >
                {t('register')}
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
