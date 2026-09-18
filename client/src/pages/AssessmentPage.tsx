import React, { useState, useEffect } from 'react';
import { AssessmentCard } from '../components/AssessmentCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { api } from '../services/api';
import { CARule, Program } from '../types';
import { ClipboardCheck, Layers } from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const [caRules, setCARules] = useState<CARule[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/programs').then(res => {
      if (res.data.success) {
        setPrograms(res.data.data);
      }
    });
  }, []);

  const fetchCARules = async () => {
    setIsLoading(true);
    setError('');
    try {
      const url = selectedProgramId ? `/ca-rules?programId=${selectedProgramId}` : '/ca-rules';
      const res = await api.get(url);
      if (res.data.success) {
        setCARules(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch Continuous Assessment rules.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCARules();
  }, [selectedProgramId]);

  return (
    <div className="space-y-6">
      <Breadcrumbs customItems={[{ label: 'CA & Assessment Rules' }]} />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Continuous Assessment (CA) Policies
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Official internal evaluation guidelines, Best-of-N scoring policies, mandatory test counts, and weightage percentages configured by the academic administration.
          </p>
        </div>

        <div className="shrink-0">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Select Program</label>
          <select
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value ? Number(e.target.value) : '')}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
          >
            <option value="">-- All Programs --</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={2} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCARules} />
      ) : caRules.length === 0 ? (
        <EmptyState
          title="No CA Rules Configured"
          description="The administrator has not configured Continuous Assessment rules for this selection yet."
        />
      ) : (
        <div className="space-y-6">
          {caRules.map((ca) => (
            <AssessmentCard key={ca.id} caRule={ca} />
          ))}
        </div>
      )}
    </div>
  );
};
