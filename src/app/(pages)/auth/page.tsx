'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { Mail, Lock, User, Building2, Eye, EyeOff, ArrowLeft } from 'lucide-react';

type Tab = 'login' | 'register' | 'forgot' | 'reset';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, login, register } = useAuth();
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

  const inputClass = "w-full bg-[#0d1f35] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-[#112240] rounded-2xl p-8 shadow-xl border border-white/10">
          {tab !== 'forgot' && tab !== 'reset' && (
            <div className="flex mb-8 bg-[#0a1628] rounded-lg p-1">
              <button onClick={() => { setTab('login'); setError(''); }} className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${tab === 'login' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>Login</button>
              <button onClick={() => { setTab('register'); setError(''); }} className={`flex-1 py-2.5 rounded-md text-sm font-medium transition-all ${tab === 'register' ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white'}`}>Register</button>
            </div>
          )}
          {(tab === 'forgot' || tab === 'reset') && (
            <button onClick={() => setTab('login')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm"><ArrowLeft size={16} /> Back to login</button>
          )}
          {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">{success}</div>}

          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1.5">Email</label><div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" /></div></div>
              <div><label className="block text-sm text-gray-400 mb-1.5">Password</label><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className={inputClass + " pr-10"} placeholder="••••••••" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
              <button type="button" onClick={() => { setTab('forgot'); setError(''); setSuccess(''); }} className="text-sm text-green-500 hover:underline">Forgot password?</button>
              <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">{loading ? 'Signing in...' : 'Sign In'}</button>
            </form>
          )}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div><label className="block text-sm text-gray-400 mb-1.5">Name (optional)</label><div className="relative"><User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} placeholder="Your name" /></div></div>
              <div><label className="block text-sm text-gray-400 mb-1.5">Company (optional)</label><div className="relative"><Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className={inputClass} placeholder="Company name" /></div></div>
              <div><label className="block text-sm text-gray-400 mb-1.5">Email</label><div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" /></div></div>
              <div><label className="block text-sm text-gray-400 mb-1.5">Password</label><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required className={inputClass} placeholder="Min. 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">{loading ? 'Creating account...' : 'Create Account'}</button>
            </form>
          )}
          {tab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-2">Reset Password</h2>
              <p className="text-gray-400 text-sm mb-4">Enter your email and we&apos;ll send a reset link.</p>
              <div><div className="relative"><Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className={inputClass} placeholder="you@example.com" /></div></div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </form>
          )}
          {tab === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-2">Set New Password</h2>
              <div><div className="relative"><Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" /><input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)} required className={inputClass} placeholder="Min. 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
              <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50">{loading ? 'Updating...' : 'Update Password'}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
