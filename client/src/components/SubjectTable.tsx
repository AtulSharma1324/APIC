import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ExternalLink, Award, Download } from 'lucide-react';
import { Subject } from '../types';

interface SubjectTableProps {
  subjects: Subject[];
  onSelectSyllabus?: (subject: Subject) => void;
}

export const SubjectTable: React.FC<SubjectTableProps> = ({ subjects, onSelectSyllabus }) => {
  if (subjects.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs font-medium">
        No subjects found for this semester or filters.
      </div>
    );
  }

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'Core':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Elective':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Lab':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Project':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Course Code</th>
              <th className="py-3.5 px-4">Subject Name</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4 text-center">Credits</th>
              <th className="py-3.5 px-4">Semester</th>
              <th className="py-3.5 px-4 text-center">Syllabus</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {subjects.map((sub) => (
              <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4 font-extrabold text-brand-700">
                  {sub.course_code}
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                  <div>{sub.name}</div>
                  <div className="text-[11px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                    {sub.description}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-md border ${getTypeBadgeClass(sub.subject_type)}`}>
                    {sub.subject_type}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-flex items-center gap-1 font-bold text-slate-800 bg-amber-50 text-amber-800 px-2 py-0.5 rounded-md border border-amber-200/60">
                    <Award className="w-3 h-3 text-amber-500" />
                    {sub.credits}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-medium text-slate-600">
                  {sub.semester_name || `Semester ${sub.semester_number || 1}`}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {sub.syllabus_url ? (
                    <a
                      href={sub.syllabus_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-200 rounded-lg hover:bg-brand-100 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>View Syllabus</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Pending</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <Link
                    to={`/subjects/${sub.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-brand-600 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition"
                  >
                    <span>Details</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
