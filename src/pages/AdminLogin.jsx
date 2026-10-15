import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  UserCheck,
  User,
  Sparkles,
  ShieldAlert,
  Building2,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const PORTAL_CONFIG = {
  superadmin: {
    portalId: 'superadmin',
    title: 'Superadmin Master Portal',
    badge: 'Executive Level Access',
    subtitle: 'Direct high-level access to system configurations, admin roles & database',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
    primaryColor: 'bg-amber-600 hover:bg-amber-700 text-white',
    icon: ShieldAlert,
    iconBg: 'bg-amber-500/10 text-amber-600',
    allowedRoleText: 'Superadmin credentials required',
    destination: '/superadmin/dashboard'
  },
  admin: {
    portalId: 'admin',
    title: 'Studio Admin Portal',
    badge: 'Operations & Management',
    subtitle: 'Manage client catalogs, design projects, and studio operations',
    badgeColor: 'bg-stone-200 text-stone-800 border-stone-300',
    primaryColor: 'bg-studio-charcoal hover:bg-studio-bronze text-white',
    icon: Building2,
    iconBg: 'bg-stone-500/10 text-stone-700',
    allowedRoleText: 'Studio Administrator credentials required',
    destination: '/admin/dashboard'
  },
  client: {
    portalId: 'client',
    title: 'Client Private Space',
    badge: 'Exclusive Client Portal',
    subtitle: 'View your customized room designs, quotes & product selections',
    badgeColor: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    primaryColor: 'bg-studio-bronze hover:bg-studio-bronze-dark text-white',
    icon: Sparkles,
    iconBg: 'bg-amber-500/10 text-studio-bronze',
    allowedRoleText: 'Registered Client credentials required',
    destination: '/client/dashboard'
  }
};

const AdminLogin = ({ portal }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isAuthenticated, role, logout } = useAuth();

  // Determine active portal: from prop or current pathname
  const activePortal =
    portal ||
    (location.pathname.startsWith('/superadmin')
      ? 'superadmin'
      : location.pathname.startsWith('/client')
      ? 'client'
      : 'admin');

  const config = PORTAL_CONFIG[activePortal] || PORTAL_CONFIG.admin;
  const PortalIcon = config.icon;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // If already authenticated with the correct role, redirect to target dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const fromPath = location.state?.from?.pathname;
      if (fromPath && !fromPath.includes('/login') && fromPath !== '/') {
        navigate(fromPath, { replace: true });
      } else {
        if (role === 'superadmin') navigate('/superadmin/dashboard', { replace: true });
        else if (role === 'client') navigate('/client/dashboard', { replace: true });
        else navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, role, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(email, password, activePortal);
    setLoading(false);

    if (result.success) {
      const userRole = result.user?.role;
      // Client-side safety check if mismatch
      if (activePortal === 'superadmin' && userRole !== 'superadmin') {
        logout(false);
        return;
      }
      if (activePortal === 'admin' && userRole !== 'admin' && userRole !== 'superadmin') {
        logout(false);
        return;
      }
      if (activePortal === 'client' && userRole !== 'client') {
        logout(false);
        return;
      }

      const fromPath = location.state?.from?.pathname;
      if (fromPath && !fromPath.includes('/login') && fromPath !== '/') {
        navigate(fromPath, { replace: true });
      } else {
        if (userRole === 'superadmin') navigate('/superadmin/dashboard', { replace: true });
        else if (userRole === 'client') navigate('/client/dashboard', { replace: true });
        else navigate('/admin/dashboard', { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-studio-bg flex flex-col justify-center items-center p-4 py-12">
      <div className="max-w-md w-full">
        {/* Top Back Link & Portal Switcher */}
        <div className="mb-6 flex items-center justify-between">
          <a
            href={import.meta.env.VITE_SITE_URL || 'https://ainterior-design-frontend.vercel.app'}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-studio-muted hover:text-studio-charcoal transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </a>

          {/* Quick switcher buttons */}
          <div className="flex items-center gap-1.5 bg-stone-200/60 p-1 rounded border border-studio-border text-[11px] font-medium">
            <Link
              to="/superadmin/login"
              className={`px-2 py-0.5 rounded transition-all ${
                activePortal === 'superadmin'
                  ? 'bg-amber-500 text-white shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Superadmin
            </Link>
            <Link
              to="/admin/login"
              className={`px-2 py-0.5 rounded transition-all ${
                activePortal === 'admin'
                  ? 'bg-stone-900 text-white shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Admin
            </Link>
            <Link
              to="/client/login"
              className={`px-2 py-0.5 rounded transition-all ${
                activePortal === 'client'
                  ? 'bg-studio-bronze text-white shadow-sm font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Client
            </Link>
          </div>
        </div>

        <motion.div
          key={activePortal}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="bg-white p-8 sm:p-10 border border-studio-border shadow-luxury relative overflow-hidden"
        >
          {/* Subtle Top Accent Bar */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 ${
              activePortal === 'superadmin'
                ? 'bg-amber-500'
                : activePortal === 'client'
                ? 'bg-studio-bronze'
                : 'bg-studio-charcoal'
            }`}
          />

          {/* Header */}
          <div className="text-center mb-8">
            <Logo size="md" className="justify-center mx-auto mb-4" />

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border mb-3 tracking-wide uppercase shadow-2xs font-mono">
              <span className={`w-2 h-2 rounded-full ${
                activePortal === 'superadmin' ? 'bg-amber-500' : activePortal === 'client' ? 'bg-studio-bronze' : 'bg-stone-600'
              }`} />
              <span className={
                activePortal === 'superadmin' ? 'text-amber-800' : activePortal === 'client' ? 'text-stone-700' : 'text-stone-700'
              }>
                {config.badge}
              </span>
            </div>

            <h1 className="font-serif text-2xl font-semibold tracking-tight text-studio-charcoal mb-1.5">
              {config.title}
            </h1>
            <p className="text-xs text-studio-muted font-normal leading-relaxed max-w-sm mx-auto">
              {config.subtitle}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder={
                    activePortal === 'superadmin'
                      ? 'superadmin@studio.com'
                      : activePortal === 'client'
                      ? 'client@studio.com'
                      : 'admin@studio.com'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                  Security Password
                </label>
                <Link
                  to={`/forgot-password?portal=${activePortal}${email ? `&email=${encodeURIComponent(email)}` : ''}`}
                  className="text-[11px] text-studio-bronze hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
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

            <div className="text-[11px] text-studio-muted flex items-center justify-between pt-1">
              <span className="flex items-center gap-1 font-mono text-[10px]">
                <KeyRound className="w-3 h-3 text-studio-muted" />
                {config.allowedRoleText}
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer ${config.primaryColor}`}
            >
              {loading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Sign In To {activePortal === 'superadmin' ? 'Superadmin' : activePortal === 'client' ? 'Client Space' : 'Admin Panel'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Bottom Help / Alternative Portal Links */}
        <div className="mt-6 text-center text-xs text-studio-muted space-x-3">
          {activePortal !== 'superadmin' && (
            <Link
              to="/superadmin/login"
              className="hover:text-studio-charcoal transition-colors underline-offset-4 hover:underline"
            >
              Superadmin Portal
            </Link>
          )}
          {activePortal !== 'admin' && (
            <Link
              to="/admin/login"
              className="hover:text-studio-charcoal transition-colors underline-offset-4 hover:underline"
            >
              Admin Portal
            </Link>
          )}
          {activePortal !== 'client' && (
            <Link
              to="/client/login"
              className="hover:text-studio-charcoal transition-colors underline-offset-4 hover:underline"
            >
              Client Space
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
