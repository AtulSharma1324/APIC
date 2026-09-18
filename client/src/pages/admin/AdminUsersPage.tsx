import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, UserCheck } from 'lucide-react';
import { api } from '../../services/api';
import { User } from '../../types';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then(res => {
      if (res.data.success) {
        setUsers(res.data.data);
      }
    }).finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">User Directory</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Registered student profiles and administrative user credentials.
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="table" count={4} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4">Program</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">
                      {u.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{u.name}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{u.email}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 text-[10px] font-extrabold rounded-md ${
                      u.role === 'ADMIN' ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-brand-50 text-brand-700 border border-brand-200'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{u.student_id || 'N/A'}</td>
                  <td className="py-3.5 px-4 text-slate-600">{u.program_name || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
