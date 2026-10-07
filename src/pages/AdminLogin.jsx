import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, ShieldCheck, ArrowLeft, UserCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, role, isClient } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getRoleDashboard = (targetRole) => {
    if (targetRole === 'superadmin') return '/superadmin/dashboard';
    if (targetRole === 'client') return '/client/dashboard';
    return '/admin/dashboard';
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fromPath = location.state?.from?.pathname;
      if (fromPath && fromPath !== '/admin/login' && fromPath !== '/login' && fromPath !== '/') {
        navigate(fromPath, { replace: true });
      } else {
        navigate(getRoleDashboard(role), { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      const targetRole = result.user?.role;
      const fromPath = location.state?.from?.pathname;
      if (fromPath && fromPath !== '/admin/login' && fromPath !== '/login' && fromPath !== '/') {
        navigate(fromPath, { replace: true });
      } else {
        navigate(getRoleDashboard(targetRole), { replace: true });
      }
    }
  };

  const handleFill = (userEmail, userPass) => {
    setEmail(userEmail);
    setPassword(userPass);
  };

  return (
    <div className="min-h-screen bg-studio-bg flex items-center justify-center p-4 pt-16">
      <div className="max-w-md w-full">
        {/* Back link */}
        <div className="mb-6">
          <a
            href={import.meta.env.VITE_SITE_URL || 'https://ainterior-design-frontend.vercel.app'}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-studio-muted hover:text-studio-charcoal transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Website</span>
          </a>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 sm:p-10 border border-studio-border shadow-luxury"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <Logo size="md" className="justify-center mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-studio-charcoal mb-1">
              Studio Portal Access
            </h1>
            <p className="text-xs uppercase tracking-widest text-studio-muted font-medium">
              Superadmin • Admin • Client Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="admin@studio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-studio-charcoal text-white text-xs uppercase tracking-[0.2em] font-semibold hover:bg-studio-bronze transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Role-Based Login Preview & Quick Fill */}
          <div className="mt-8 pt-6 border-t border-studio-border">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] uppercase tracking-wider text-studio-muted font-bold">
                Quick Test Accounts:
              </p>
              <span className="text-[10px] text-amber-700 font-mono font-bold">Auto-Redirects</span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleFill('superadmin@studio.com', 'admin123')}
                className="w-full p-2.5 border border-amber-300 bg-amber-50/70 hover:bg-amber-100/90 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-amber-200/80 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-amber-900" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                      <span>Superadmin</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-amber-200/60 text-amber-900 rounded">superadmin@studio.com</span>
                    </div>
                    <div className="text-[10px] text-amber-800/80">Opens <strong>Superadmin Dashboard</strong></div>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-amber-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  Fill Credentials &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleFill('admin@studio.com', 'admin123')}
                className="w-full p-2.5 border border-stone-300 bg-stone-50 hover:bg-stone-100 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-stone-200 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-stone-800" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <span>Admin</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded">admin@studio.com</span>
                    </div>
                    <div className="text-[10px] text-stone-600">Opens <strong>Admin Dashboard</strong></div>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-stone-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  Fill Credentials &rarr;
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleFill('client@studio.com', 'client123')}
                className="w-full p-2.5 border border-blue-200 bg-blue-50/70 hover:bg-blue-100/90 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded bg-blue-200/70 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-800" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                      <span>Client</span>
                      <span className="text-[9px] font-mono px-1.5 py-0.2 bg-blue-200/60 text-blue-900 rounded">client@studio.com</span>
                    </div>
                    <div className="text-[10px] text-blue-700">Opens <strong>Client Dashboard</strong></div>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity">
                  Fill Credentials &rarr;
                </span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
