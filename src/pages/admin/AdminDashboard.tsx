import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Compass,
  Plane,
  Mail,
  Plus,
  ArrowRight,
  Briefcase,
  Layers,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { statsService } from '../../services/statsService';
import { DashboardStats } from '../../types';
import { isSupabaseConfigured } from '../../lib/supabase';
import { SEO } from '../../components/SEO';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await statsService.getStats();
        setStats(data);
      } catch (e) {
        console.error('Error loading dashboard stats:', e);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      <SEO title="Dashboard Administrativo | Mateo Largo" description="Resumen general del sitio y estadísticas." />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Panel de Control
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Gestión centralizada de contenidos, bitácoras, registros de aviación y mensajes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono font-semibold ${
              isSupabaseConfigured()
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                : 'bg-amber-950/80 text-amber-300 border border-amber-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            {isSupabaseConfigured() ? 'Supabase Conectado' : 'Almacenamiento Local'}
          </span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Projects */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Proyectos</span>
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{loading ? '-' : stats?.projectsCount ?? 0}</p>
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-neutral-500">Software & Apps</span>
            <Link to="/admin/projects" className="text-sky-400 hover:underline flex items-center gap-1">
              Gestionar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Travels */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Bitácoras de Viaje</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Compass className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{loading ? '-' : stats?.travelsCount ?? 0}</p>
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-neutral-500">Destinos registrados</span>
            <Link to="/admin/travel" className="text-emerald-400 hover:underline flex items-center gap-1">
              Gestionar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Aviation Spotting */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Aeronaves Spotting</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{loading ? '-' : stats?.aviationCount ?? 0}</p>
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-neutral-500">Fotografía aeronáutica</span>
            <Link to="/admin/aviation" className="text-indigo-400 hover:underline flex items-center gap-1">
              Gestionar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Messages */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-400 uppercase">Mensajes Recibidos</span>
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-white">{loading ? '-' : stats?.unreadMessagesCount ?? 0}</p>
          <div className="flex items-center justify-between pt-2 text-xs">
            <span className={`font-semibold ${(stats?.unreadMessagesCount ?? 0) > 0 ? 'text-rose-400' : 'text-neutral-500'}`}>
              {(stats?.unreadMessagesCount ?? 0) > 0 ? `${stats?.unreadMessagesCount} sin leer` : 'Al día'}
            </span>
            <Link to="/admin/messages" className="text-rose-400 hover:underline flex items-center gap-1">
              Buzón <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-sky-400" />
          <span>Acciones Rápidas</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          <Link
            to="/admin/projects"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-neutral-800 hover:bg-sky-600 text-neutral-200 hover:text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proyecto</span>
          </Link>

          <Link
            to="/admin/travel"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-neutral-800 hover:bg-emerald-600 text-neutral-200 hover:text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Viaje</span>
          </Link>

          <Link
            to="/admin/aviation"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-neutral-800 hover:bg-indigo-600 text-neutral-200 hover:text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Avión</span>
          </Link>

          <Link
            to="/admin/experience"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-neutral-800 hover:bg-purple-600 text-neutral-200 hover:text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Experiencia</span>
          </Link>

          <Link
            to="/admin/technologies"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-neutral-800 hover:bg-amber-600 text-neutral-200 hover:text-white text-xs font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tecnología</span>
          </Link>
        </div>
      </div>

      {/* Admin Modules Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Perfil & Bio */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Perfil & Biografía</h3>
            <p className="text-xs text-neutral-400">
              Edita tu nombre, foto de perfil, descripción corta, intereses y enlaces a redes sociales.
            </p>
            <Link
              to="/admin/profile"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:underline pt-2"
            >
              Editar Perfil <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Module 2: Configuración & SQL */}
        <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white">Configuración & Schema SQL</h3>
            <p className="text-xs text-neutral-400">
              Verifica el estado de las variables de entorno, revisa el script SQL para Supabase y gestiona la caché.
            </p>
            <Link
              to="/admin/settings"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:underline pt-2"
            >
              Abrir Configuración <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
