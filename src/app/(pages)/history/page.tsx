'use client';
import { useState, useEffect } from 'react';
import { FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Declaration { id: string; fileName: string; format: string; recordCount: number; status: string; createdAt: string; }
interface Pagination { page: number; limit: number; total: number; pages: number; }

export default function HistoryPage() {
  const [declarations, setDeclarations] = useState<Declaration[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const t = useTranslations('history');
  const fetchHistory = async (page: number) => {
    setLoading(true);
    try { const res = await fetch(`/api/declarations?page=${page}&limit=20`); if (res.ok) { const data = await res.json(); setDeclarations(data.declarations); setPagination(data.pagination); } } catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { fetchHistory(1); }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Declaration History</h1>
      <p className="text-gray-400 mb-8">{pagination.total} total declarations</p>
      {loading ? <div className="text-gray-400">Loading...</div> : declarations.length === 0 ? (
        <div className="bg-[#112240] rounded-xl p-12 border border-white/10 text-center">
          <FileText size={48} className="text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No declarations yet. Upload an attendance file to get started.</p>
        </div>
      ) : (
        <>
          <div className="bg-[#112240] rounded-xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead><tr className="border-b border-white/10">
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-3">{t('file')}</th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-3">{t('format')}</th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-3">Records</th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-3">{t('status')}</th>
                <th className="text-left text-gray-400 text-sm font-medium px-6 py-3">{t('date')}</th>
              </tr></thead>
              <tbody>{declarations.map(d => (
                <tr key={d.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-6 py-4 text-white text-sm">{d.fileName}</td>
                  <td className="px-6 py-4"><span className="text-xs bg-green-500/10 text-green-400 px-2 py-1 rounded">{d.format}</span></td>
                  <td className="px-6 py-4 text-gray-300 text-sm">{d.recordCount}</td>
                  <td className="px-6 py-4"><span className={`text-xs px-2 py-1 rounded ${d.status === 'SUCCESS' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{d.status}</span></td>
                  <td className="px-6 py-4 text-gray-400 text-sm">{new Date(d.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button onClick={() => fetchHistory(pagination.page - 1)} disabled={pagination.page <= 1} className="p-2 text-gray-400 hover:text-white disabled:opacity-30"><ChevronLeft size={20} /></button>
              <span className="text-gray-400 text-sm">Page {pagination.page} of {pagination.pages}</span>
              <button onClick={() => fetchHistory(pagination.page + 1)} disabled={pagination.page >= pagination.pages} className="p-2 text-gray-400 hover:text-white disabled:opacity-30"><ChevronRight size={20} /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
