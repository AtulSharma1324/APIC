import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  GitBranch, 
  BookOpen, 
  FileText, 
  Users, 
  Plus, 
  ArrowRight, 
  ShieldCheck,
  Clock,
  Award
} from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { ErrorState } from '../../components/ErrorState';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<{
    stats: {
      totalPrograms: number;
      totalSpecializations: number;
      totalSubjects: number;
      totalSyllabus: number;
      totalStudents: number;
    };
    recentSubjects: any[];
    recentSyllabus: any[];
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch admin stats');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (isLoading) return <LoadingSkeleton type="dashboard" />;
  if (error || !data) return <ErrorState message={error || 'Failed to load dashboard statistics'} onRetry={fetchStats} />;

  const { stats, recentSubjects, recentSyllabus } = data;

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-md border border-amber-500/30 uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Institutional Control Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">System Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage degree programs, subjects, credit schemes, syllabus uploads, and CA evaluation rules.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/admin/subjects"
            className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-amber-400/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add Subject</span>
          </Link>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Link to="/admin/programs" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Programs</span>
            <Layers className="w-5 h-5 text-brand-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black text-slate-900">{stats.totalPrograms}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Degree Offerings</span>
        </Link>

        <Link to="/admin/specializations" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Specializations</span>
            <GitBranch className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black text-slate-900">{stats.totalSpecializations}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Domain Tracks</span>
        </Link>

        <Link to="/admin/subjects" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Subjects</span>
            <BookOpen className="w-5 h-5 text-purple-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black text-slate-900">{stats.totalSubjects}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Course Catalog</span>
        </Link>

        <Link to="/admin/syllabus" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Syllabus PDFs</span>
            <FileText className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black text-slate-900">{stats.totalSyllabus}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Uploaded Files</span>
        </Link>

        <Link to="/admin/users" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-amber-400 transition group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Enrolled Students</span>
            <Users className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <span className="text-2xl font-black text-slate-900">{stats.totalStudents}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Registered Accounts</span>
        </Link>
      </div>

      {/* Recent Updates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recently Added Subjects */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <span>Recently Created Subjects</span>
            </h3>
            <Link to="/admin/subjects" className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1">
              <span>Manage All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentSubjects.length > 0 ? (
              recentSubjects.map((sub) => (
                <div key={sub.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-brand-700 mr-2">{sub.course_code}</span>
                    <span className="font-bold text-slate-800">{sub.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {sub.credits} Credits
                  </span>
                </div>
              ))
            ) : (
              <div className="py-4 text-xs text-slate-400 text-center italic">No subjects added yet.</div>
            )}
          </div>
        </div>

        {/* Recently Uploaded Syllabus */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>Recently Uploaded Syllabus Documents</span>
            </h3>
            <Link to="/admin/syllabus" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
              <span>Manage All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentSyllabus.length > 0 ? (
              recentSyllabus.map((syl) => (
                <div key={syl.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-emerald-700 mr-2">v{syl.version}</span>
                    <span className="font-bold text-slate-800">{syl.file_name}</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {syl.course_code || `Subject #${syl.subject_id}`}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-4 text-xs text-slate-400 text-center italic">No syllabus uploaded yet.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
