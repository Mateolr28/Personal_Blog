import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  Play,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { projectService } from '../services/projectService';
import { Project } from '../types';
import { Lightbox, LightboxImage } from '../components/Lightbox';
import { VideoEmbed } from '../components/VideoEmbed';
import { SEO } from '../components/SEO';
import { formatDate } from '../lib/utils';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await projectService.getBySlugOrId(id);
        setProject(data);
      } catch (e) {
        console.error('Error loading project detail:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-8" />
        <div className="aspect-video w-full bg-neutral-200 dark:bg-neutral-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Proyecto no encontrado
        </h2>
        <p className="text-sm text-neutral-500">
          El proyecto que buscas no existe o ha sido despublicado.
        </p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a proyectos</span>
        </Link>
      </div>
    );
  }

  const allImages: LightboxImage[] = [
    ...(project.main_image
      ? [{ url: project.main_image, title: project.title, caption: project.short_description }]
      : []),
    ...(project.gallery || []).map((imgUrl, idx) => ({
      url: imgUrl,
      title: `${project.title} - Captura ${idx + 1}`,
    })),
  ];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      <SEO
        title={`${project.title} | Proyecto de Software`}
        description={project.short_description}
        image={project.main_image}
      />

      {/* Back Button */}
      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-sky-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a Proyectos</span>
      </button>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.featured && (
            <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold bg-amber-500 text-neutral-950 rounded-full shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Destacado
            </span>
          )}
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
              project.status === 'completed'
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                : project.status === 'development'
                ? 'bg-sky-100 text-sky-700 dark:bg-sky-950/80 dark:text-sky-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
            }`}
          >
            {project.status === 'completed'
              ? 'Completado'
              : project.status === 'development'
              ? 'En desarrollo'
              : 'Pausado'}
          </span>
          {project.date && (
            <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(project.date)}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight">
          {project.title}
        </h1>

        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-3xl leading-relaxed">
          {project.short_description}
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm shadow-md transition-all hover:scale-105"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver Demo en Vivo</span>
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 font-semibold text-sm shadow transition-all hover:scale-105"
            >
              <Github className="w-4 h-4" />
              <span>Ver Repositorio GitHub</span>
            </a>
          )}
        </div>
      </div>

      {/* Main Cover Image */}
      {project.main_image && (
        <div
          onClick={() => handleOpenLightbox(0)}
          className="group relative aspect-video w-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 cursor-pointer shadow-xl bg-neutral-100 dark:bg-neutral-900"
        >
          <img
            src={project.main_image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 bg-black/70 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
              Clic para ampliar fotografía
            </span>
          </div>
        </div>
      )}

      {/* Tech Stack Chips */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="p-6 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            <Layers className="w-4 h-4 text-sky-500" />
            <span>Tecnologías & Arquitectura</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 shadow-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Full Description & Overview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Descripción del Proyecto
        </h2>
        <div className="prose dark:prose-invert max-w-none text-base text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
          {project.full_description || project.short_description}
        </div>
      </div>

      {/* Videos Section */}
      {project.videos && project.videos.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-sky-500" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Demostraciones en Video
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.videos.map((vid, idx) => (
              <VideoEmbed key={idx} video={vid} />
            ))}
          </div>
        </div>
      )}

      {/* Gallery Section */}
      {project.gallery && project.gallery.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-sky-500" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Galería de Capturas
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.gallery.map((imgUrl, idx) => {
              const globalIndex = (project.main_image ? 1 : 0) + idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleOpenLightbox(globalIndex)}
                  className="group relative aspect-video rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 cursor-pointer shadow hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <img
                    src={imgUrl}
                    alt={`${project.title} - Captura ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1 rounded-full border border-white/20">
                      Ampliar
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox Viewer */}
      <Lightbox
        images={allImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
