import React from 'react';
import { AIChat } from '../components/AIChat';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Bot, ShieldCheck, Database, Info } from 'lucide-react';

export const AIAssistantPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Breadcrumbs customItems={[{ label: 'AI Academic Assistant' }]} />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-black rounded-lg border border-purple-200 uppercase tracking-wider flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-purple-600" /> Grounded Gemini AI Engine
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">AI Academic Assistant</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
            Get instant, grounded answers regarding degree programs, course codes, credits, syllabus files, and continuous assessment rules.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1 shrink-0">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Anti-Hallucination Policy</span>
          </div>
          <p className="text-[11px] text-slate-500 max-w-xs">
            Answers are generated strictly from the official PostgreSQL database. Unindexed facts are declared unavailable.
          </p>
        </div>
      </div>

      <AIChat />
    </div>
  );
};
