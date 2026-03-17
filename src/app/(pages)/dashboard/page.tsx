'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { BarChart3, FileText, Upload, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface UsageData { tier: string; used: number; limit: number; period: string; }

export default function DashboardPage() {
  const { user } = useAuth();
  const [usage, setUsage] = useState<UsageData | null>(null);
  useEffect(() => { fetch('/api/usage').then(r => r.json()).then(setUsage).catch(() => {}); }, []);
  const tierLabel: Record<string, string> = { FREE: 'Free', STARTER: 'Starter', PROFESSIONAL: 'Professional' };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">Welcome back{user?.name ? `, ${user.name}` : ''}.</p>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#112240] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-green-500/10 rounded-lg"><BarChart3 className="text-green-500" size={20} /></div><h3 className="text-gray-400 text-sm">Plan</h3></div>
          <p className="text-2xl font-bold text-white">{tierLabel[user?.tier || 'FREE'] || user?.tier}</p>
        </div>
        <div className="bg-[#112240] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-emerald-500/10 rounded-lg"><FileText className="text-emerald-400" size={20} /></div><h3 className="text-gray-400 text-sm">Usage</h3></div>
          {usage ? (<><p className="text-2xl font-bold text-white">{usage.used} / {usage.limit === 999999 ? '\u221e' : usage.limit}</p><p className="text-gray-500 text-sm mt-1">declarations this {usage.period}</p><div className="mt-3 bg-[#0a1628] rounded-full h-2 overflow-hidden"><div className="bg-green-500 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (usage.used / (usage.limit === 999999 ? 1 : usage.limit)) * 100)}%` }} /></div></>) : <p className="text-gray-500">Loading...</p>}
        </div>
        <div className="bg-[#112240] rounded-xl p-6 border border-white/10">
          <div className="flex items-center gap-3 mb-4"><div className="p-2 bg-purple-500/10 rounded-lg"><Upload className="text-purple-400" size={20} /></div><h3 className="text-gray-400 text-sm">Quick Actions</h3></div>
          <div className="space-y-3">
            <Link href="/#upload" className="flex items-center justify-between text-white hover:text-green-400 transition-colors text-sm">Upload file <ArrowRight size={16} /></Link>
            <Link href="/history" className="flex items-center justify-between text-white hover:text-green-400 transition-colors text-sm">View history <ArrowRight size={16} /></Link>
            <Link href="/pricing" className="flex items-center justify-between text-white hover:text-green-400 transition-colors text-sm">Upgrade plan <ArrowRight size={16} /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
