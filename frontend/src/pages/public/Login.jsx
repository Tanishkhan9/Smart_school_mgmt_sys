import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  GraduationCap,
  Shield,
  UserCheck,
  Sparkles,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/Button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingRole, setLoadingRole] = useState(null);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleQuickLogin = async (roleEmail, roleName) => {
    setError('');
    setLoadingRole(roleName);
    setEmail(roleEmail);
    setPassword('SmartSchool@123');
    try {
      const user = await login(roleEmail, 'SmartSchool@123');
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else if (user.role === 'student') navigate('/student');
      else navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please ensure the backend server is running.'
      );
    } finally {
      setLoadingRole(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoadingRole('manual');
    try {
      const user = await login(email, password);
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'teacher') navigate('/teacher');
      else if (user.role === 'student') navigate('/student');
      else navigate('/');
    } catch (err) {
      if (!err.response) {
        setError('Cannot connect to backend server. Make sure the backend is running and reachable.');
      } else {
        setError(err.response?.data?.message || 'Invalid email or password.');
      }
    } finally {
      setLoadingRole(null);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to School Website
        </Link>

        {/* Card */}
        <div className="rounded-3xl bg-white border border-slate-200/80 shadow-xl shadow-slate-200/50 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white mx-auto shadow-lg shadow-indigo-500/25 mb-4">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Portal Sign In
            </h2>
            <p className="text-xs text-slate-500 mt-1.5">
              Access your personalized SmartSchool management dashboard
            </p>
          </div>

          {/* 1-Click Demo Login Switcher */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Instant 1-Click Role Login</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleQuickLogin('admin@smartschool.test', 'admin')}
                disabled={loadingRole !== null}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-indigo-200/80 hover:border-indigo-500 hover:shadow-xs transition-all text-center group cursor-pointer disabled:opacity-50"
              >
                <Shield className="w-4 h-4 text-indigo-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">Admin</span>
                <span className="text-[10px] text-slate-400">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('teacher@smartschool.test', 'teacher')}
                disabled={loadingRole !== null}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-indigo-200/80 hover:border-indigo-500 hover:shadow-xs transition-all text-center group cursor-pointer disabled:opacity-50"
              >
                <UserCheck className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">Teacher</span>
                <span className="text-[10px] text-slate-400">Class Staff</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleQuickLogin('student@smartschool.test', 'student')}
                disabled={loadingRole !== null}
                className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-white border border-indigo-200/80 hover:border-indigo-500 hover:shadow-xs transition-all text-center group cursor-pointer disabled:opacity-50"
              >
                <GraduationCap className="w-4 h-4 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-slate-800">Student</span>
                <span className="text-[10px] text-slate-400">Class 10-A</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold tracking-wider uppercase text-slate-400 shrink-0">
              Or with credentials
            </span>
            <div className="border-t border-slate-200 w-full" />
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@smartschool.test"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Default: SmartSchool@123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-300 pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loadingRole === 'manual'}
              className="w-full mt-2"
            >
              Sign In to Portal
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
