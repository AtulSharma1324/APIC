import React from 'react';
import { FileText, Download, ExternalLink, Calendar, Tag } from 'lucide-react';
import { Syllabus } from '../types';

interface SyllabusCardProps {
  syllabus: Syllabus;
}

export const SyllabusCard: React.FC<SyllabusCardProps> = ({ syllabus }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-black rounded-md border border-brand-100">
            {syllabus.course_code || `Subject #${syllabus.subject_id}`}
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            v{syllabus.version}
          </span>
        </div>

        <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
          {syllabus.file_name}
        </h4>

        {syllabus.subject_name && (
          <p className="text-xs font-semibold text-slate-700 mb-2">
            Course: {syllabus.subject_name}
          </p>
        )}

        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
          {syllabus.description || 'Official syllabus document containing unit-wise topics and reading material.'}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <Calendar className="w-3 h-3 text-slate-400" />
          {syllabus.uploaded_at ? new Date(syllabus.uploaded_at).toLocaleDateString() : 'Active Document'}
        </span>

        <div className="flex items-center gap-2">
          <a
            href={syllabus.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-white bg-brand-600 rounded-xl hover:bg-brand-700 transition shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        </div>
      </div>
    </div>
  );
};
