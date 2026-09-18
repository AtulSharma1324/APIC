import React, { useState, useEffect } from 'react';
import { BrainCircuit, Database, FileText, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const AdminAIKnowledgePage: React.FC = () => {
  const [data, setData] = useState<{
    documents: any[];
    indexedSyllabus: any[];
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchKnowledge = async () => {
    setIsLoading(true);
    try {
      const res = await api.get('/admin/ai-knowledge');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch {
      // Silently handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  if (isLoading) return <LoadingSkeleton type="dashboard" />;

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-bold rounded-md border border-purple-500/30 uppercase tracking-wider inline-flex items-center gap-1.5 mb-2">
            <BrainCircuit className="w-3.5 h-3.5" /> AI Knowledge Index
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight">AI Knowledge Base & Grounding Context</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Overview of database documents, indexed syllabus files, and academic regulation records available to the Gemini AI engine.
          </p>
        </div>

        <button
          onClick={fetchKnowledge}
          className="px-4 py-2 text-xs font-bold text-slate-200 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-xl transition flex items-center gap-1.5 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Re-index Knowledge</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Institutional Policy Documents */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-600" />
              <span>Institutional Regulation Documents ({data?.documents.length || 0})</span>
            </h3>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Active Grounding
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.documents && data.documents.length > 0 ? (
              data.documents.map((doc) => (
                <div key={doc.id} className="py-3 text-xs space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{doc.title}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{doc.category}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed">{doc.content_summary}</p>
                </div>
              ))
            ) : (
              <div className="py-4 text-xs text-slate-400 text-center italic">No documents indexed.</div>
            )}
          </div>
        </div>

        {/* Indexed Syllabus Records */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-brand-600" />
              <span>Indexed Syllabus Catalog ({data?.indexedSyllabus.length || 0})</span>
            </h3>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
              RAG Ready
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[350px] overflow-y-auto">
            {data?.indexedSyllabus && data.indexedSyllabus.length > 0 ? (
              data.indexedSyllabus.map((syl) => (
                <div key={syl.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-brand-700 mr-2">{syl.course_code}</span>
                    <span className="font-bold text-slate-800">{syl.file_name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    v{syl.version}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-4 text-xs text-slate-400 text-center italic">No syllabus indexed.</div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
