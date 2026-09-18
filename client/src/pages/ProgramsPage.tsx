import React, { useState, useEffect } from 'react';
import { ProgramCard } from '../components/ProgramCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { api } from '../services/api';
import { Program } from '../types';

export const ProgramsPage: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPrograms = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/programs');
      if (res.data.success) {
        setPrograms(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch academic programs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <div className="space-y-6">
      <Breadcrumbs customItems={[{ label: 'Academic Programs' }]} />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Programs</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Browse official degree programs offered by the School of Computer Applications, complete with duration, semester structure, and available specializations.
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPrograms} />
      ) : programs.length === 0 ? (
        <EmptyState title="No programs available" description="The database currently contains no active academic programs." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((prog) => (
            <ProgramCard key={prog.id} program={prog} />
          ))}
        </div>
      )}
    </div>
  );
};
