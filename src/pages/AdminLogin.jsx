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

  useEffect(() => {
    if (isAuthenticated) {
      if (isClient) {
        navigate('/client/portal', { replace: true });
      } else {
        const dest = location.state?.from?.pathname || '/admin/dashboard';
        navigate(dest === '/admin/login' ? '/admin/dashboard' : dest, { replace: true });
      }
    }
  }, [isAuthenticated, isClient, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      if (result.user?.role === 'client') {
        navigate('/client/portal', { replace: true });
      } else {
        const dest = location.state?.from?.pathname || '/admin/dashboard';
        navigate(dest === '/admin/login' ? '/admin/dashboard' : dest, { replace: true });
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
            href={import.meta.env.VITE_SITE_URL || 'http://localhost:5173'}
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
            <h1 className="font-serif text-2xl text-studio-charcoal mb-1">
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

          {/* Demo Roles Quick Fill */}
          <div className="mt-8 pt-6 border-t border-studio-border">
            <p className="text-[11px] uppercase tracking-wider text-studio-muted font-bold text-center mb-3">
              Quick Test Accounts:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFill('superadmin@studio.com', 'admin123')}
                className="p-2 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-left transition-colors flex flex-col items-center text-center"
              >
                <ShieldCheck className="w-4 h-4 text-amber-700 mb-1" />
                <span className="text-[10px] uppercase font-bold text-amber-900">Superadmin</span>
              </button>

              <button
                type="button"
                onClick={() => handleFill('admin@studio.com', 'admin123')}
                className="p-2 border border-stone-300 bg-stone-50 hover:bg-stone-100 text-left transition-colors flex flex-col items-center text-center"
              >
                <UserCheck className="w-4 h-4 text-studio-bronze mb-1" />
                <span className="text-[10px] uppercase font-bold text-stone-800">Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleFill('client@studio.com', 'client123')}
                className="p-2 border border-blue-200 bg-blue-50 hover:bg-blue-100 text-left transition-colors flex flex-col items-center text-center"
              >
                <User className="w-4 h-4 text-blue-700 mb-1" />
                <span className="text-[10px] uppercase font-bold text-blue-900">Client</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;
