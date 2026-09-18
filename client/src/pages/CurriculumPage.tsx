import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SubjectTable } from '../components/SubjectTable';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { api } from '../services/api';
import { Program, Specialization, Semester, Subject } from '../types';
import { Filter, Layers, GitBranch, Calendar } from 'lucide-react';

export const CurriculumPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [programs, setPrograms] = useState<Program[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);

  const [selectedProgramId, setSelectedProgramId] = useState<number | ''>(
    searchParams.get('programId') ? Number(searchParams.get('programId')) : ''
  );
  const [selectedSpecId, setSelectedSpecId] = useState<number | ''>(
    searchParams.get('specId') ? Number(searchParams.get('specId')) : ''
  );
  const [selectedSemId, setSelectedSemId] = useState<number | ''>(
    searchParams.get('semId') ? Number(searchParams.get('semId')) : ''
  );

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Initial load programs
  useEffect(() => {
    api.get('/programs').then(res => {
      if (res.data.success) setPrograms(res.data.data);
    }).catch(() => {});
  }, []);

  // When Program changes, load specializations & semesters
  useEffect(() => {
    if (selectedProgramId) {
      api.get(`/specializations?programId=${selectedProgramId}`).then(res => {
        if (res.data.success) setSpecializations(res.data.data);
      });
      api.get(`/semesters?programId=${selectedProgramId}`).then(res => {
        if (res.data.success) setSemesters(res.data.data);
      });
    } else {
      setSpecializations([]);
      setSemesters([]);
    }
  }, [selectedProgramId]);

  // Fetch subjects based on selected filters
  const fetchSubjects = async () => {
    setIsLoading(true);
    setError('');
    try {
      let query = '/subjects?';
      if (selectedProgramId) query += `programId=${selectedProgramId}&`;
      if (selectedSpecId) query += `specializationId=${selectedSpecId}&`;
      if (selectedSemId) query += `semesterId=${selectedSemId}&`;

      const res = await api.get(query);
      if (res.data.success) {
        setSubjects(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch curriculum subjects.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [selectedProgramId, selectedSpecId, selectedSemId]);

  return (
    <div className="space-y-6">
      <Breadcrumbs customItems={[{ label: 'Curriculum & Courses' }]} />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Academic Curriculum Matrix</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Select your Program, Specialization, and Semester to view official course codes, subject types, credit weights, and downloadable syllabus files.
        </p>

        {/* Filter Controls Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Program Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-brand-600" />
              <span>Program</span>
            </label>
            <select
              value={selectedProgramId}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : '';
                setSelectedProgramId(val);
                setSelectedSpecId('');
                setSelectedSemId('');
              }}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none transition-all text-slate-900 font-semibold"
            >
              <option value="">-- All Programs --</option>
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} - {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specialization Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
              <span>Specialization Track</span>
            </label>
            <select
              value={selectedSpecId}
              onChange={(e) => setSelectedSpecId(e.target.value ? Number(e.target.value) : '')}
              disabled={!selectedProgramId}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none transition-all text-slate-900 font-semibold disabled:opacity-50"
            >
              <option value="">-- All Specializations --</option>
              {specializations.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Semester Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Semester</span>
            </label>
            <select
              value={selectedSemId}
              onChange={(e) => setSelectedSemId(e.target.value ? Number(e.target.value) : '')}
              disabled={!selectedProgramId}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none transition-all text-slate-900 font-semibold disabled:opacity-50"
            >
              <option value="">-- All Semesters --</option>
              {semesters.map((sem) => (
                <option key={sem.id} value={sem.id}>
                  {sem.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="table" count={4} />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSubjects} />
      ) : (
        <SubjectTable subjects={subjects} />
      )}
    </div>
  );
};
