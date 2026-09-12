import { useState } from 'react';
import { Outlet, Navigate, NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  FileCheck2,
  CalendarCheck2,
  Bell,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

export default function AdminLayout() {
  const { user, loading, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  if (loading) return <Loader fullScreen />;
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Students', href: '/admin/students', icon: Users },
    { name: 'Teachers', href: '/admin/teachers', icon: GraduationCap },
    { name: 'Classes', href: '/admin/classes', icon: School },
    { name: 'Subjects', href: '/admin/subjects', icon: BookOpen },
    { name: 'Admissions', href: '/admin/admissions', icon: FileCheck2 },
    { name: 'Examinations', href: '/admin/examinations', icon: CalendarCheck2 },
    { name: 'Notice Board', href: '/admin/notices', icon: Bell },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      {/* Brand & Nav */}
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="font-display font-bold text-lg tracking-tight text-white">
              Alpha Learning Zone
            </div>
            <div className="text-[10px] font-bold tracking-wider uppercase text-indigo-400">
              Admin Portal
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.end}
                onClick={() => setMobileNavOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User profile & quick links */}
      <div className="pt-6 border-t border-slate-800 space-y-3">
        <Link
          to="/"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            View Public Site
          </span>
        </Link>

        <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {user.name?.charAt(0) || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-100/70">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-slate-900 border-r border-slate-800 p-5 shrink-0 fixed inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-slate-900 p-5 shadow-2xl flex flex-col justify-between">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setMobileNavOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-20 h-16 bg-white/90 backdrop-blur border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block text-xs font-semibold text-slate-500">
              Administrative Control Center
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              System Online
            </span>
            <div className="h-4 w-px bg-slate-200 hidden md:block" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
                {user.name?.charAt(0) || 'A'}
              </div>
              <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                {user.name}
              </span>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
