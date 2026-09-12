import { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Award,
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import Loader from '../../components/Loader';

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeTeacher, setActiveTeacher] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: 'SmartSchool@123',
    employeeId: '',
    qualification: '',
    phone: '',
    bio: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/teachers');
      let list = res.data.data || [];
      if (search) {
        list = list.filter(
          (t) =>
            t.name.toLowerCase().includes(search.toLowerCase()) ||
            t.employeeId?.toLowerCase().includes(search.toLowerCase())
        );
      }
      setTeachers(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load faculty list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [search]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      password: 'SmartSchool@123',
      employeeId: `TCH${Math.floor(1000 + Math.random() * 9000)}`,
      qualification: 'M.Sc. Physics, B.Ed.',
      phone: '+91 98765 12345',
      bio: 'Experienced educator focused on interactive problem solving.',
    });
    setFormError('');
    setAddModalOpen(true);
  };

  const handleOpenEdit = (tch) => {
    setActiveTeacher(tch);
    setFormData({
      name: tch.name,
      employeeId: tch.employeeId,
      qualification: tch.qualification || '',
      phone: tch.phone || '',
      bio: tch.bio || '',
    });
    setFormError('');
    setEditModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await api.post('/teachers', formData);
      setAddModalOpen(false);
      fetchTeachers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create teacher');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError('');
    try {
      await api.put(`/teachers/${activeTeacher._id}`, formData);
      setEditModalOpen(false);
      fetchTeachers();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update teacher');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    setSubmitting(true);
    try {
      await api.delete(`/teachers/${activeTeacher._id}`);
      setDeleteModalOpen(false);
      fetchTeachers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete teacher');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <GraduationCap className="w-7 h-7 text-violet-600" />
            Faculty & Teachers Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage academic instructors, qualifications, and department appointments.
          </p>
        </div>

        <Button onClick={handleOpenAdd} variant="primary" size="md">
          <Plus className="w-4 h-4 mr-1.5" />
          Add Faculty Member
        </Button>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by teacher name or Employee ID..."
            className="w-full rounded-xl border border-slate-300 pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
          />
        </div>
      </Card>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Teachers Grid */}
      {loading ? (
        <div className="py-16">
          <Loader fullScreen={false} />
        </div>
      ) : teachers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((tch) => (
            <Card key={tch._id} hoverable className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-xs">
                      {tch.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{tch.name}</h3>
                      <span className="font-mono text-xs font-semibold text-violet-600">
                        {tch.employeeId}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(tch)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveTeacher(tch);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Award className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span>{tch.qualification || 'Senior Faculty'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{tch.userId?.email || tch.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{tch.phone || 'No phone'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100 line-clamp-2">
                  {tch.bio || 'Active faculty member supporting student growth.'}
                </p>
              </div>

              {/* Assignments footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Classes: {tch.classes?.length || 0}</span>
                <span>Subjects: {tch.subjects?.length || 0}</span>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-400 text-sm">
          No faculty members found matching your search.
        </div>
      )}

      {/* MODAL: ADD TEACHER */}
      <Modal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Appoint New Faculty Member"
        subtitle="Create faculty account and directory profile"
        maxWidth="max-w-xl"
      >
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {formError}
          </div>
        )}
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. Daniel Okonkwo"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Faculty Email (Login) *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="daniel@smartschool.test"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Employee ID *
              </label>
              <input
                type="text"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="TCH0009"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 11111"
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Qualifications & Degrees *
            </label>
            <input
              type="text"
              required
              value={formData.qualification}
              onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              placeholder="M.Sc. Mathematics, B.Ed."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Faculty Biography / Expertise
            </label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Specializes in higher secondary algebra, calculus, and mathematical modeling."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
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
              Appoint Faculty
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: EDIT TEACHER */}
      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Faculty Information"
        subtitle={`Updating ${activeTeacher?.name}`}
        maxWidth="max-w-xl"
      >
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {formError}
          </div>
        )}
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Qualification</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-violet-500"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" loading={submitting}>
              Save Updates
            </Button>
          </div>
        </form>
      </Modal>

      {/* MODAL: DELETE TEACHER */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Faculty Removal"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Are you sure you want to remove <strong className="text-slate-900">{activeTeacher?.name}</strong> ({activeTeacher?.employeeId}) from the faculty registry?
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
              Remove Teacher
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
