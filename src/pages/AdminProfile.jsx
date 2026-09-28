import React from 'react';
import AdminLayout from './AdminLayout';
import { useAuth } from '../context/AuthContext';
import { User, ShieldCheck, Mail, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminProfile = () => {
  const { admin, role, isSuperAdmin } = useAuth();

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    toast.success('Security password updated successfully!');
  };

  return (
    <AdminLayout
      title="Admin Account Profile"
      subtitle="TAB 09 // USER PROFILE & ACCESS ROLE"
    >
      <div className="max-w-3xl space-y-6">
        <div className="bg-white border border-stone-200 p-6 rounded-xl shadow-xs flex items-center gap-5">
          <div className="w-16 h-16 bg-stone-900 text-studio-bronze rounded-full flex items-center justify-center font-bold text-xl border-2 border-studio-bronze">
            {admin?.name?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
              {admin?.name || 'Administrator'}
              {isSuperAdmin && <ShieldCheck className="w-5 h-5 text-amber-500" title="Superadmin" />}
            </h2>
            <p className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
              <Mail className="w-3.5 h-3.5 text-stone-400" /> {admin?.email || 'admin@aiterior.com'}
            </p>
            <span className="inline-block mt-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-stone-900 text-studio-bronze">
              Role: {role?.toUpperCase() || 'ADMIN'}
            </span>
          </div>
        </div>

        <form onSubmit={handleUpdatePassword} className="bg-white border border-stone-200 p-6 rounded-xl shadow-xs space-y-4">
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-studio-bronze" /> Update Account Password
          </h3>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Current Password</label>
              <input type="password" required className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-studio-bronze" placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">New Password</label>
              <input type="password" required className="w-full px-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:border-studio-bronze" placeholder="••••••••" />
            </div>
          </div>
          <button type="submit" className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors">
            Update Security Credentials
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProfile;
