import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, Clock, Calendar, ArrowRight, GitBranch } from 'lucide-react';
import { Program } from '../types';

interface ProgramCardProps {
  program: Program;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ program }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="px-3 py-1 bg-brand-50 text-brand-700 text-xs font-extrabold rounded-lg border border-brand-100 uppercase tracking-wider">
            {program.code}
          </span>
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {program.duration_years} Years
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
          {program.name}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-3 mb-6 leading-relaxed">
          {program.description || 'No description provided.'}
        </p>

        {program.specializations && program.specializations.length > 0 && (
          <div className="mb-6 pt-4 border-t border-slate-100">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2 flex items-center gap-1">
              <GitBranch className="w-3 h-3 text-brand-500" /> Specializations ({program.specializations.length})
            </span>
            <div className="flex flex-wrap gap-1.5">
              {program.specializations.map(spec => (
                <span
                  key={spec.id}
                  className="px-2.5 py-0.5 bg-slate-100 text-slate-700 text-[11px] font-medium rounded-md"
                >
                  {spec.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
        <span className="flex items-center gap-1 text-slate-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {program.total_semesters} Semesters
        </span>
        <Link
          to={`/student/curriculum?programId=${program.id}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 group-hover:translate-x-0.5 transition-transform"
        >
          <span>View Program</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
