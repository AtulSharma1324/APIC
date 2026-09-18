import React from 'react';
import { Award, BookOpen, Layers } from 'lucide-react';
import { Subject } from '../types';

interface CreditCardProps {
  subject: Subject;
}

export const CreditCard: React.FC<CreditCardProps> = ({ subject }) => {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-brand-300 transition-all flex items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-extrabold text-brand-700">{subject.course_code}</span>
          <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-medium">
            {subject.subject_type}
          </span>
        </div>
        <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{subject.name}</h4>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {subject.semester_name || `Semester ${subject.semester_number || 1}`}
        </p>
      </div>

      <div className="flex flex-col items-end shrink-0">
        <div className="flex items-center gap-1 text-base font-black text-amber-600 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
          <Award className="w-4 h-4 text-amber-500" />
          <span>{subject.credits} Credits</span>
        </div>
      </div>
    </div>
  );
};
