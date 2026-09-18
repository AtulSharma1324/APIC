import React, { useState, useEffect } from 'react';
import { Sliders, Plus, Edit2, Trash2 } from 'lucide-react';
import { api } from '../../services/api';
import { CARule, Program, Semester } from '../../types';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const AdminCARulesPage: React.FC = () => {
  const [caRules, setCARules] = useState<CARule[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCa, setEditingCa] = useState<CARule | null>(null);

  const [programId, setProgramId] = useState<number | ''>('');
  const [semesterId, setSemesterId] = useState<number | ''>('');
  const [totalCa, setTotalCa] = useState(4);
  const [requiredCa, setRequiredCa] = useState(3);
  const [bestOf, setBestOf] = useState(3);
  const [weightagePercentage, setWeightagePercentage] = useState(30);
  const [description, setDescription] = useState('');

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [caRes, progRes, semRes] = await Promise.all([
        api.get('/ca-rules'),
        api.get('/programs'),
        api.get('/semesters')
      ]);
      if (caRes.data.success) setCARules(caRes.data.data);
      if (progRes.data.success) setPrograms(progRes.data.data);
      if (semRes.data.success) setSemesters(semRes.data.data);
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
    setEditingCa(null);
    setProgramId(programs.length > 0 ? programs[0].id : '');
    setSemesterId(semesters.length > 0 ? semesters[0].id : '');
    setTotalCa(4);
    setRequiredCa(3);
    setBestOf(3);
    setWeightagePercentage(30);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ca: CARule) => {
    setEditingCa(ca);
    setProgramId(ca.program_id);
    setSemesterId(ca.semester_id);
    setTotalCa(ca.total_ca);
    setRequiredCa(ca.required_ca);
    setBestOf(ca.best_of);
    setWeightagePercentage(ca.weightage_percentage);
    setDescription(ca.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCa) {
        await api.put(`/ca-rules/${editingCa.id}`, {
          programId,
          semesterId,
          totalCa,
          requiredCa,
          bestOf,
          weightagePercentage,
          description
        });
      } else {
        await api.post('/ca-rules', {
          programId,
          semesterId,
          totalCa,
          requiredCa,
          bestOf,
          weightagePercentage,
          description
        });
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
      await api.delete(`/ca-rules/${deletingId}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete CA rule');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">CA Rule Configuration</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configure Continuous Assessment parameters per program and semester.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Configure CA Rule</span>
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
                <th className="py-3 px-4">Semester</th>
                <th className="py-3 px-4 text-center">Total CA</th>
                <th className="py-3 px-4 text-center">Required CA</th>
                <th className="py-3 px-4 text-center">Best Of</th>
                <th className="py-3 px-4 text-center">Weightage</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {caRules.map((ca) => (
                <tr key={ca.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800">{ca.program_code || ca.program_name}</td>
                  <td className="py-3.5 px-4 font-medium text-slate-600">{ca.semester_name || `Sem ${ca.semester_number}`}</td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-slate-900">{ca.total_ca}</td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-slate-900">{ca.required_ca}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-brand-700">Best {ca.best_of}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-emerald-700">{ca.weightage_percentage}%</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(ca)}
                      className="p-1.5 text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(ca.id)}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingCa ? 'Edit CA Rule' : 'Configure CA Rule'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Program</label>
              <select
                required
                value={programId}
                onChange={(e) => setProgramId(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                {programs.map(p => (
                  <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
              <select
                required
                value={semesterId}
                onChange={(e) => setSemesterId(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                {semesters.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Total CA</label>
              <input
                type="number"
                min={1}
                required
                value={totalCa}
                onChange={(e) => setTotalCa(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Required CA</label>
              <input
                type="number"
                min={1}
                required
                value={requiredCa}
                onChange={(e) => setRequiredCa(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Best Of</label>
              <input
                type="number"
                min={1}
                required
                value={bestOf}
                onChange={(e) => setBestOf(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Weightage %</label>
              <input
                type="number"
                step="1"
                min={0}
                max={100}
                required
                value={weightagePercentage}
                onChange={(e) => setWeightagePercentage(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Rule Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Rule description for student evaluation..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl">Save CA Rule</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete CA Rule"
        message="Are you sure you want to delete this CA evaluation rule?"
      />
    </div>
  );
};
