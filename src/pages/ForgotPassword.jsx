import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { authApi } from '../services/api';
import Logo from '../components/Logo';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const portalParam = searchParams.get('portal') || 'admin';
  const returnLoginUrl =
    portalParam === 'superadmin'
      ? '/superadmin/login'
      : portalParam === 'client'
      ? '/client/login'
      : '/admin/login';

  // Step 1: 'email', Step 2: 'otp', Step 3: 'new_password', Step 4: 'success'
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Timer for resend OTP cooldown
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  // STEP 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your registered email address');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      toast.success(res.message || 'OTP sent to your email');
      setStep(2);
      setResendCooldown(60);
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setLoading(true);
    try {
      const res = await authApi.forgotPassword(email.trim());
      toast.success('A new OTP has been sent to your email');
      setResendCooldown(60);
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      toast.error('Please enter the 6-digit OTP code');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.verifyOtp(email.trim(), cleanOtp);
      toast.success(res.message || 'OTP verified successfully');
      setStep(3);
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword(email.trim(), otp.trim(), newPassword);
      toast.success(res.message || 'Password reset successful!');
      setStep(4);
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate(returnLoginUrl);
      }, 2500);
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-studio-bg flex flex-col justify-center items-center p-4 py-12">
      <div className="max-w-md w-full">
        {/* Top Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={returnLoginUrl}
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-studio-muted hover:text-studio-charcoal transition-colors font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Sign In</span>
          </Link>
          <span className="text-[11px] font-mono text-stone-500 uppercase">
            Step {step} of 3
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 sm:p-10 border border-studio-border shadow-luxury relative overflow-hidden"
        >
          {/* Top Gold Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-studio-bronze" />

          {/* Logo & Header */}
          <div className="text-center mb-8">
            <Logo size="md" className="justify-center mx-auto mb-4" />
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-studio-charcoal mb-1.5">
              Reset Security Password
            </h1>
            <p className="text-xs text-studio-muted leading-relaxed">
              {step === 1 && 'Enter your registered email to receive a 6-digit verification code.'}
              {step === 2 && `Enter the 6-digit code sent to ${email}`}
              {step === 3 && 'Create a strong, new security password for your account.'}
              {step === 4 && 'Your password has been successfully updated.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {/* ================= STEP 1: ENTER EMAIL ================= */}
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleSendOtp}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="user@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-studio-charcoal hover:bg-studio-bronze text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Sending Verification Code...</span>
                  ) : (
                    <>
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* ================= STEP 2: ENTER OTP ================= */}
            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleVerifyOtp}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs uppercase tracking-wider font-semibold text-studio-charcoal">
                      6-Digit OTP Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[11px] text-studio-bronze hover:underline"
                    >
                      Change Email
                    </button>
                  </div>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      maxLength={6}
                      pattern="[0-9]{6}"
                      required
                      autoFocus
                      placeholder="••••••"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-10 pr-4 py-3 bg-studio-bg border border-studio-border text-lg tracking-[0.4em] font-mono text-center text-studio-charcoal focus:outline-none focus:border-studio-bronze transition-colors font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-studio-muted pt-1">
                  <span>Didn't receive code?</span>
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleResendOtp}
                    className="text-xs font-semibold text-studio-bronze hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3.5 bg-studio-charcoal hover:bg-studio-bronze text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Verifying Code...</span>
                  ) : (
                    <>
                      <span>Verify OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* ================= STEP 3: NEW PASSWORD ================= */}
            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleResetPassword}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                    New Security Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-studio-muted hover:text-studio-charcoal"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-semibold text-studio-charcoal mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-studio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-studio-bg border border-studio-border text-sm text-studio-charcoal focus:outline-none focus:border-studio-bronze transition-colors"
                    />
                  </div>
                </div>

                <div className="text-[11px] text-stone-500 font-mono">
                  Password requirement: Minimum 6 characters
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-studio-bronze hover:bg-studio-bronze-dark text-white text-xs uppercase tracking-[0.2em] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <span>Updating Password...</span>
                  ) : (
                    <>
                      <span>Save New Password</span>
                      <ShieldCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              </motion.form>
            )}

            {/* ================= STEP 4: SUCCESS ================= */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-stone-900">
                  Password Updated!
                </h3>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Your new security password is saved. Redirecting you to sign in automatically...
                </p>
                <div className="pt-2">
                  <Link
                    to={returnLoginUrl}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-studio-charcoal text-white text-xs uppercase tracking-wider font-semibold hover:bg-studio-bronze transition-colors"
                  >
                    <span>Go To Sign In Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Security assurance footer */}
        <div className="mt-6 text-center text-xs text-studio-muted flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400" />
          <span>Protected with 256-bit encryption & temporary one-time password</span>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
