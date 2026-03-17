'use client';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Lock, Trash2, CreditCard } from 'lucide-react';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault(); setPwError(''); setPwSuccess('');
    if (newPassword.length < 8) { setPwError('New password must be at least 8 characters'); return; }
    setPwLoading(true);
    try {
      const res = await fetch('/api/auth/change-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) });
      const data = await res.json();
      if (res.ok) { setPwSuccess('Password updated successfully'); setCurrentPassword(''); setNewPassword(''); }
      else setPwError(data.error);
    } catch { setPwError('Something went wrong'); }
    setPwLoading(false);
  };
  const handleDeleteAccount = async () => {
    setDeleteError(''); setDeleteLoading(true);
    try {
      const res = await fetch('/api/auth/delete-account', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: deletePassword }) });
      const data = await res.json();
      if (res.ok) { await logout(); router.push('/'); } else setDeleteError(data.error);
    } catch { setDeleteError('Something went wrong'); }
    setDeleteLoading(false);
  };
  const handleBillingPortal = async () => {
    try { const res = await fetch('/api/stripe/portal', { method: 'POST' }); const data = await res.json(); if (data.url) window.location.href = data.url; } catch {}
  };

  const inputClass = "w-full bg-[#0d1f35] border border-white/10 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 text-sm";

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>
      <div className="space-y-8">
        <div className="bg-[#112240] rounded-xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
          <div className="space-y-2 text-sm"><p className="text-gray-400">Email: <span className="text-white">{user?.email}</span></p><p className="text-gray-400">Company: <span className="text-white">{user?.companyName || '\u2014'}</span></p><p className="text-gray-400">Plan: <span className="text-white">{user?.tier}</span></p></div>
        </div>
        {user?.tier && user.tier !== 'FREE' && (
          <div className="bg-[#112240] rounded-xl p-6 border border-white/10">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><CreditCard size={20} /> Billing</h2>
            <button onClick={handleBillingPortal} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">Manage Subscription</button>
          </div>
        )}
        <div className="bg-[#112240] rounded-xl p-6 border border-white/10">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Lock size={20} /> Change Password</h2>
          {pwError && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{pwError}</div>}
          {pwSuccess && <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm">{pwSuccess}</div>}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required placeholder="Current password" className={inputClass} />
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="New password (min. 8 characters)" className={inputClass} />
            <button type="submit" disabled={pwLoading} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">{pwLoading ? 'Updating...' : 'Update Password'}</button>
          </form>
        </div>
        <div className="bg-[#112240] rounded-xl p-6 border border-red-500/20">
          <h2 className="text-lg font-semibold text-red-400 mb-4 flex items-center gap-2"><Trash2 size={20} /> Delete Account</h2>
          <p className="text-gray-400 text-sm mb-4">This will permanently delete your account, all declaration history, and cancel any active subscriptions.</p>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm transition-colors">Delete Account</button>
          ) : (
            <div className="space-y-3">
              {deleteError && <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">{deleteError}</div>}
              <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="Enter your password to confirm" className="w-full bg-[#0d1f35] border border-red-500/20 rounded-lg py-2.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 text-sm" />
              <div className="flex gap-3">
                <button onClick={handleDeleteAccount} disabled={deleteLoading || !deletePassword} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50">{deleteLoading ? 'Deleting...' : 'Confirm Delete'}</button>
                <button onClick={() => { setDeleteConfirm(false); setDeletePassword(''); setDeleteError(''); }} className="bg-[#0a1628] hover:bg-white/5 text-gray-400 px-4 py-2 rounded-lg text-sm transition-colors">Cancel</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
