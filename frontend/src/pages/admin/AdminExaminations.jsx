import { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  Plus,
  Trash2,
  Calendar,
  Clock,
  MapPin,
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import Loader from '../../components/Loader';

export default function AdminExaminations() {
  const [exams, setExams] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeExam, setActiveExam] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    name: 'Final Term Examination',
    classId: '',
    subjectId: '',
    date: '2026-11-15',
    startTime: '09:30',
    duration: 180,
    room: 'Hall 1',
    instructions: 'Calculators are prohibited. Bring official student admit cards.',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [examRes, classRes, subjRes] = await Promise.all([
        api.get('/examinations'),
        api.get('/classes'),
        api.get('/subjects'),
      ]);
      setExams(examRes.data.data || []);
      setClasses(classRes.data.data || []);
      setSubjects(subjRes.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load examinations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      name: 'Final Term Examination',
      classId: classes[0]?._id || '',
      subjectId: subjects[0]?._id || '',
      date: '2026-11-15',
      startTime: '09:30',
      duration: 180,
      room: 'Main Hall',
      instructions: 'Calculators are prohibited. Bring official student admit cards.',
    });
    setFormError('');
    setAddModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/examinations', formData);
      setAddModalOpen(false);
      loadData();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to schedule examination');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/examinations/${activeExam._id}`);
      setDeleteModalOpen(false);
      loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete examination');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarCheck2 className="w-7 h-7 text-indigo-600" />
            Examinations & Assessments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Schedule term tests, board examinations, hall allotments, and result publishing.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="primary" size="md">
          <Plus className="w-4 h-4 mr-1.5" />
          Schedule Examination
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-16">
          <Loader fullScreen={false} />
        </div>
      ) : exams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((ex) => (
            <Card key={ex._id} hoverable className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <Badge variant="primary" size="sm" className="mb-2">
                      Class {ex.classId?.name || '10'}-{ex.classId?.section || 'A'}
                    </Badge>
                    <h3 className="text-base font-bold text-slate-900">{ex.name}</h3>
                    <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                      {ex.subjectId?.name || 'General Examination'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setActiveExam(ex);
                      setDeleteModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                    title="Delete Exam"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 text-xs text-slate-600 mt-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {new Date(ex.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>
                      {ex.startTime} ({ex.duration} mins)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Venue: {ex.room || 'Assigned Examination Hall'}</span>
                  </div>
                </div>

                {ex.instructions && (
                  <p className="text-[11px] text-slate-400 mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 line-clamp-2">
                    {ex.instructions}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400">Status</span>
                <Badge variant={ex.status === 'completed' ? 'success' : 'primary'} size="sm">
                  {ex.status || 'scheduled'}
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-sm">
          No examinations scheduled yet. Click "Schedule Examination" to create one.
        </div>
      )}

      {/* MODAL: ADD EXAM */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Schedule Examination"
        subtitle="Specify subject, timing, hall allotment, and test guidelines"
        maxWidth="max-w-lg"
      >
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {formError}
          </div>
        )}
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Examination Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Mid-Term Examination"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Class *</label>
              <select
                required
                value={formData.classId}
                onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="">Select Class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>
                    Class {c.name}-{c.section}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
              <select
                required
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name} ({s.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Date *</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time *</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration (min) *
              </label>
              <input
                type="number"
                required
                min={30}
                step={15}
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Examination Room / Hall
            </label>
            <input
              type="text"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              placeholder="e.g. Auditorium Hall 2"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Instructions for Students
            </label>
            <textarea
              rows={2}
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              placeholder="Bring admit card and standard writing materials."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={submitting}>
              Schedule Examination
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: DELETE EXAM */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Examination Schedule"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to cancel and delete the scheduled examination{' '}
            <strong className="text-slate-900">{activeExam?.name}</strong>?
          </p>
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="danger"
              size="sm"
              loading={submitting}
              onClick={handleDeleteSubmit}
            >
              Delete Exam
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
