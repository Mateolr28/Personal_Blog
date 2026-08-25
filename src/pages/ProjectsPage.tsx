import React, { useEffect, useState } from 'react';
import { Search, FolderGit2, Sparkles, Filter } from 'lucide-react';
import { projectService } from '../services/projectService';
import { Project, ProjectStatus } from '../types';
import { ProjectCard } from '../components/ProjectCard';
import { SEO } from '../components/SEO';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await projectService.getAll(true);
        setProjects(data);
      } catch (e) {
        console.error('Error loading projects:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.short_description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      <SEO
        title="Proyectos & Portafolio de Software | Mateo Largo"
        description="Explora mis proyectos de desarrollo web, arquitecturas en la nube, APIs y herramientas interactivas."
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
          Portafolio de Código
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl serif font-normal text-white">
          Proyectos & Aplicaciones
        </h1>
        <p className="text-sm sm:text-base text-white/50 leading-relaxed font-sans">
          Selección de aplicaciones web full-stack, arquitecturas cloud, sistemas de telemetría y proyectos de código abierto.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl archive-card shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, tecnología o descripción..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs font-mono bg-white/[0.04] text-white rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition-colors placeholder:text-white/30"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { label: 'Todos', value: 'all' },
            { label: 'Completados', value: 'completed' },
            { label: 'En desarrollo', value: 'development' },
            { label: 'Pausados', value: 'paused' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg whitespace-nowrap transition-colors ${
                statusFilter === tab.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 rounded-xl bg-white/[0.03] border border-white/10 animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="p-14 text-center archive-card rounded-xl border border-dashed border-white/10 space-y-3">
          <FolderGit2 className="w-10 h-10 text-white/30 mx-auto" />
          <h3 className="text-base font-semibold text-white/80 serif">
            {projects.length === 0 ? 'No hay proyectos registrados aún' : 'No se encontraron proyectos'}
          </h3>
          <p className="text-xs text-white/40 font-mono max-w-md mx-auto">
            {projects.length === 0
              ? 'Puedes crear tus primeros proyectos con capturas, enlaces y tecnologías desde el panel de administración.'
              : 'Intenta cambiar los términos de búsqueda o filtros.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};
