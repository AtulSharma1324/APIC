import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { Semester, Program } from '../../types';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const AdminSemestersPage: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSem, setEditingSem] = useState<Semester | null>(null);

  const [programId, setProgramId] = useState<number | ''>('');
  const [semesterNumber, setSemesterNumber] = useState(1);
  const [name, setName] = useState('');

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [semRes, progRes] = await Promise.all([
        api.get('/semesters'),
        api.get('/programs')
      ]);
      if (semRes.data.success) setSemesters(semRes.data.data);
      if (progRes.data.success) setPrograms(progRes.data.data);
    } catch {
      // Silently handled
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setEditingSem(null);
    setProgramId(programs.length > 0 ? programs[0].id : '');
    setSemesterNumber(1);
    setName('Semester 1');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sem: Semester) => {
    setEditingSem(sem);
    setProgramId(sem.program_id);
    setSemesterNumber(sem.semester_number);
    setName(sem.name);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSem) {
        await api.put(`/semesters/${editingSem.id}`, { programId, semesterNumber, name });
      } else {
        await api.post('/semesters', { programId, semesterNumber, name });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/semesters/${deletingId}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete semester');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Semester Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure dynamic term semesters for each degree program.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Semester</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="table" count={3} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                <th className="py-3 px-4">Program</th>
                <th className="py-3 px-4">Semester #</th>
                <th className="py-3 px-4">Term Label</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {semesters.map((sem) => (
                <tr key={sem.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-700">{sem.program_name || `Program #${sem.program_id}`}</td>
                  <td className="py-3.5 px-4 font-black text-brand-700">Sem {sem.semester_number}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{sem.name}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(sem)}
                      className="p-1.5 text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(sem.id)}
                      className="p-1.5 text-slate-600 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSem ? 'Edit Semester' : 'Create Semester'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Program</label>
            <select
              required
              value={programId}
              onChange={(e) => setProgramId(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            >
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Semester Number</label>
              <input
                type="number"
                min={1}
                max={12}
                required
                value={semesterNumber}
                onChange={(e) => {
                  const num = Number(e.target.value);
                  setSemesterNumber(num);
                  setName(`Semester ${num}`);
                }}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Term Display Label</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Semester 1"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl">Save Semester</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Semester"
        message="Are you sure you want to delete this semester?"
      />
    </div>
  );
};
