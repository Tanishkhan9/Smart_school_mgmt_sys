import { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  FileText,
} from 'lucide-react';
import api from '../../services/api';
import Card from '../../components/Card';
import Badge from '../../components/Badge';
import Loader from '../../components/Loader';

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/students/me/dashboard')
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load student dashboard');
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

  const student = data?.student;
  const attendancePercentage = data?.attendancePercentage || 0;
  const averageMarks = data?.averageMarks || 0;
  const upcomingExams = data?.upcomingExams || [];
  const pendingAssignments = data?.pendingAssignments || [];
  const notices = data?.notices || [];
  const breakdown = data?.attendanceBreakdown || { present: 0, absent: 0, late: 0, total: 0 };

  return (
    <div className="space-y-6">
      {/* Student Profile Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-indigo-500/20">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-2xl flex items-center justify-center shadow-md shrink-0">
            {student?.name?.charAt(0) || 'S'}
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{student?.name}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-indigo-300">
              <span className="font-mono bg-white/10 px-2.5 py-0.5 rounded-full border border-white/10">
                {student?.studentId}
              </span>
              <span>•</span>
              <span>
                Class {student?.classId?.name || '10'}-{student?.section || 'A'}
              </span>
              <span>•</span>
              <span>Roll #{student?.rollNumber || '12'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 p-3.5 rounded-2xl border border-white/10 backdrop-blur">
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-indigo-200 block">Attendance</span>
            <span className="text-xl font-extrabold text-emerald-400">{attendancePercentage}%</span>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center px-2">
            <span className="text-[10px] uppercase font-bold text-indigo-200 block">Avg Grade</span>
            <span className="text-xl font-extrabold text-amber-400">{averageMarks}%</span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Days Present</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {breakdown.present} <span className="text-xs font-normal text-slate-400">/ {breakdown.total}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Days Absent</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {breakdown.absent}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Upcoming Exams</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {upcomingExams.length}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-medium">Due Homework</span>
              <div className="text-2xl font-extrabold text-slate-900 mt-0.5">
                {pendingAssignments.length}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid: Exams & Assignments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exams */}
        <Card title="Upcoming Exams Schedule">
          <div className="space-y-3">
            {upcomingExams.length > 0 ? (
              upcomingExams.map((ex) => (
                <div
                  key={ex._id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{ex.name}</h4>
                    <span className="text-[11px] text-indigo-600 font-semibold">
                      {ex.subjectId?.name || 'Academic Test'}
                    </span>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      Venue: {ex.room || 'Assigned Hall'}
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-slate-600">
                    {new Date(ex.date).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">No upcoming exams scheduled.</p>
            )}
          </div>
        </Card>

        {/* Assignments */}
        <Card title="Pending Assignments">
          <div className="space-y-3">
            {pendingAssignments.length > 0 ? (
              pendingAssignments.map((asg) => (
                <div
                  key={asg._id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{asg.title}</h4>
                    <span className="text-[11px] text-indigo-600 font-semibold">
                      {asg.subjectId?.name || 'Class Assignment'}
                    </span>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {asg.description}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-600">
                    Due: {new Date(asg.dueDate).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400">All assignments up to date!</p>
            )}
          </div>
        </Card>
      </div>

      {/* School Announcements */}
      <Card title="School Notices for Students">
        <div className="space-y-3">
          {notices.length > 0 ? (
            notices.map((ntc) => (
              <div
                key={ntc._id}
                className="p-4 rounded-xl border border-slate-100 bg-white hover:border-indigo-300 transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <Badge variant={ntc.priority === 'high' ? 'danger' : 'primary'} size="sm">
                    {ntc.priority}
                  </Badge>
                  <span className="text-[11px] text-slate-400">
                    {new Date(ntc.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{ntc.title}</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{ntc.content}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400">No active student notices.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
