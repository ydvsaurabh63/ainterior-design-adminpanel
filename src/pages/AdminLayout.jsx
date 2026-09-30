import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import {
  LayoutDashboard,
  Palette,
  Wand2,
  Sparkles,
  LayoutTemplate,
  Inbox,
  Coins,
  HelpCircle,
  User,
  Settings,
  Layers,
  Users,
  LogOut,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children, title, subtitle, actions }) => {
  const { admin, logout, role, isSuperAdmin, isClient } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // 10 Tabs Configuration tailored by Role
  const mainNavItems = [
    { id: 'overview', name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { id: 'catalog', name: 'Catalog', path: '/admin/catalog', icon: Palette },
    { id: 'playground', name: 'Playground', path: '/admin/playground', icon: Wand2, badge: 'AI Test' },
    { id: 'use-cases', name: 'Use Cases', path: '/admin/use-cases', icon: Sparkles },
    { id: 'templates', name: 'Templates', path: '/admin/templates', icon: LayoutTemplate }
  ];

  const managementNavItems = [
    { id: 'enquiry', name: 'Enquiry', path: '/admin/enquiries', icon: Inbox },
    { id: 'credits', name: 'Credits', path: '/admin/credits', icon: Coins, badge: 'Pool' },
    { id: 'projects', name: 'Projects Portfolio', path: '/admin/projects', icon: Layers },
    ...(isSuperAdmin || !isClient
      ? [{ id: 'users', name: 'Users & Roles', path: '/admin/users', icon: Users }]
      : [])
  ];

  const utilityNavItems = [
    { id: 'help', name: 'Help', path: '/admin/help', icon: HelpCircle },
    { id: 'profile', name: 'Profile', path: '/admin/profile', icon: User },
    { id: 'settings', name: 'Settings', path: '/admin/settings', icon: Settings }
  ];

  // Role Badge Styling
  const getRoleBadge = () => {
    switch (role) {
      case 'superadmin':
        return {
          label: 'Super Admin',
          classes: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
        };
      case 'client':
        return {
          label: 'Client Portal',
          classes: 'bg-stone-800 text-stone-300 border-stone-700'
        };
      default:
        return {
          label: 'Studio Admin',
          classes: 'bg-studio-bronze/20 text-studio-bronze border-studio-bronze/40'
        };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="min-h-screen bg-stone-100 flex text-stone-900 font-sans">
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ========================================================
          LEFT SIDEBAR NAVIGATION (Strict Left Side Position)
          ======================================================== */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#141416] text-stone-300 flex flex-col justify-between border-r border-stone-800/90 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Top Brand Header */}
          <div className="h-16 px-5 border-b border-stone-800/80 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2">
              <Logo size="sm" variant="dark" showTagline={false} />
            </Link>
            <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${roleBadge.classes}`}>
              {roleBadge.label}
            </span>
          </div>

          {/* Navigation Groups */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-140px)] scrollbar-none">
            {/* Group 1: MAIN DASHBOARD */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                MAIN DASHBOARD
              </div>
              <div className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                          isActive
                            ? 'bg-studio-bronze/15 text-studio-bronze border-l-4 border-studio-bronze font-bold shadow-xs'
                            : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-studio-bronze/20 text-studio-bronze rounded border border-studio-bronze/30">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Group 2: MANAGEMENT & CRM */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                MANAGEMENT & CRM
              </div>
              <div className="space-y-1">
                {managementNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                          isActive
                            ? 'bg-studio-bronze/15 text-studio-bronze border-l-4 border-studio-bronze font-bold shadow-xs'
                            : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 bg-emerald-950 text-emerald-400 rounded border border-emerald-800">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>

            {/* Group 3: ACCOUNT & SYSTEM */}
            <div>
              <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
                ACCOUNT & SYSTEM
              </div>
              <div className="space-y-1">
                {utilityNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                          isActive
                            ? 'bg-studio-bronze/15 text-studio-bronze border-l-4 border-studio-bronze font-bold shadow-xs'
                            : 'text-stone-400 hover:text-stone-100 hover:bg-stone-800/60'
                        }`
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.name}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="p-3 border-t border-stone-800/80 bg-stone-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5 truncate">
            <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-xs font-bold text-studio-bronze">
              {admin?.name?.substring(0, 1) || 'A'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-stone-200 truncate">{admin?.name || 'Admin'}</div>
              <div className="text-[10px] text-stone-500 truncate">{admin?.email}</div>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="p-1.5 text-stone-400 hover:text-rose-400 hover:bg-stone-800 rounded transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ========================================================
          MAIN CONTENT AREA (Right Side Layout offset by Left Sidebar)
          ======================================================== */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-stone-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
              <span className="font-bold text-stone-900">Admin Studio</span>
              <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
              <span className="text-studio-bronze font-semibold">{title || 'Dashboard'}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={import.meta.env.VITE_SITE_URL || 'https://ainterior-design-frontend.vercel.app'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-700 hover:text-stone-900 text-xs font-semibold rounded-lg transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
            </a>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {(title || actions) && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-200">
              <div>
                {subtitle && (
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-studio-bronze block mb-1">
                    {subtitle}
                  </span>
                )}
                {title && (
                  <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
                    {title}
                  </h1>
                )}
              </div>
              {actions && <div className="flex items-center gap-3">{actions}</div>}
            </div>
          )}

          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
