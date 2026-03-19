'use client';
import { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { Lock, Trash2, CreditCard } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const t = useTranslations('settings');
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

  const inputClass = "w-full bg-white border border-gray-300 rounded-lg py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F6BF6] focus:border-transparent text-sm";

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">{t('title')}</h1>
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('account')}</h2>
            <div className="space-y-2 text-sm">
              <p className="text-gray-500">{t('email')}: <span className="text-gray-900 font-medium">{user?.email}</span></p>
              <p className="text-gray-500">Company: <span className="text-gray-900 font-medium">{user?.companyName || '\u2014'}</span></p>
              <p className="text-gray-500">{t('plan')}: <span className="text-gray-900 font-medium">{user?.tier}</span></p>
            </div>
          </div>
          {user?.tier && user.tier !== 'FREE' && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><CreditCard size={20} /> Billing</h2>
              <button onClick={handleBillingPortal} className="bg-[#4F6BF6] hover:bg-[#3D5BD9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Manage Subscription</button>
            </div>
          )}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Lock size={20} /> {t('changePassword')}</h2>
            {pwError && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{pwError}</div>}
            {pwSuccess && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">{pwSuccess}</div>}
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required placeholder="Current password" className={inputClass} />
              <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required placeholder="New password (min. 8 characters)" className={inputClass} />
              <button type="submit" disabled={pwLoading} className="bg-[#4F6BF6] hover:bg-[#3D5BD9] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">{pwLoading ? 'Updating...' : 'Update Password'}</button>
            </form>
          </div>
          <div className="bg-white rounded-xl p-6 border border-red-200 shadow-sm">
            <h2 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2"><Trash2 size={20} /> {t('deleteAccount')}</h2>
            <p className="text-gray-500 text-sm mb-4">This will permanently delete your account, all declaration history, and cancel any active subscriptions.</p>
            {!deleteConfirm ? (
              <button onClick={() => setDeleteConfirm(true)} className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Delete Account</button>
            ) : (
              <div className="space-y-3">
                {deleteError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{deleteError}</div>}
                <input type="password" value={deletePassword} onChange={e => setDeletePassword(e.target.value)} placeholder="Enter your password to confirm" className="w-full bg-white border border-red-300 rounded-lg py-2.5 px-4 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm" />
                <div className="flex gap-3">
                  <button onClick={handleDeleteAccount} disabled={deleteLoading || !deletePassword} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50">{deleteLoading ? 'Deleting...' : 'Confirm Delete'}</button>
                  <button onClick={() => { setDeleteConfirm(false); setDeletePassword(''); setDeleteError(''); }} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
