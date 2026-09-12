import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  GraduationCap,
  School,
  FileCheck2,
  TrendingUp,
  UserPlus,
  BellPlus,
  PlusCircle,
  CalendarCheck2,
  ArrowUpRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import api from '../../services/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Loader from '../../components/Loader';

const PIE_COLORS = {
  present: '#10B981', // emerald
  late: '#F59E0B',    // amber
  absent: '#F43F5E',  // rose
};

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load dashboard metrics');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader fullScreen={false} />;
  if (error) {
    return (
      <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm">
        {error}
      </div>
    );
  }

  const counts = data?.counts || { students: 0, teachers: 0, classes: 0, pendingAdmissions: 0 };
  const studentsByClass = data?.studentsByClass || [];
  const admissionsByMonth = data?.admissionsByMonth || [];
  const attendanceOverview = data?.attendanceOverview || [];
  const examPerformance = data?.examPerformance || [];

  const statCards = [
    {
      title: 'Total Students',
      value: counts.students,
      change: '+12% this term',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-indigo-600',
      bgLight: 'bg-indigo-50',
      link: '/admin/students',
    },
    {
      title: 'Faculty Members',
      value: counts.teachers,
      change: '100% active',
      icon: GraduationCap,
      color: 'from-violet-500 to-purple-600',
      textColor: 'text-violet-600',
      bgLight: 'bg-violet-50',
      link: '/admin/teachers',
    },
    {
      title: 'Active Classes',
      value: counts.classes,
      change: 'Grades 1 – 12',
      icon: School,
      color: 'from-teal-500 to-emerald-600',
      textColor: 'text-teal-600',
      bgLight: 'bg-teal-50',
      link: '/admin/classes',
    },
    {
      title: 'Pending Admissions',
      value: counts.pendingAdmissions,
      change: 'Requires review',
      icon: FileCheck2,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
      bgLight: 'bg-amber-50',
      link: '/admin/admissions',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Institutional Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time enrollment, academic metrics, and operational performance.
          </p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <Link
            to="/admin/students"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Add Student</span>
          </Link>
          <Link
            to="/admin/notices"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
          >
            <BellPlus className="w-3.5 h-3.5" />
            <span>Post Notice</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((c, idx) => {
          const Icon = c.icon;
          return (
            <Link key={idx} to={c.link} className="block group">
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 rounded-2xl ${c.bgLight} ${c.textColor} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="p-1 rounded-lg text-slate-300 group-hover:text-indigo-600 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {c.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mt-0.5">{c.title}</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-2 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                    <span>{c.change}</span>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Class Enrollment */}
        <Card
          title="Student Enrollment by Class"
          subtitle="Distribution of enrolled students across sections"
        >
          <div className="h-64 w-full">
            {studentsByClass.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentsByClass} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="className" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                No class enrollment records available.
              </div>
            )}
          </div>
        </Card>

        {/* Admissions Trend */}
        <Card
          title="Admission Applications (Last 6 Months)"
          subtitle="Monthly applicant pipeline"
        >
          <div className="h-64 w-full">
            {admissionsByMonth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={admissionsByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="applications"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorApps)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-xs text-slate-400">
                No admissions data logged yet.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Row 2: Attendance Distribution & Grade Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Breakdown */}
        <Card
          title="Attendance Breakdown"
          subtitle="Overall student participation status"
          className="lg:col-span-1"
        >
          <div className="h-56 w-full flex items-center justify-center">
            {attendanceOverview.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceOverview}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {attendanceOverview.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[entry._id] || '#94A3B8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      color: '#fff',
                      borderRadius: '12px',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-xs text-slate-400">No attendance data.</div>
            )}
          </div>
          <div className="flex items-center justify-center gap-4 mt-2 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Present
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Late
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              Absent
            </span>
          </div>
        </Card>

        {/* Quick Operations Hub */}
        <Card
          title="Quick Administration Shortcuts"
          subtitle="Instant portal shortcuts"
          className="lg:col-span-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/admin/students"
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-xs transition-all flex items-start gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Manage Students
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse, search, enroll, and update student demographic profiles.
                </p>
              </div>
            </Link>

            <Link
              to="/admin/teachers"
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-xs transition-all flex items-start gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-violet-600 transition-colors">
                  Manage Faculty
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Appoint teachers, configure subject codes and class teacher assignments.
                </p>
              </div>
            </Link>

            <Link
              to="/admin/admissions"
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-xs transition-all flex items-start gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  Admissions Desk
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Process new student inquiries, approve admissions, and send notifications.
                </p>
              </div>
            </Link>

            <Link
              to="/admin/examinations"
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-500 hover:shadow-xs transition-all flex items-start gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CalendarCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                  Exams & Results
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Schedule board and mid-term exams, publish grades, and review report cards.
                </p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
