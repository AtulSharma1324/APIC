import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit2, Trash2, Award } from 'lucide-react';
import { api } from '../../services/api';
import { Subject, Specialization, Semester, Program } from '../../types';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const AdminSubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [specializations, setSpecializations] = useState<Specialization[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subject | null>(null);

  const [specializationId, setSpecializationId] = useState<number | ''>('');
  const [semesterId, setSemesterId] = useState<number | ''>('');
  const [courseCode, setCourseCode] = useState('');
  const [name, setName] = useState('');
  const [subjectType, setSubjectType] = useState<'Core' | 'Elective' | 'Lab' | 'Project'>('Core');
  const [credits, setCredits] = useState<number>(4);
  const [description, setDescription] = useState('');

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [subRes, specRes, semRes] = await Promise.all([
        api.get('/subjects'),
        api.get('/specializations'),
        api.get('/semesters')
      ]);
      if (subRes.data.success) setSubjects(subRes.data.data);
      if (specRes.data.success) setSpecializations(specRes.data.data);
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
    setEditingSub(null);
    setSpecializationId(specializations.length > 0 ? specializations[0].id : '');
    setSemesterId(semesters.length > 0 ? semesters[0].id : '');
    setCourseCode('');
    setName('');
    setSubjectType('Core');
    setCredits(4);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sub: Subject) => {
    setEditingSub(sub);
    setSpecializationId(sub.specialization_id || '');
    setSemesterId(sub.semester_id || '');
    setCourseCode(sub.course_code);
    setName(sub.name);
    setSubjectType(sub.subject_type || 'Core');
    setCredits(sub.credits);
    setDescription(sub.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (credits <= 0) {
      alert('Credits must be a valid positive numeric value.');
      return;
    }

    try {
      if (editingSub) {
        await api.put(`/subjects/${editingSub.id}`, {
          specializationId,
          semesterId,
          courseCode,
          name,
          subjectType,
          credits,
          description
        });
      } else {
        await api.post('/subjects', {
          specializationId,
          semesterId,
          courseCode,
          name,
          subjectType,
          credits,
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
      await api.delete(`/subjects/${deletingId}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete subject');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Subject Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Create, update, and manage subjects, course codes, and credit weightages.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="table" count={4} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-4">Subject Title</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-center">Credits</th>
                <th className="py-3 px-4">Track</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {subjects.map((sub) => (
                <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-black text-brand-700">{sub.course_code}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{sub.name}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 rounded text-slate-700">
                      {sub.subject_type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center font-bold text-amber-700">{sub.credits}</td>
                  <td className="py-3.5 px-4 text-slate-600">{sub.specialization_name || 'General'}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(sub)}
                      className="p-1.5 text-slate-600 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(sub.id)}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingSub ? 'Edit Subject' : 'Add New Subject'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Course Code (Unique)</label>
              <input
                type="text"
                required
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                placeholder="MCA201"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Credits (Positive Number)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                required
                value={credits}
                onChange={(e) => setCredits(parseFloat(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subject Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Data Structures & Algorithms"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject Type</label>
              <select
                value={subjectType}
                onChange={(e) => setSubjectType(e.target.value as any)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="Core">Core</option>
                <option value="Elective">Elective</option>
                <option value="Lab">Lab</option>
                <option value="Project">Project</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Specialization</label>
              <select
                value={specializationId}
                onChange={(e) => setSpecializationId(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              >
                {specializations.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
              <select
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

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description & Topics</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of course modules and learning objectives..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl">Save Subject</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Subject"
        message="Are you sure you want to delete this subject? Associated syllabus PDF files will be detached."
      />
    </div>
  );
};
