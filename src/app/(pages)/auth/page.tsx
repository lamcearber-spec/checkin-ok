'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Mail, Lock, User, Building2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

type Tab = 'login' | 'register' | 'forgot' | 'reset';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register } = useAuth();
  const t = useTranslations('auth');
  const resetToken = searchParams.get('reset');
  const [tab, setTab] = useState<Tab>(resetToken ? 'reset' : 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [agbAccepted, setAgbAccepted] = useState(false);

  useEffect(() => { if (user) router.push('/'); }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    const result = await login(email, password);
    if (result.error) setError(result.error); else router.push('/');
    setLoading(false);
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    const result = await register(email, password, name, companyName);
    if (result.error) setError(result.error); else router.push('/');
    setLoading(false);
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (res.ok) setSuccess('If an account exists, a reset link has been sent to your email.');
      else { const data = await res.json(); setError(data.error); }
    } catch { setError('Something went wrong'); }
    setLoading(false);
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: resetToken, newPassword }) });
      const data = await res.json();
      if (res.ok) { setSuccess('Password updated! You can now log in.'); setTab('login'); }
      else setError(data.error);
    } catch { setError('Something went wrong'); }
    setLoading(false);
  };

  const inputClass = "w-full bg-white border border-gray-300 rounded-lg py-2.5 pl-10 pr-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BF6] focus:border-transparent text-sm";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-[#4F6BF6] rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">CO</span>
            </div>
            <span className="text-2xl font-bold text-[#1a1a1a]">Checkin OK</span>
          </Link>
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          {tab !== 'forgot' && tab !== 'reset' && (
            <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
              <button onClick={() => { setTab('login'); setError(''); }} className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${tab === 'login' ? 'bg-[#4F6BF6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Login</button>
              <button onClick={() => { setTab('register'); setError(''); }} className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${tab === 'register' ? 'bg-[#4F6BF6] text-white shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>Register</button>
            </div>
          )}
          {(tab === 'forgot' || tab === 'reset') && (
            <button onClick={() => setTab('login')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 text-sm"><ArrowLeft size={16} /> Back to login</button>
          )}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{success}</div>}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div><label className="block text-sm text-gray-700 font-medium mb-1.5">Email</label><div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" /></div></div>
              <div><label className="block text-sm text-gray-700 font-medium mb-1.5">Password</label><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className={inputClass + " pr-10"} placeholder="••••••••" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
              <button type="button" onClick={() => { setTab('forgot'); setError(''); setSuccess(''); }} className="text-sm text-[#4F6BF6] hover:underline">Forgot password?</button>
              <button type="submit" disabled={loading} className="w-full bg-[#4F6BF6] hover:bg-[#3D5BD9] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">{loading ? 'Signing in...' : 'Sign In'}</button>
            </form>
          )}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div><label className="block text-sm text-gray-700 font-medium mb-1.5">Name (optional)</label><div className="relative"><User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Your name" /></div></div>
              <div><label className="block text-sm text-gray-700 font-medium mb-1.5">Company (optional)</label><div className="relative"><Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputClass} placeholder="Company name" /></div></div>
              <div><label className="block text-sm text-gray-700 font-medium mb-1.5">Email</label><div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" /></div></div>
              <div><label className="block text-sm text-gray-700 font-medium mb-1.5">Password</label><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className={inputClass} placeholder="Min. 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
              <button type="submit" disabled={loading} className="w-full bg-[#4F6BF6] hover:bg-[#3D5BD9] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">{loading ? 'Creating account...' : 'Create Account'}</button>
            </form>
          )}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Reset Password</h2>
              <p className="text-gray-500 text-sm mb-4">Enter your email and we&apos;ll send a reset link.</p>
              <div><div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" /></div></div>
              <button type="submit" disabled={loading} className="w-full bg-[#4F6BF6] hover:bg-[#3D5BD9] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </form>
          )}
          {tab === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Set New Password</h2>
              <div><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} required className={inputClass} placeholder="Min. 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
                          <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={agbAccepted}
                onChange={(e) => setAgbAccepted(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-[#4F6BF6] focus:ring-[#4F6BF6]"
              />
              <span>
                {t('agbAccept')}{' '}
                <Link href="/terms" className="text-[#4F6BF6] hover:underline">{t('agbLink')}</Link>
              </span>
            </label>
            <button type="submit" disabled={loading} className="w-full bg-[#4F6BF6] hover:bg-[#3D5BD9] text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">{loading ? 'Updating...' : 'Update Password'}</button>
            </form>
          )}
        </div>

        {/* Legal links footer */}
        <div className="text-center mt-6 space-x-4">
          <Link href="/privacy" className="text-xs text-gray-400 hover:text-gray-600">Privacy</Link>
          <Link href="/terms" className="text-xs text-gray-400 hover:text-gray-600">Terms</Link>
          <Link href="/impressum" className="text-xs text-gray-400 hover:text-gray-600">Impressum</Link>
        </div>
      </div>
    </div>
  );
}
