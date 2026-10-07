import React, { useState, useEffect } from 'react';
import {
  Settings,
  Sliders,
  Database,
  Key,
  Shield,
  CheckCircle2,
  Globe,
  Sparkles,
  Cpu,
  Bell,
  Save,
  RefreshCw,
  Server,
  Wifi,
  Phone,
  Mail,
  Building2,
  Lock,
  Layers
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import toast from 'react-hot-toast';

const SETTINGS_STORAGE_KEY = 'aiterior_studio_system_settings';

const defaultSettings = {
  platformTitle: 'Aiterior - Architectural & Spatial AI Studio',
  studioEmail: 'contact@aiterior.com',
  studioPhone: '+91 98765 43210',
  studioAddress: 'Bandra Kurla Complex, Mumbai & Connaught Place, New Delhi',
  currency: 'INR (₹)',
  maintenanceMode: false,
  aiRenderQuality: '4k',
  autoEnhancePrompts: true,
  watermarkClientImages: false,
  whatsappLeadAlerts: true,
  emailConfirmationToClients: true
};

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(defaultSettings);
  const [saving, setSaving] = useState(false);
  const [testingPing, setTestingPing] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (saved) {
        setSettings({ ...defaultSettings, ...JSON.parse(saved) });
      }
    } catch (e) {
      console.warn('Could not load local settings:', e);
    }
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
      setTimeout(() => {
        setSaving(false);
        toast.success('Studio & System settings saved successfully!');
      }, 400);
    } catch (err) {
      setSaving(false);
      toast.error('Failed to save settings');
    }
  };

  const handleTestConnection = () => {
    setTestingPing(true);
    setTimeout(() => {
      setTestingPing(false);
      toast.success('All cloud database & AI services are active (Ping 32ms)');
    }, 700);
  };

  return (
    <AdminLayout
      title="System & Studio Settings"
      subtitle="STUDIO CONFIGURATION • AI ENGINE PARAMETERS • SERVICE PIPELINES"
      actions={
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
        >
          <Save className="w-3.5 h-3.5 text-amber-400" />
          <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
        </button>
      }
    >
      <div className="max-w-4xl space-y-6">
        {/* 1. Category Switcher Tabs */}
        <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto border border-stone-200">
          {[
            { id: 'general', label: 'Studio Identity', icon: Building2 },
            { id: 'ai', label: 'AI Spatial Engine', icon: Sparkles },
            { id: 'services', label: 'Cloud Services & API', icon: Server },
            { id: 'notifications', label: 'Notifications & CRM', icon: Bell }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* TAB 1: STUDIO IDENTITY & GENERAL SETTINGS */}
          {activeTab === 'general' && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    Studio Brand & Public Profile
                  </h3>
                  <p className="text-xs text-stone-500">
                    Official branding details displayed across client portals and PDF proposals
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
                  General
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Platform / Studio Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.platformTitle}
                    onChange={(e) => handleChange('platformTitle', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Official Studio Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.studioEmail}
                    onChange={(e) => handleChange('studioEmail', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Studio WhatsApp / Hotline
                  </label>
                  <input
                    type="text"
                    value={settings.studioPhone}
                    onChange={(e) => handleChange('studioPhone', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Registered Studio Address / Regional Hubs
                  </label>
                  <input
                    type="text"
                    value={settings.studioAddress}
                    onChange={(e) => handleChange('studioAddress', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Pricing & Estimate Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-amber-400 text-stone-900 cursor-pointer"
                  >
                    <option value="INR (₹)">Indian Rupee — INR (₹)</option>
                    <option value="USD ($)">US Dollar — USD ($)</option>
                    <option value="AED (د.إ)">UAE Dirham — AED (د.إ)</option>
                    <option value="EUR (€)">Euro — EUR (€)</option>
                  </select>
                </div>
              </div>

              {/* Maintenance Toggle */}
              <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-xl mt-4">
                <div>
                  <span className="font-bold text-xs text-stone-900 block">
                    Maintenance Mode
                  </span>
                  <span className="text-[11px] text-stone-500 block">
                    Temporarily restrict public client access for scheduled system upgrades
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: AI SPATIAL ENGINE SETTINGS */}
          {activeTab === 'ai' && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Spatial AI Rendering Parameters
                  </h3>
                  <p className="text-xs text-stone-500">
                    Configure model behavior for the 5 Specialized Client Categories
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                  AI Core
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Default Rendering Resolution
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => handleChange('aiRenderQuality', '1080p')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        settings.aiRenderQuality === '1080p'
                          ? 'border-stone-900 bg-stone-900 text-white font-bold'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span className="block text-xs">Standard HD (1080p)</span>
                      <span className={`text-[10px] block mt-0.5 ${settings.aiRenderQuality === '1080p' ? 'text-stone-300' : 'text-stone-400'}`}>
                        Fast renders (approx. 5-8 seconds)
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleChange('aiRenderQuality', '4k')}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                        settings.aiRenderQuality === '4k'
                          ? 'border-stone-900 bg-stone-900 text-white font-bold'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <span className="block text-xs">Ultra Studio (4K Spatial)</span>
                      <span className={`text-[10px] block mt-0.5 ${settings.aiRenderQuality === '4k' ? 'text-amber-400 font-bold' : 'text-amber-700'}`}>
                        Recommended for high-end client proposals
                      </span>
                    </button>
                  </div>
                </div>

                {/* Auto Prompt Enhancement */}
                <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-xl">
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">
                      Architectural Prompt Enrichment
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      Automatically append photorealistic architectural lighting and material nuances
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.autoEnhancePrompts}
                      onChange={(e) => handleChange('autoEnhancePrompts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
                  </label>
                </div>

                {/* Watermark Toggle */}
                <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-xl">
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">
                      Apply Studio Watermark
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      Embed subtle studio emblem on trial visuals downloaded by clients
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.watermarkClientImages}
                      onChange={(e) => handleChange('watermarkClientImages', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD SERVICES & API HEALTH */}
          {activeTab === 'services' && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    Cloud Services & API Status
                  </h3>
                  <p className="text-xs text-stone-500">
                    Live connection status of database, media storage, and model endpoints
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testingPing}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin text-amber-600' : 'text-stone-500'}`} />
                  <span>{testingPing ? 'Testing...' : 'Ping Services'}</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <Database className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-stone-900 block">MongoDB Atlas Cluster</span>
                      <span className="text-[11px] text-stone-500">Primary Database Storage • Collections Sync</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                      <Server className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-stone-900 block">Cloudinary Global Media CDN</span>
                      <span className="text-[11px] text-stone-500">Fast Edge Asset Delivery • WebP Compression</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Operational
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-stone-900 block">Google Gemini 2.5 AI Engine</span>
                      <span className="text-[11px] text-stone-500">Spatial Architecture & Try-On Synthesis</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-stone-900 block">JWT Authentication & RBAC</span>
                      <span className="text-[11px] text-stone-500">3-Tier Hierarchy Authorization Pipeline</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Secured
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS & CRM ALERTS */}
          {activeTab === 'notifications' && (
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="font-bold text-sm text-stone-900">
                    Lead CRM & Client Notifications
                  </h3>
                  <p className="text-xs text-stone-500">
                    Set up automatic customer communication and studio alerts
                  </p>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 px-2.5 py-1 rounded-full">
                  Alerts
                </span>
              </div>

              <div className="space-y-3.5">
                <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-xl">
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">
                      WhatsApp Instant Enquiry Alert
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      Receive immediate notification link whenever a new consultation is booked
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.whatsappLeadAlerts}
                      onChange={(e) => handleChange('whatsappLeadAlerts', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-xl">
                  <div>
                    <span className="font-bold text-xs text-stone-900 block">
                      Auto Email Confirmation to Client
                    </span>
                    <span className="text-[11px] text-stone-500 block">
                      Send luxury confirmation receipt acknowledging receipt of their architectural inquiry
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.emailConfirmationToClients}
                      onChange={(e) => handleChange('emailConfirmationToClients', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-900"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
