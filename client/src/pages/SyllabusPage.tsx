import React, { useState, useEffect } from 'react';
import { SyllabusCard } from '../components/SyllabusCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { api } from '../services/api';
import { Syllabus } from '../types';
import { Search, FileText } from 'lucide-react';

export const SyllabusPage: React.FC = () => {
  const [syllabusList, setSyllabusList] = useState<Syllabus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSyllabus = async (query = '') => {
    setIsLoading(true);
    setError('');
    try {
      const url = query ? `/syllabus?q=${encodeURIComponent(query)}` : '/syllabus';
      const res = await api.get(url);
      if (res.data.success) {
        setSyllabusList(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch syllabus documents.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabus();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSyllabus(searchQuery);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs customItems={[{ label: 'Syllabus Repository' }]} />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Official Syllabus Repository</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Search, view, and download approved PDF syllabus files uploaded by institutional administrators.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search syllabus by course code (e.g. MCA101) or subject name..."
            className="w-full pl-10 pr-24 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg transition"
          >
            Search
          </button>
        </form>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => fetchSyllabus(searchQuery)} />
      ) : syllabusList.length === 0 ? (
        <EmptyState
          title="No Syllabus Documents Found"
          description="No syllabus records match your search criteria in the academic database."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {syllabusList.map((syl) => (
            <SyllabusCard key={syl.id} syllabus={syl} />
          ))}
        </div>
      )}
    </div>
  );
};
