import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Briefcase,
  Layers,
  FolderGit2,
  Compass,
  Plane,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Sun,
  Moon,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { isSupabaseConfigured } from '../lib/supabase';

export const AdminLayout: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Authentication Guard: Redirect to /admin/login if not logged in
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900 text-white">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Perfil & Hero', path: '/admin/profile', icon: User },
    { name: 'Experiencia', path: '/admin/experience', icon: Briefcase },
    { name: 'Tecnologías', path: '/admin/technologies', icon: Layers },
    { name: 'Proyectos', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Viajes', path: '/admin/travel', icon: Compass },
    { name: 'Aviación', path: '/admin/aviation', icon: Plane },
    { name: 'Mensajes', path: '/admin/messages', icon: Mail },
    { name: 'Configuración & SQL', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') {
      return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex bg-neutral-950 text-neutral-100 selection:bg-sky-500 selection:text-white">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        id="admin-sidebar"
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-neutral-900 border-r border-neutral-800 flex flex-col justify-between transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Admin Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight">Admin Console</h1>
                <p className="text-[10px] text-sky-400 font-mono">Panel de Control</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 text-neutral-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-190px)]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  id={`admin-nav-${item.name.toLowerCase().replace(/[\s&]+/g, '-')}`}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-neutral-400 hover:bg-neutral-800/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Badge & Logout */}
        <div className="p-4 border-t border-neutral-800 space-y-3 bg-neutral-900/50">
          <div className="flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.email}</p>
              <p className="text-[10px] text-emerald-400 font-mono">
                {isSupabaseConfigured() ? 'Supabase Live' : 'Modo Administrador'}
              </p>
            </div>
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-neutral-400 hover:text-sky-400 transition-colors"
              title="Ver sitio público en nueva pestaña"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg text-neutral-400 hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>Admin</span>
              <span>/</span>
              <span className="text-white font-medium capitalize">
                {location.pathname.split('/admin/')[1] || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-neutral-400 hover:text-white bg-neutral-800/80 transition-colors"
              title="Alternar tema del sistema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
            </button>

            <Link
              to="/"
              className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 rounded-xl border border-neutral-700 transition-colors"
            >
              <span>Ver Web Pública</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
