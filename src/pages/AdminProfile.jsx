import React, { useState, useEffect } from 'react';
import {
  User,
  ShieldCheck,
  Mail,
  Key,
  Phone,
  Building2,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  Shield,
  Layers,
  Save
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../services/api';
import toast from 'react-hot-toast';

const AdminProfile = () => {
  const { admin, role, isSuperAdmin, isAdmin, isClient, updateProfileState } = useAuth();

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: admin?.name || '',
    companyName: admin?.companyName || '',
    email: admin?.email || '',
    phone: admin?.phone || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (admin) {
      setProfileData({
        name: admin.name || '',
        companyName: admin.companyName || '',
        email: admin.email || '',
        phone: admin.phone || ''
      });
    }
  }, [admin]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!profileData.name.trim()) {
      toast.error('Full Name is required');
      return;
    }

    setSavingProfile(true);
    try {
      const payload = {
        name: profileData.name.trim(),
        companyName: profileData.companyName.trim(),
        phone: profileData.phone.trim()
      };

      if (admin?._id) {
        const updated = await userApi.update(admin._id, payload);
        if (updateProfileState) {
          updateProfileState(updated || payload);
        }
        toast.success('Profile details updated successfully');
      }
    } catch (err) {
      console.error('Profile update error:', err);
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSavingPassword(true);
    try {
      if (admin?._id) {
        await userApi.update(admin._id, {
          password: passwordData.newPassword.trim()
        });
        toast.success('Security password changed successfully');
        setPasswordData({ newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      console.error('Password update error:', err);
      toast.error(err.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <AdminLayout
      title="My Account Profile"
      subtitle="IDENTITY • STUDIO CREDENTIALS • SECURITY SETTINGS"
    >
      <div className="max-w-4xl space-y-6">
        {/* 1. Profile Identity Hero Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-stone-900 text-amber-400 rounded-2xl flex items-center justify-center font-extrabold text-2xl border border-stone-800 shadow-sm">
                {admin?.name?.substring(0, 2).toUpperCase() || 'AD'}
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center" title="Active & Verified">
                <span className="w-2 h-2 bg-white rounded-full" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                  {admin?.name || 'Administrator'}
                </h2>
                {isSuperAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                    Superadmin
                  </span>
                ) : isAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-300">
                    <Shield className="w-3.5 h-3.5 text-stone-700" />
                    Regional Admin
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    Client Studio
                  </span>
                )}
              </div>

              {admin?.companyName && (
                <p className="text-xs font-semibold text-blue-800 mt-0.5">
                  🏢 {admin.companyName}
                </p>
              )}

              <div className="flex items-center gap-4 text-xs text-stone-500 mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  {admin?.email || 'admin@aiterior.com'}
                </span>
                {admin?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    {admin.phone}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200/80 rounded-xl p-3 text-xs w-full sm:w-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-0.5">
              Access Level
            </span>
            <span className="font-bold text-stone-900 block">
              {isSuperAdmin ? '👑 Master RBAC Owner' : isAdmin ? '🛡️ Regional Branch Admin' : '📐 Studio Portal'}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Verified Session
            </span>
          </div>
        </div>

        {/* 2. Form Grid (Personal Details & Password Update) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: Studio Profile Details */}
          <form
            onSubmit={handleUpdateProfile}
            className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-amber-700" />
                  <h3 className="font-bold text-sm text-stone-900">
                    Personal & Studio Details
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                  Basic Info
                </span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                    placeholder="e.g. Rajesh Sharma"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Studio / Organization Name
                  </label>
                  <input
                    type="text"
                    value={profileData.companyName}
                    onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                    placeholder="e.g. Mumbai Design Studio"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled
                    value={profileData.email}
                    className="w-full px-3 py-2 text-xs bg-stone-100 border border-stone-200 rounded-lg text-stone-500 cursor-not-allowed"
                    title="Email is fixed for account identification"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Account email is locked for security.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Contact / WhatsApp Phone
                  </label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5 text-amber-400" />
                <span>{savingProfile ? 'Saving Details...' : 'Save Profile Details'}</span>
              </button>
            </div>
          </form>

          {/* Card B: Security Password Update */}
          <form
            onSubmit={handleUpdatePassword}
            className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-700" />
                  <h3 className="font-bold text-sm text-stone-900">
                    Security Credentials
                  </h3>
                </div>
                <span className="text-[10px] font-bold uppercase text-stone-400 tracking-wider">
                  Password
                </span>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    New Security Password * (Min 6 chars)
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-3 py-2 pr-10 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                      placeholder="Enter new strong password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                    placeholder="Repeat new password"
                  />
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-1">
                  <span className="text-[11px] font-bold text-stone-700 block">
                    Password Security Standards:
                  </span>
                  <ul className="text-[10px] text-stone-500 space-y-0.5 list-disc list-inside">
                    <li>Minimum 6 characters long</li>
                    <li>Never share your credentials with unauthorized personnel</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100">
              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>{savingPassword ? 'Updating Password...' : 'Update Security Password'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* 3. Role Privileges & Access Overview */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Assigned Permissions & Capabilities</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Portfolio & Projects</span>
              </span>
              <p className="text-[11px] text-stone-500">
                Full authority to publish, edit, and categorize projects live across client showcases.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Customer Leads CRM</span>
              </span>
              <p className="text-[11px] text-stone-500">
                Access incoming consultations, WhatsApp direct chat, and stage pipelines.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-xl p-3.5 space-y-1">
              <span className="font-bold text-stone-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Spatial AI Engine</span>
              </span>
              <p className="text-[11px] text-stone-500">
                Generate high-resolution interior renders across the 5 Specialized Client Sectors.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
