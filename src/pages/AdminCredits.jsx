import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Coins, Plus, Zap, History, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCredits = () => {
  const [credits, setCredits] = useState(2500);

  const handleAddCredits = (amount) => {
    setCredits((prev) => prev + amount);
    toast.success(`Allocated +${amount} AI Generation Credits`);
  };

  return (
    <AdminLayout
      title="AI Credits & Token Allocation"
      subtitle="TAB 07 // GENERATION BALANCE & SYSTEM LIMITS"
      actions={
        <button
          onClick={() => handleAddCredits(500)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" /> Allocate +500 Credits
        </button>
      }
    >
      <div className="space-y-6">
        {/* Credits Stat Banner */}
        <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-stone-800">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-studio-bronze/20 border border-studio-bronze/40 rounded-xl flex items-center justify-center text-studio-bronze">
              <Coins className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs uppercase tracking-widest text-stone-400 font-bold">Total Studio Generation Pool</span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight">{credits.toLocaleString()} <span className="text-sm font-normal text-studio-bronze">Credits Available</span></h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => handleAddCredits(100)} className="px-3.5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-lg border border-stone-700">
              +100 Quick Top-up
            </button>
            <button onClick={() => handleAddCredits(1000)} className="px-4 py-2 bg-studio-bronze hover:bg-studio-bronzeDark text-white text-xs font-bold uppercase tracking-wider rounded-lg">
              +1000 Bulk Pack
            </button>
          </div>
        </div>

        {/* System Usage Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-xs">
            <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">Cost Per Render</span>
            <div className="text-2xl font-bold text-stone-900 mt-1">5 Credits</div>
            <p className="text-xs text-stone-500 mt-1">High-definition spatial photorealism render</p>
          </div>
          <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-xs">
            <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">Used This Month</span>
            <div className="text-2xl font-bold text-stone-900 mt-1">480 Renders</div>
            <p className="text-xs text-stone-500 mt-1">2,400 credits consumed by client try-ons</p>
          </div>
          <div className="bg-white border border-stone-200 p-5 rounded-xl shadow-xs">
            <span className="text-xs font-bold uppercase text-stone-400 tracking-wider">Monthly Renewal</span>
            <div className="text-2xl font-bold text-emerald-600 mt-1">Active Auto-Fill</div>
            <p className="text-xs text-stone-500 mt-1">Resets to 5,000 on 1st of every month</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCredits;
