'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { LayoutDashboard, FileCheck, CreditCard, Settings, ChevronLeft, ChevronRight, ClipboardCheck, LogIn, LogOut, History, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export function Sidebar() {
  const t = useTranslations('nav');
  const [collapsed, setCollapsed] = useState(false);
  const { user, loading, logout } = useAuth();

  const authenticatedItems = [
    { icon: LayoutDashboard, label: t('dashboard'), href: '/dashboard', active: false },
    { icon: History, label: t('declarations'), href: '/history', active: false },
    { icon: CreditCard, label: t('pricing'), href: '/pricing', active: false },
    { icon: Settings, label: t('settings'), href: '/settings', active: false },
  ];

  const unauthenticatedItems = [
    { icon: LayoutDashboard, label: t('dashboard'), href: '/', active: true },
    { icon: CreditCard, label: t('pricing'), href: '/pricing', active: false },
    { icon: UserPlus, label: t('register'), href: '/auth?tab=register', active: false },
    { icon: LogIn, label: t('login'), href: '/auth', active: false },
  ];

  const navItems = user ? authenticatedItems : unauthenticatedItems;

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-border h-screen sticky top-0 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 px-4 h-14 border-b border-border hover:bg-slate-bg transition-colors">
        <ClipboardCheck className="h-6 w-6 text-corp-green flex-shrink-0" />
        {!collapsed && <span className="font-bold text-navy text-sm tracking-tight">Checkin OK</span>}
      </Link>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors ${
              item.active
                ? 'bg-corp-green-light text-corp-green font-medium'
                : 'text-slate-text/70 hover:bg-slate-bg hover:text-navy'
            }`}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}
        {user && (
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 px-3 py-2 rounded text-sm transition-colors text-slate-text/70 hover:bg-slate-bg hover:text-navy w-full text-left"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            {!collapsed && <span>{t('logout')}</span>}
          </button>
        )}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-border text-slate-text/50 hover:text-navy transition-colors"
        aria-label="Toggle sidebar"
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>
    </aside>
  );
}
