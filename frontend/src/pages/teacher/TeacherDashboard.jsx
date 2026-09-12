import { useState, useEffect } from 'react';
import {
  Users,
  School,
  BookOpen,
  CalendarCheck2,
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Loader from '../../components/Loader';

export default function TeacherDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/teachers/me/dashboard')
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load teacher dashboard');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <Loader fullScreen={false} />;
  if (error) {
    return (
      <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
        {error}
      </div>
    );
  }

  const teacher = data?.teacher;
  const studentCount = data?.studentCount || 0;
  const assignedClasses = data?.assignedClasses || [];
  const pendingAssignments = data?.pendingAssignments || [];
  const upcomingExams = data?.upcomingExams || [];
  const todayAttendance = data?.todayAttendance || { present: 0, absent: 0, late: 0 };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Welcome, {teacher?.name}
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Faculty Overview — {teacher?.qualification} (Emp ID: {teacher?.employeeId})
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Students Taught</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{studentCount}</div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Assigned Classes</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {assignedClasses.length}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Active Subjects</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {teacher?.subjects?.length || 0}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <CalendarCheck2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Scheduled Exams</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {upcomingExams.length}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid: Classes & Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Classes & Subjects */}
        <Card title="My Assigned Classes & Subjects">
          <div className="space-y-3">
            {assignedClasses.length > 0 ? (
              assignedClasses.map((cls) => (
                <div
                  key={cls._id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                      {cls.name}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Class {cls.name} – Section {cls.section}
                      </div>
                      <div className="text-[11px] text-slate-400">{cls.academicYear}</div>
                    </div>
                  </div>
                  <Badge variant="primary" size="sm">
                    Class Teacher
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No classes assigned yet.</p>
            )}
          </div>
        </Card>

        {/* Today's Attendance Overview */}
        <Card title="Today's Attendance Overview" subtitle="Recorded for your classroom sections">
          <div className="grid grid-cols-3 gap-3 text-center my-4">
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="text-2xl font-bold text-emerald-700">{todayAttendance.present}</div>
              <div className="text-xs font-medium text-emerald-600 mt-1">Present</div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
              <div className="text-2xl font-bold text-amber-700">{todayAttendance.late}</div>
              <div className="text-xs font-medium text-amber-600 mt-1">Late</div>
            </div>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-100">
              <div className="text-2xl font-bold text-rose-700">{todayAttendance.absent}</div>
              <div className="text-xs font-medium text-rose-600 mt-1">Absent</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Row 2: Upcoming Exams & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Upcoming Examinations">
          <div className="space-y-3">
            {upcomingExams.length > 0 ? (
              upcomingExams.map((ex) => (
                <div
                  key={ex._id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-white flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{ex.name}</h4>
                    <span className="text-[11px] text-indigo-600 font-semibold">
                      {ex.subjectId?.name || 'Subject Test'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(ex.date).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No upcoming exams scheduled.</p>
            )}
          </div>
        </Card>

        <Card title="Active Assignments">
          <div className="space-y-3">
            {pendingAssignments.length > 0 ? (
              pendingAssignments.map((asg) => (
                <div
                  key={asg._id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-white flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{asg.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{asg.description}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-600">
                    Due: {new Date(asg.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No pending assignments.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
