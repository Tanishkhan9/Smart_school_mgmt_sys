import { useState, useEffect } from 'react';
import {
  FileCheck2,
  Search,
  Eye,
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Badge from '../../components/Badge';
import Loader from '../../components/Loader';

const STATUS_BADGES = {
  pending: { variant: 'warning', label: 'Pending' },
  under_review: { variant: 'primary', label: 'Under Review' },
  approved: { variant: 'success', label: 'Approved' },
  rejected: { variant: 'danger', label: 'Rejected' },
};

export default function AdminAdmissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Review Modal
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeApp, setActiveApp] = useState(null);
  const [newStatus, setNewStatus] = useState('approved');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/admissions', { params });
      let list = res.data.data || [];
      if (search) {
        list = list.filter(
          (a) =>
            a.studentName.toLowerCase().includes(search.toLowerCase()) ||
            a.parentName.toLowerCase().includes(search.toLowerCase()) ||
            a.email.toLowerCase().includes(search.toLowerCase())
        );
      }
      setAdmissions(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [statusFilter, search]);

  const handleOpenReview = (app) => {
    setActiveApp(app);
    setNewStatus(app.status || 'approved');
    setNotes(app.notes || '');
    setReviewModalOpen(true);
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put(`/admissions/${activeApp._id}/status`, {
        status: newStatus,
        notes,
      });
      setReviewModalOpen(false);
      fetchAdmissions();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update application status');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
          <FileCheck2 className="w-7 h-7 text-amber-600" />
          Admissions Review Desk
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review incoming enrollment inquiries, verify candidate eligibility, and update statuses.
        </p>
      </div>

      {/* Filter Tabs & Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Status Pills */}
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {[
              { id: '', label: 'All Applications' },
              { id: 'pending', label: 'Pending' },
              { id: 'under_review', label: 'Under Review' },
              { id: 'approved', label: 'Approved' },
              { id: 'rejected', label: 'Rejected' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === st.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search applicant..."
              className="w-full rounded-xl border border-slate-300 pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </Card>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Table */}
      <Card bodyClassName="p-0 overflow-hidden">
        {loading ? (
          <div className="py-16">
            <Loader fullScreen={false} />
          </div>
        ) : admissions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-5">Applicant</th>
                  <th className="py-3.5 px-4">Applying Class</th>
                  <th className="py-3.5 px-4">Parent / Contact</th>
                  <th className="py-3.5 px-4">Previous School</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {admissions.map((app) => {
                  const badgeInfo = STATUS_BADGES[app.status] || STATUS_BADGES.pending;
                  return (
                    <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-slate-900">{app.studentName}</div>
                        <div className="text-xs text-slate-400">
                          DOB: {app.dateOfBirth ? new Date(app.dateOfBirth).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">
                          Class {app.applyingClass}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-xs">
                          <span className="font-medium text-slate-800">{app.parentName}</span>
                          <div className="text-slate-400 mt-0.5">{app.phone}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600">
                        {app.previousSchool || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge variant={badgeInfo.variant} size="sm">
                          {badgeInfo.label}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenReview(app)}
                        >
                          <Eye className="w-3.5 h-3.5 mr-1" />
                          Review
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400 text-sm">
            No admission applications found.
          </div>
        )}
      </Card>

      {/* MODAL: REVIEW APPLICATION */}
      <Modal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        title="Review Admission Application"
        subtitle={`Candidate: ${activeApp?.studentName}`}
        maxWidth="max-w-xl"
      >
        {activeApp && (
          <div className="space-y-6">
            {/* Dossier Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Candidate Name</span>
                  <span className="font-bold text-slate-900 text-sm">{activeApp.studentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Grade Applying For</span>
                  <span className="font-bold text-indigo-600 text-sm">Class {activeApp.applyingClass}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Parent / Guardian</span>
                  <span className="font-medium text-slate-800">{activeApp.parentName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Contact Phone</span>
                  <span className="font-medium text-slate-800">{activeApp.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Email Address</span>
                  <span className="font-medium text-slate-800">{activeApp.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Previous Institution</span>
                  <span className="font-medium text-slate-800">{activeApp.previousSchool || '—'}</span>
                </div>
              </div>

              {activeApp.address && (
                <div className="pt-2 border-t border-slate-200 text-xs">
                  <span className="text-slate-400 block">Residential Address</span>
                  <span className="font-medium text-slate-700">{activeApp.address}</span>
                </div>
              )}
            </div>

            {/* Status Update Form */}
            <form onSubmit={handleStatusSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Change Application Status *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'under_review', label: 'Under Review' },
                    { id: 'approved', label: 'Approve' },
                    { id: 'rejected', label: 'Reject' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setNewStatus(st.id)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        newStatus === st.id
                          ? st.id === 'approved'
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : st.id === 'rejected'
                            ? 'bg-rose-50 border-rose-500 text-rose-700'
                            : 'bg-indigo-50 border-indigo-500 text-indigo-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Administrative Review Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Verified transfer certificate and grade 9 marksheets. Candidate approved for interview."
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setReviewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" loading={submitting}>
                  Save Review Decision
                </Button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
