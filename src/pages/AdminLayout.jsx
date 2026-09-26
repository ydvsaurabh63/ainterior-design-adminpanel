import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import {
  LayoutDashboard,
  Layers,
  PlusCircle,
  MessageSquareQuote,
  Inbox,
  LogOut,
  ExternalLink,
  Users,
  ShieldCheck,
  UserCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children, title, subtitle, actions }) => {
  const { admin, logout, role, isSuperAdmin, isClient } = useAuth();

  // Navigation tailored by role
  let navItems = [];

  if (isClient) {
    navItems = [
      { name: 'My Portal', path: '/client/portal', icon: LayoutDashboard },
      { name: 'Studio Portfolio', path: '/admin/projects', icon: Layers }
    ];
  } else if (isSuperAdmin) {
    navItems = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'All Projects', path: '/admin/projects', icon: Layers },
      { name: 'Add Project', path: '/admin/projects/add', icon: PlusCircle },
      { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
      { name: 'Enquiries', path: '/admin/enquiries', icon: Inbox },
      { name: 'Users & Roles', path: '/admin/users', icon: Users }
    ];
  } else {
    // Regular Admin
    navItems = [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'All Projects', path: '/admin/projects', icon: Layers },
      { name: 'Add Project', path: '/admin/projects/add', icon: PlusCircle },
      { name: 'Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
      { name: 'Enquiries', path: '/admin/enquiries', icon: Inbox },
      { name: 'Manage Clients', path: '/admin/users', icon: Users }
    ];
  }

  // Role display badge configuration
  const getRoleBadge = () => {
    switch (role) {
      case 'superadmin':
        return {
          label: 'Superadmin',
          classes: 'bg-amber-950/80 text-amber-300 border-amber-600/50 shadow-inner'
        };
      case 'client':
        return {
          label: 'Client Portal',
          classes: 'bg-stone-800 text-stone-300 border-stone-700'
        };
      default:
        return {
          label: 'Studio Admin',
          classes: 'bg-stone-800 text-studio-bronze border-stone-700'
        };
    }
  };

  const roleBadge = getRoleBadge();

  return (
    <div className="min-h-screen bg-studio-bg flex flex-col pt-16">
      {/* Top Admin Bar */}
      <header className="fixed top-0 inset-x-0 z-40 bg-studio-charcoal text-white h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-stone-800">
        <div className="flex items-center gap-6">
          <Link to={isClient ? "/client/portal" : "/admin/dashboard"} className="flex items-center gap-2.5">
            <Logo size="sm" variant="dark" showTagline={false} />
            <span
              className={`hidden md:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${roleBadge.classes}`}
            >
              {roleBadge.label}
            </span>
          </Link>

          <a
            href={import.meta.env.VITE_SITE_URL || 'http://localhost:5173'}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col text-right">
            <div className="flex items-center gap-1.5 justify-end">
              <span className="text-xs font-medium text-white">{admin?.name || 'User'}</span>
              {isSuperAdmin && <ShieldCheck className="w-3.5 h-3.5 text-amber-400" title="Superadmin Privileges" />}
              {!isSuperAdmin && !isClient && <UserCheck className="w-3.5 h-3.5 text-studio-bronze" />}
            </div>
            <span className="text-[10px] text-stone-400">{admin?.email}</span>
          </div>

          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs uppercase tracking-wider transition-colors border border-stone-700"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Navigation Ribbon */}
      <div className="bg-white border-b border-studio-border sticky top-16 z-30 shadow-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 sm:gap-6 py-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={
                  item.path === '/admin/dashboard' ||
                  item.path === '/admin/projects' ||
                  item.path === '/client/portal'
                }
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-3 py-2 text-xs uppercase tracking-wider font-semibold transition-colors ${
                    isActive
                      ? 'text-studio-bronze border-b-2 border-studio-bronze font-bold'
                      : 'text-studio-muted hover:text-studio-charcoal'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Page Header */}
        {(title || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-studio-border">
            <div>
              {subtitle && (
                <span className="text-[11px] uppercase tracking-[0.2em] text-studio-bronze font-bold block mb-1">
                  {subtitle}
                </span>
              )}
              {title && (
                <h1 className="text-2xl sm:text-3xl font-serif text-studio-charcoal font-normal">
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
  );
};

export default AdminLayout;
