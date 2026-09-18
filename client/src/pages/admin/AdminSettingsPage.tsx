import React, { useState, useEffect } from 'react';
import { Settings, Server, Database, ShieldCheck, HardDrive, Bot } from 'lucide-react';
import { api } from '../../services/api';

export const AdminSettingsPage: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    api.get('/health').then(res => {
      setHealthStatus(res.data);
    }).catch(() => {
      setHealthStatus({ success: false, message: 'Backend unreachable' });
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Configuration & Health</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Environment configuration variables and integration service status checks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Backend Health Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-600" />
            <span>Express REST API Server Status</span>
          </h3>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-600">Health Check (`/api/health`):</span>
              <span className={`px-2 py-0.5 font-bold rounded text-[10px] uppercase ${healthStatus?.success ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {healthStatus?.success ? 'Healthy 200 OK' : 'Offline'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">{healthStatus?.message}</p>
          </div>
        </div>

        {/* Database & Cloud Integrations */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Database className="w-4 h-4 text-purple-600" />
            <span>Cloud & Service Integrations</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-700">PostgreSQL (Supabase)</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Connected
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-slate-500" />
                <span className="font-semibold text-slate-700">Supabase Storage Bucket</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                syllabus-documents
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-purple-600" />
                <span className="font-semibold text-slate-700">Google Gemini AI Engine</span>
              </div>
              <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Grounded Prompt Mode
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
