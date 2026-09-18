import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  FileText, 
  ClipboardCheck, 
  Bot, 
  ArrowRight, 
  GitBranch, 
  Calendar,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Program, Specialization, Subject } from '../types';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [program, setProgram] = useState<Program | null>(null);
  const [specialization, setSpecialization] = useState<Specialization | null>(null);
  const [currentSubjects, setCurrentSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        if (user?.program_id) {
          const progRes = await api.get(`/programs/${user.program_id}`);
          if (progRes.data.success) {
            setProgram(progRes.data.data);
          }
        }
        if (user?.specialization_id) {
          const specRes = await api.get(`/specializations?programId=${user.program_id || ''}`);
          if (specRes.data.success) {
            const foundSpec = specRes.data.data.find((s: Specialization) => s.id === user.specialization_id);
            if (foundSpec) setSpecialization(foundSpec);
          }
        }

        // Fetch subjects for current student's semester or default
        const currentSem = user?.current_semester || 1;
        const subRes = await api.get(`/subjects?semesterId=${currentSem}&specializationId=${user?.specialization_id || ''}`);
        if (subRes.data.success) {
          setCurrentSubjects(subRes.data.data);
        }
      } catch {
        // Silently handled
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (isLoading) {
    return <LoadingSkeleton type="dashboard" />;
  }

  const totalCurrentCredits = currentSubjects.reduce((acc, sub) => acc + Number(sub.credits || 0), 0);

  return (
    <div className="space-y-6">
      <Breadcrumbs customItems={[{ label: 'Student Dashboard' }]} />

      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-sunset-header text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 opacity-15 flex items-center pr-8 pointer-events-none">
          <GraduationCap className="w-64 h-64 text-white" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <span className="px-3 py-1 bg-white/20 text-white text-xs font-black rounded-full border border-white/30 uppercase tracking-wider inline-block mb-3 backdrop-blur-xs">
            Academic Session 2026
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-orange-100 font-medium leading-relaxed">
            Track your semester subjects, download approved syllabus documents, check Continuous Assessment (CA) rules, and query your AI Assistant.
          </p>
        </div>
      </div>

      {/* Overview Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">My Program</span>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-brand-600 shrink-0" />
            <span className="text-sm font-extrabold text-slate-900 truncate">
              {program ? program.code : 'MCA / BCA'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block truncate mt-1">
            {program ? program.name : 'Computer Applications'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">My Specialization</span>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="text-sm font-extrabold text-slate-900 truncate">
              {specialization ? specialization.name : 'AI / Machine Learning'}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block truncate mt-1">
            {specialization ? specialization.code : 'Specialized Track'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Current Semester</span>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-extrabold text-slate-900">
              Semester {user?.current_semester || 2}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block truncate mt-1">
            {program ? `Of ${program.total_semesters} Total Semesters` : 'Active Term'}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Total Semester Credits</span>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 shrink-0" />
            <span className="text-sm font-extrabold text-slate-900">
              {totalCurrentCredits} Credits
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block truncate mt-1">
            Calculated from database
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-orange-100 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Subjects Enrolled</span>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-rose-500 shrink-0" />
            <span className="text-sm font-extrabold text-slate-900">
              {currentSubjects.length} Courses
            </span>
          </div>
          <span className="text-[11px] text-slate-500 block truncate mt-1">
            This Semester
          </span>
        </div>
      </div>

      {/* Quick Academic Access */}
      <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-xs">
        <h3 className="text-xs font-black text-slate-400 mb-4 uppercase tracking-wider">
          Quick Academic Access
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <Link
            to="/student/curriculum"
            className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-brand-600 transition text-center group border border-slate-100"
          >
            <BookOpen className="w-6 h-6 text-brand-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 group-hover:text-brand-700">View Curriculum</span>
          </Link>

          <Link
            to="/student/syllabus"
            className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-brand-600 transition text-center group border border-slate-100"
          >
            <FileText className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 group-hover:text-brand-700">View Syllabus</span>
          </Link>

          <Link
            to="/student/credits"
            className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-brand-600 transition text-center group border border-slate-100"
          >
            <Award className="w-6 h-6 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 group-hover:text-brand-700">Check Credits</span>
          </Link>

          <Link
            to="/student/assessment"
            className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-brand-600 transition text-center group border border-slate-100"
          >
            <ClipboardCheck className="w-6 h-6 text-rose-500 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-slate-800 group-hover:text-brand-700">CA Rules</span>
          </Link>

          <Link
            to="/student/ai-assistant"
            className="flex flex-col items-center justify-center p-4 bg-sunset-header text-white rounded-2xl hover:opacity-95 transition text-center col-span-2 sm:col-span-1 shadow-md shadow-orange-500/20"
          >
            <Bot className="w-6 h-6 text-white mb-2 animate-pulse" />
            <span className="text-xs font-black">Ask AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* My Current Subjects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Current Subjects</h2>
            <p className="text-xs text-slate-500">Official active course units for Semester {user?.current_semester || 2}</p>
          </div>
          <Link
            to="/student/curriculum"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
          >
            <span>Full Matrix</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {currentSubjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentSubjects.map((subject) => (
              <div
                key={subject.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-100">
                      {subject.course_code}
                    </span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {subject.credits} Credits
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">{subject.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2">{subject.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {subject.subject_type}
                  </span>
                  <Link
                    to={`/subjects/${subject.id}`}
                    className="font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                  >
                    <span>View Syllabus & Rules</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No active subjects found for this semester in database.
          </div>
        )}
      </div>
    </div>
  );
};
