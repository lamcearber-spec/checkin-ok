'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { LayoutDashboard, FileCheck, CreditCard, Settings, HelpCircle, ChevronLeft, ChevronRight, ClipboardCheck } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  const t = useTranslations('nav');
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: t('dashboard'), href: '/', active: true },
    { icon: CreditCard, label: t('pricing'), href: '/pricing', active: false },
    { icon: FileCheck, label: t('declarations'), href: '#declarations', active: false },
    { icon: Settings, label: t('settings'), href: '#settings', active: false },
    { icon: HelpCircle, label: t('help'), href: '#help', active: false },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-border h-screen sticky top-0 transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-border">
        <ClipboardCheck className="h-6 w-6 text-corp-green flex-shrink-0" />
        {!collapsed && <span className="font-bold text-navy text-sm tracking-tight">Checkin OK</span>}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isHash = item.href.startsWith('#');
          const Component = isHash ? 'a' : Link;
          return (
            <Component
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
            </Component>
          );
        })}
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
