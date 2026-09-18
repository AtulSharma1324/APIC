import React, { useState, useEffect } from 'react';
import { Award, Layers, Calendar, BookOpen, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { Subject, Program } from '../types';
import { CreditCard } from '../components/CreditCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const CreditsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/programs').then(res => {
      if (res.data.success) {
        setPrograms(res.data.data);
        if (res.data.data.length > 0) {
          setSelectedProgramId(res.data.data[0].id);
        }
      }
    });
  }, []);

  const fetchCreditsData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const url = selectedProgramId ? `/subjects?programId=${selectedProgramId}` : '/subjects';
      const res = await api.get(url);
      if (res.data.success) {
        setSubjects(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load credit structure.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCreditsData();
  }, [selectedProgramId]);

  const selectedProgram = programs.find(p => p.id === Number(selectedProgramId));

  // Group subjects by semester
  const semesterMap: { [key: string]: { semesterName: string; totalCredits: number; subjects: Subject[] } } = {};

  subjects.forEach(sub => {
    const semName = sub.semester_name || `Semester ${sub.semester_number || 1}`;
    if (!semesterMap[semName]) {
      semesterMap[semName] = { semesterName: semName, totalCredits: 0, subjects: [] };
    }
    semesterMap[semName].subjects.push(sub);
    semesterMap[semName].totalCredits += Number(sub.credits || 0);
  });

  const grandTotalCredits = Object.values(semesterMap).reduce((acc, curr) => acc + curr.totalCredits, 0);

  return (
    <div className="space-y-6">
      <Breadcrumbs customItems={[{ label: 'Credit Information System' }]} />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Credit System</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Understand course credit allocations, semester weightages, and core/elective subject requirements.
          </p>
        </div>

        <div className="shrink-0">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Filter Program</label>
          <select
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value ? Number(e.target.value) : '')}
            className="px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none"
          >
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Credit Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-tr from-amber-600 to-amber-500 text-white p-6 rounded-2xl shadow-md shadow-amber-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">Calculated Program Credits</span>
            <Award className="w-6 h-6 text-white" />
          </div>
          <span className="text-3xl font-black">{grandTotalCredits} Credits</span>
          <p className="text-[11px] text-amber-100 mt-1">Based on database subjects recorded</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Total Semesters</span>
          <span className="text-3xl font-black text-slate-900">
            {selectedProgram ? selectedProgram.total_semesters : Object.keys(semesterMap).length} Terms
          </span>
          <p className="text-[11px] text-slate-500 mt-1">Duration: {selectedProgram ? selectedProgram.duration_years : 2} Years</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">Subject Units</span>
          <span className="text-3xl font-black text-slate-900">{subjects.length} Courses</span>
          <p className="text-[11px] text-slate-500 mt-1">Core & Electives breakdown</p>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="table" count={3} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchCreditsData} />
      ) : (
        <div className="space-y-6">
          {Object.values(semesterMap).map((semGroup, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-600" />
                  <h3 className="text-base font-bold text-slate-900">{semGroup.semesterName}</h3>
                </div>
                <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
                  Semester Credit Total: {semGroup.totalCredits}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {semGroup.subjects.map((sub) => (
                  <CreditCard key={sub.id} subject={sub} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
