import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  FileText, 
  Download, 
  ClipboardCheck, 
  Layers, 
  GitBranch, 
  Calendar,
  ExternalLink,
  ArrowLeft
} from 'lucide-react';
import { api } from '../services/api';
import { Subject } from '../types';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorState } from '../components/ErrorState';
import { Breadcrumbs } from '../components/Breadcrumbs';

export const SubjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubject = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await api.get(`/subjects/${id}`);
        if (res.data.success) {
          setSubject(res.data.data);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Subject information not found.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubject();
  }, [id]);

  if (isLoading) return <LoadingSkeleton type="dashboard" />;
  if (error || !subject) return <ErrorState message={error || 'Subject not found.'} />;

  return (
    <div className="space-y-6">
      <Breadcrumbs
        customItems={[
          { label: 'Curriculum', path: '/student/curriculum' },
          { label: `${subject.course_code} - ${subject.name}` }
        ]}
      />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        
        {/* Subject Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-black rounded-lg border border-brand-100">
                {subject.course_code}
              </span>
              <span className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-xs font-bold rounded">
                {subject.subject_type}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {subject.name}
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-amber-50 text-amber-800 px-4 py-3 rounded-2xl border border-amber-200 shrink-0">
            <Award className="w-6 h-6 text-amber-500" />
            <div>
              <span className="text-xl font-black block leading-none">{subject.credits}</span>
              <span className="text-[10px] uppercase font-bold text-amber-700">Course Credits</span>
            </div>
          </div>
        </div>

        {/* Hierarchy Context */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
          <div className="flex items-center gap-2.5">
            <Layers className="w-4 h-4 text-brand-600 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Program</span>
              <span className="font-bold text-slate-800">{subject.program_name || 'School of Computer Applications'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <GitBranch className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Specialization</span>
              <span className="font-bold text-slate-800">{subject.specialization_name || 'General Track'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Semester Term</span>
              <span className="font-bold text-slate-800">{subject.semester_name || `Semester ${subject.semester_number}`}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">Course Overview</h3>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
            {subject.description || 'Detailed course overview maintained in the university academic repository.'}
          </p>
        </div>

        {/* Syllabus Section */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-600" />
            <span>Syllabus Document</span>
          </h3>

          {subject.syllabus ? (
            <div className="bg-brand-50/50 p-5 rounded-2xl border border-brand-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded uppercase">
                  Version {subject.syllabus.version}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mt-1">{subject.syllabus.file_name}</h4>
                <p className="text-xs text-slate-600 mt-0.5">{subject.syllabus.description}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={subject.syllabus.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
              No official syllabus PDF has been uploaded for this subject yet.
            </div>
          )}
        </div>

        {/* Assessment & CA Rules Section */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-rose-600" />
            <span>Continuous Assessment (CA) & Evaluation Scheme</span>
          </h3>

          {subject.caRule ? (
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Total CAs</span>
                  <span className="text-lg font-black text-slate-900">{subject.caRule.total_ca}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Required CAs</span>
                  <span className="text-lg font-black text-slate-900">{subject.caRule.required_ca}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-brand-600 block">Best Of</span>
                  <span className="text-lg font-black text-brand-700">Best {subject.caRule.best_of}</span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">Weightage</span>
                  <span className="text-lg font-black text-emerald-700">{subject.caRule.weightage_percentage}%</span>
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed pt-2">
                {subject.caRule.description}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 italic">
              Assessment information is based on the default academic rules maintained by the administrator.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
