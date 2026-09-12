import { useState, useEffect } from 'react';
import {
  Bell,
  Plus,
  Trash2,
  Calendar,
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import Loader from '../../components/Loader';

const PRIORITY_BADGES = {
  urgent: 'danger',
  high: 'warning',
  normal: 'primary',
  low: 'default',
};

export default function AdminNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeNotice, setActiveNotice] = useState(null);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    audience: 'all',
    priority: 'normal',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notices');
      setNotices(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      content: '',
      audience: 'all',
      priority: 'normal',
    });
    setFormError('');
    setAddModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/notices', formData);
      setAddModalOpen(false);
      fetchNotices();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to publish notice');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/notices/${activeNotice._id}`);
      setDeleteModalOpen(false);
      fetchNotices();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete notice');
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
            <Bell className="w-7 h-7 text-indigo-600" />
            Announcements & Notice Board
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Broadcast school-wide announcements, exam schedules, and holiday notices.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="primary" size="md">
          <Plus className="w-4 h-4 mr-1.5" />
          Broadcast Notice
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
      ) : notices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {notices.map((ntc) => {
            const badgeVariant = PRIORITY_BADGES[ntc.priority] || 'default';
            return (
              <Card key={ntc._id} hoverable className="flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={badgeVariant} size="sm">
                        {ntc.priority} priority
                      </Badge>
                      <Badge variant="default" size="sm">
                        Audience: {ntc.audience}
                      </Badge>
                    </div>

                    <button
                      onClick={() => {
                        setActiveNotice(ntc);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 transition-colors"
                      title="Delete Notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2">{ntc.title}</h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed whitespace-pre-line">
                    {ntc.content}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ntc.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                  <span>Published by {ntc.createdBy?.name || 'Administration'}</span>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-sm">
          No notices currently posted. Click "Broadcast Notice" to create an announcement.
        </div>
      )}

      {/* MODAL: ADD NOTICE */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Broadcast Announcement"
        subtitle="Publish a school-wide or targeted notification"
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
              Notice Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Annual Sports Meet 2026 Scheduled"
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Audience *
              </label>
              <select
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="all">Entire School (All)</option>
                <option value="students">Students Only</option>
                <option value="teachers">Faculty Only</option>
                <option value="public">Public Website & Parents</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Priority *</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 bg-white"
              >
                <option value="normal">Normal</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Announcement Message Content *
            </label>
            <textarea
              rows={4}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write detailed announcement instructions, dates, requirements, or guidelines..."
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
              Publish Announcement
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: DELETE NOTICE */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Delete Announcement"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to retract and delete{' '}
            <strong className="text-slate-900">{activeNotice?.title}</strong>?
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
              Delete Notice
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
