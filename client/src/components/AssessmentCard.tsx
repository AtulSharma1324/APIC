import React from 'react';
import { ClipboardCheck, CheckCircle, Info, Percent } from 'lucide-react';
import { CARule } from '../types';

interface AssessmentCardProps {
  caRule: CARule;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ caRule }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-100">
            {caRule.program_code || caRule.program_name || 'Academic Program'}
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-2">
            Continuous Assessment Scheme ({caRule.semester_name || `Semester ${caRule.semester_number}`})
          </h3>
        </div>
        <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-2xl flex items-center justify-center">
          <ClipboardCheck className="w-6 h-6" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total CAs Scheduled</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{caRule.total_ca}</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Mandatory CAs</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{caRule.required_ca}</span>
        </div>

        <div className="bg-brand-50/60 p-4 rounded-xl border border-brand-100 text-center">
          <span className="text-[10px] uppercase font-bold text-brand-700 block">Best-Of Rule</span>
          <span className="text-2xl font-black text-brand-700 mt-1 block">Best {caRule.best_of}</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-xl border border-emerald-100 text-center">
          <span className="text-[10px] uppercase font-bold text-emerald-700 block">Internal Weightage</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">{caRule.weightage_percentage}%</span>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-xs text-slate-700 leading-relaxed">
        <p className="font-semibold text-slate-900 mb-1">Official Rule Description:</p>
        <p className="text-slate-600">{caRule.description || 'Standard institutional continuous evaluation scheme applies.'}</p>
      </div>

      <div className="flex items-center gap-2 text-[11px] text-slate-500 italic pt-2 border-t border-slate-100">
        <Info className="w-3.5 h-3.5 text-brand-500 shrink-0" />
        <span>Assessment information is based on the academic rules maintained by the administrator.</span>
      </div>
    </div>
  );
};
