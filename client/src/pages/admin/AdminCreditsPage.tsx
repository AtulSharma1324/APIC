import React, { useState, useEffect } from 'react';
import { CreditCard, Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

interface CreditEntry {
  id: number;
  subject_code: string;
  subject_name: string;
  program_name?: string;
  semester_name?: string;
  credits: number;
  credit_type?: string;
}

export const AdminCreditsPage: React.FC = () => {
  const [credits, setCredits] = useState<CreditEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/subjects');
      if (res.data.success) {
        // Map subjects to credit display
        const mapped = res.data.data.map((s: any) => ({
          id: s.id,
          subject_code: s.code,
          subject_name: s.name,
          program_name: s.program_name,
          semester_name: s.semester_name,
          credits: s.credits ?? s.credit_hours ?? 0,
          credit_type: s.credit_type || 'Theory',
        }));
        setCredits(mapped);
      }
    } catch {
      setError('Could not load credit data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-amber-500" />
            Credits Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            View and manage credit hours assigned to subjects across programs.
          </p>
        </div>
      </div>

      {/* Stats Row */}
      {!isLoading && credits.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Subjects</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{credits.length}</p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Credits</p>
            <p className="text-3xl font-black text-amber-600 mt-1">
              {credits.reduce((sum, c) => sum + (c.credits || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 col-span-2 sm:col-span-1">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Avg. Credits / Subject</p>
            <p className="text-3xl font-black text-brand-600 mt-1">
              {credits.length > 0
                ? (credits.reduce((s, c) => s + (c.credits || 0), 0) / credits.length).toFixed(1)
                : '—'}
            </p>
          </div>
        </div>
      )}

      {/* Credits Table */}
      {isLoading ? (
        <LoadingSkeleton type="table" count={5} />
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6 text-sm font-medium text-center">
          {error}
        </div>
      ) : credits.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-12 text-center">
          <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-500">No subject credits found.</p>
          <p className="text-xs text-slate-400 mt-1">Add subjects first to manage their credits here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                  <th className="py-3 px-4">Subject Code</th>
                  <th className="py-3 px-4">Subject Name</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Program</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Semester</th>
                  <th className="py-3 px-4 text-center">Credits</th>
                  <th className="py-3 px-4 hidden md:table-cell">Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {credits.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-lg border border-brand-100">
                        {c.subject_code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{c.subject_name}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium hidden sm:table-cell">
                      {c.program_name || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium hidden sm:table-cell">
                      {c.semester_name || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber-700 font-black border border-amber-200 text-sm">
                        {c.credits}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 hidden md:table-cell">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                        c.credit_type === 'Lab'
                          ? 'bg-purple-50 text-purple-700 border-purple-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}>
                        {c.credit_type || 'Theory'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
