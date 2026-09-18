import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Layers, BookOpen, FileText, ArrowRight, Award } from 'lucide-react';
import { api } from '../services/api';
import { ProgramCard } from '../components/ProgramCard';
import { SyllabusCard } from '../components/SyllabusCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [activeTab, setActiveTab] = useState<'all' | 'programs' | 'subjects' | 'syllabus'>('all');

  const [results, setResults] = useState<{
    programs: any[];
    specializations: any[];
    subjects: any[];
    syllabus: any[];
    caRules: any[];
  }>({
    programs: [],
    specializations: [],
    subjects: [],
    syllabus: [],
    caRules: []
  });

  const [isLoading, setIsLoading] = useState(false);

  const executeSearch = async (q: string) => {
    if (!q.trim()) return;
    setIsLoading(true);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(q)}`);
      if (res.data.success) {
        setResults(res.data.data);
      }
    } catch {
      // Silently handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setSearchQuery(queryParam);
    if (queryParam) {
      executeSearch(queryParam);
    }
  }, [queryParam]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs customItems={[{ label: 'Global Academic Search' }]} />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Global Academic Search</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Instant multi-table search across Programs, Specializations, Subjects, Course Codes, and Syllabus files.
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Try searching 'MCA201', 'Data Structures', 'AI/ML', 'Semester 2'..."
            className="w-full pl-10 pr-24 py-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none transition-all"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 bottom-2 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-lg transition"
          >
            Search
          </button>
        </form>

        {queryParam && (
          <div className="flex items-center gap-2 border-t border-slate-100 pt-4 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${activeTab === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              All Results ({results.programs.length + results.subjects.length + results.syllabus.length})
            </button>
            <button
              onClick={() => setActiveTab('programs')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${activeTab === 'programs' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Programs ({results.programs.length})
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${activeTab === 'subjects' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Subjects ({results.subjects.length})
            </button>
            <button
              onClick={() => setActiveTab('syllabus')}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${activeTab === 'syllabus' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              Syllabus ({results.syllabus.length})
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : !queryParam ? (
        <EmptyState
          title="Start Academic Search"
          description="Type a course code (e.g. MCA201), subject name, or specialization in the search bar above."
          icon={<Search className="w-8 h-8 text-brand-500" />}
        />
      ) : (
        <div className="space-y-8">
          
          {/* Programs Section */}
          {(activeTab === 'all' || activeTab === 'programs') && results.programs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-600" />
                <span>Matching Programs ({results.programs.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.programs.map((p) => (
                  <ProgramCard key={p.id} program={p} />
                ))}
              </div>
            </div>
          )}

          {/* Subjects Section */}
          {(activeTab === 'all' || activeTab === 'subjects') && results.subjects.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Matching Subjects ({results.subjects.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.subjects.map((sub) => (
                  <div key={sub.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-extrabold text-brand-700">{sub.course_code}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
                          {sub.subject_type}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{sub.name}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{sub.description}</p>
                    </div>
                    <Link
                      to={`/subjects/${sub.id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 shrink-0 ml-4"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Syllabus Section */}
          {(activeTab === 'all' || activeTab === 'syllabus') && results.syllabus.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                <span>Matching Syllabus Files ({results.syllabus.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.syllabus.map((syl) => (
                  <SyllabusCard key={syl.id} syllabus={syl} />
                ))}
              </div>
            </div>
          )}

          {results.programs.length === 0 && results.subjects.length === 0 && results.syllabus.length === 0 && (
            <EmptyState
              title={`No results found for "${queryParam}"`}
              description="Check your spelling or try searching for a broader term like 'MCA' or 'Data'."
            />
          )}

        </div>
      )}
    </div>
  );
};
