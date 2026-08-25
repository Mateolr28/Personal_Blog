import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, ArrowRight, Play, Sparkles } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div
      id={`project-card-${project.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl archive-card p-4 transition-all duration-300"
    >
      <div>
        {/* Main Cover Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-900 mb-4 border border-white/5">
          <img
            src={project.main_image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
            {project.featured && (
              <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold font-mono tracking-wider bg-amber-400 text-black rounded uppercase">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            )}
            <span
              className={`px-2 py-0.5 text-[10px] font-mono tracking-wider rounded uppercase backdrop-blur-md ${
                project.status === 'completed'
                  ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                  : project.status === 'development'
                  ? 'bg-blue-950/80 text-blue-400 border border-blue-500/30'
                  : 'bg-amber-950/80 text-amber-400 border border-amber-500/30'
              }`}
            >
              {project.status === 'completed' ? 'Completado' : project.status === 'development' ? 'En desarrollo' : 'Pausado'}
            </span>
          </div>

          {project.videos && project.videos.length > 0 && (
            <div className="absolute bottom-2.5 right-2.5 p-1 rounded bg-black/70 backdrop-blur-md text-white border border-white/10">
              <Play className="w-3.5 h-3.5 fill-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <div className="text-[10px] text-blue-400 font-mono tracking-wider uppercase mb-1">
            PROJECT / {project.featured ? 'FEATURED ARCHIVE' : 'SOFTWARE'}
          </div>

          <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1 serif">
            {project.title}
          </h3>

          <p className="mt-1.5 text-xs text-white/50 line-clamp-2 leading-relaxed">
            {project.short_description}
          </p>

          {/* Tech tags */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {project.technologies?.slice(0, 3).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-mono bg-white/[0.04] text-white/70 rounded border border-white/10"
              >
                {tech}
              </span>
            ))}
            {project.technologies && project.technologies.length > 3 && (
              <span className="px-1.5 py-0.5 text-[10px] font-mono text-white/40">
                +{project.technologies.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
        <Link
          to={`/projects/${project.slug || project.id}`}
          className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-blue-400 hover:text-white transition-colors"
        >
          Ver proyecto
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>

        <div className="flex items-center gap-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-white/40 hover:text-white transition-colors"
              title="Ver código en GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1 text-white/40 hover:text-blue-400 transition-colors"
              title="Ver Demo en Vivo"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
