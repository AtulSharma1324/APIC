import React, { useState, useEffect } from 'react';
import { FileUp, Plus, Trash2, Download, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';
import { Syllabus, Subject } from '../../types';
import { LoadingSkeleton } from '../../components/LoadingSkeleton';
import { Modal } from '../../components/Modal';
import { ConfirmDialog } from '../../components/ConfirmDialog';

export const AdminSyllabusPage: React.FC = () => {
  const [syllabusList, setSyllabusList] = useState<Syllabus[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectId, setSubjectId] = useState<number | ''>('');
  const [fileUrl, setFileUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [version, setVersion] = useState('1.0');
  const [description, setDescription] = useState('');

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [sylRes, subRes] = await Promise.all([
        api.get('/syllabus'),
        api.get('/subjects')
      ]);
      if (sylRes.data.success) setSyllabusList(sylRes.data.data);
      if (subRes.data.success) setSubjects(subRes.data.data);
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
    setSubjectId(subjects.length > 0 ? subjects[0].id : '');
    setFileUrl('');
    setFileName('');
    setVersion('1.0');
    setDescription('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/syllabus', {
        subjectId,
        fileUrl: fileUrl || undefined,
        fileName: fileName || `Syllabus_Subject_${subjectId}.pdf`,
        version,
        description
      });
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/syllabus/${deletingId}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to delete syllabus entry');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Syllabus PDF Management</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Attach, replace, and upload official PDF syllabus files stored on Supabase Storage.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition flex items-center gap-1.5 shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Syllabus</span>
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="table" count={3} />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold uppercase text-slate-500">
                <th className="py-3 px-4">Subject</th>
                <th className="py-3 px-4">File Name</th>
                <th className="py-3 px-4">Version</th>
                <th className="py-3 px-4 text-center">Preview / Download</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {syllabusList.map((syl) => (
                <tr key={syl.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-800">{syl.course_code || `Subject #${syl.subject_id}`}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">{syl.file_name}</td>
                  <td className="py-3.5 px-4 font-bold text-brand-700">v{syl.version}</td>
                  <td className="py-3.5 px-4 text-center">
                    <a
                      href={syl.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:underline"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>View PDF</span>
                    </a>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => setDeletingId(syl.id)}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Syllabus Document">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
            <select
              required
              value={subjectId}
              onChange={(e) => setSubjectId(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            >
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>{sub.course_code} - {sub.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Document Title / File Name</label>
            <input
              type="text"
              required
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="MCA101_Advanced_Data_Structures.pdf"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Supabase PDF Public File URL (Optional)</label>
            <input
              type="url"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              placeholder="https://your-supabase.supabase.co/storage/v1/object/public/..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 mt-1">If left blank, standard university document fallback link will be attached.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Syllabus Version</label>
            <input
              type="text"
              required
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0"
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Version Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Module topics and changes in this version..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-brand-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-brand-600 rounded-xl">Save Document</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Syllabus Document"
        message="Are you sure you want to delete this syllabus PDF file link?"
      />
    </div>
  );
};
