import React, { useEffect, useState } from 'react';
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  Sparkles,
  ExternalLink,
  Github,
  Calendar,
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Play,
  Check,
  Eye,
  EyeOff,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { Project, ProjectStatus, MediaVideo } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { slugify } from '../../lib/utils';
import { SEO } from '../../components/SEO';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Helper inputs for tags & videos
  const [techInput, setTechInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoTitleInput, setVideoTitleInput] = useState('');
  const [galleryUrlInput, setGalleryUrlInput] = useState('');

  const loadProjects = async () => {
    try {
      const data = await projectService.getAll(false);
      setProjects(data);
    } catch (e) {
      console.error('Error loading projects:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleOpenAdd = () => {
    setCurrentProject({
      title: '',
      slug: '',
      short_description: '',
      full_description: '',
      status: 'completed',
      featured: false,
      published: true,
      technologies: [],
      gallery: [],
      videos: [],
      date: new Date().toISOString().split('T')[0],
    });
    setTechInput('');
    setVideoUrlInput('');
    setVideoTitleInput('');
    setIsEditing(true);
  };

  const handleOpenEdit = (project: Project) => {
    setCurrentProject(project);
    setTechInput('');
    setVideoUrlInput('');
    setVideoTitleInput('');
    setIsEditing(true);
  };

  const handleTitleChange = (title: string) => {
    if (!currentProject) return;
    const update: Partial<Project> = { title };
    if (!currentProject.id) {
      update.slug = slugify(title);
    }
    setCurrentProject({ ...currentProject, ...update });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject?.title || !currentProject?.short_description) return;

    setSaving(true);
    try {
      const payload: Partial<Project> = {
        ...currentProject,
        slug: currentProject.slug || slugify(currentProject.title),
      };

      if (currentProject.id) {
        await projectService.update(currentProject.id, payload);
      } else {
        await projectService.create(payload as Omit<Project, 'id'>);
      }
      await loadProjects();
      setIsEditing(false);
      setCurrentProject(null);
    } catch (err: any) {
      console.error('Error saving project:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await projectService.delete(deleteId);
      await loadProjects();
    } catch (e) {
      console.error('Error deleting project:', e);
    } finally {
      setDeleteId(null);
    }
  };

  const handleTogglePublish = async (project: Project) => {
    try {
      await projectService.update(project.id, { published: !project.published });
      await loadProjects();
    } catch (e) {
      console.error('Error toggling publish:', e);
    }
  };

  const handleAddTech = () => {
    if (!techInput.trim() || !currentProject) return;
    const current = currentProject.technologies || [];
    if (!current.includes(techInput.trim())) {
      setCurrentProject({ ...currentProject, technologies: [...current, techInput.trim()] });
    }
    setTechInput('');
  };

  const handleRemoveTech = (tech: string) => {
    if (!currentProject) return;
    setCurrentProject({
      ...currentProject,
      technologies: (currentProject.technologies || []).filter((t) => t !== tech),
    });
  };

  const handleAddVideo = () => {
    if (!videoUrlInput.trim() || !currentProject) return;
    const newVid: MediaVideo = {
      url: videoUrlInput.trim(),
      title: videoTitleInput.trim() || undefined,
    };
    setCurrentProject({
      ...currentProject,
      videos: [...(currentProject.videos || []), newVid],
    });
    setVideoUrlInput('');
    setVideoTitleInput('');
  };

  const handleRemoveVideo = (idx: number) => {
    if (!currentProject) return;
    const current = [...(currentProject.videos || [])];
    current.splice(idx, 1);
    setCurrentProject({ ...currentProject, videos: current });
  };

  const handleAddGalleryImage = (url: string) => {
    if (!url || !currentProject) return;
    setCurrentProject({
      ...currentProject,
      gallery: [...(currentProject.gallery || []), url],
    });
  };

  const handleRemoveGalleryImage = (idx: number) => {
    if (!currentProject) return;
    const current = [...(currentProject.gallery || [])];
    current.splice(idx, 1);
    setCurrentProject({ ...currentProject, gallery: current });
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <SEO title="Gestión de Proyectos | Admin" description="CRUD de proyectos y código." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Proyectos de Software
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Administra tus proyectos, capturas de pantalla, videos de demostración y repositorio.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs shadow-lg transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Proyecto</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-neutral-900 animate-pulse" />
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-neutral-900 rounded-3xl border border-neutral-800">
            <p className="text-sm text-neutral-400">No hay proyectos registrados aún.</p>
          </div>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.id}
              className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                {proj.main_image ? (
                  <img
                    src={proj.main_image}
                    alt={proj.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-neutral-800 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-neutral-800 flex items-center justify-center shrink-0">
                    <FolderGit2 className="w-8 h-8 text-neutral-600" />
                  </div>
                )}

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white truncate">{proj.title}</h3>
                    {proj.featured && (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 line-clamp-2">{proj.short_description}</p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-mono">
                    <span className="text-sky-400">{proj.status}</span>
                    <span>•</span>
                    <span className="text-neutral-500">{proj.technologies?.length || 0} techs</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(proj)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    proj.published
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                      : 'text-neutral-400 bg-neutral-800'
                  }`}
                >
                  {proj.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{proj.published ? 'Publicado' : 'Borrador'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(proj)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(proj.id)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-400"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Add Modal */}
      {isEditing && currentProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {currentProject.id ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Título del Proyecto *</label>
                  <input
                    type="text"
                    required
                    value={currentProject.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Slug (URL amigable) *</label>
                  <input
                    type="text"
                    required
                    value={currentProject.slug || ''}
                    onChange={(e) =>
                      setCurrentProject({ ...currentProject, slug: slugify(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 font-mono"
                  />
                </div>
              </div>

              {/* Status & Options */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Estado del Proyecto</label>
                  <select
                    value={currentProject.status || 'completed'}
                    onChange={(e) =>
                      setCurrentProject({
                        ...currentProject,
                        status: e.target.value as ProjectStatus,
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  >
                    <option value="completed">Completado</option>
                    <option value="development">En desarrollo</option>
                    <option value="paused">Pausado</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Fecha del Proyecto</label>
                  <input
                    type="date"
                    value={currentProject.date || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, date: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="flex items-center gap-4 pt-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentProject.featured || false}
                      onChange={(e) =>
                        setCurrentProject({ ...currentProject, featured: e.target.checked })
                      }
                    />
                    <span>Destacado</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentProject.published !== false}
                      onChange={(e) =>
                        setCurrentProject({ ...currentProject, published: e.target.checked })
                      }
                    />
                    <span>Publicado</span>
                  </label>
                </div>
              </div>

              {/* External URLs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">URL Demo en Vivo</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={currentProject.demo_url || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, demo_url: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">URL Repositorio GitHub</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={currentProject.github_url || ''}
                    onChange={(e) =>
                      setCurrentProject({ ...currentProject, github_url: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 font-mono"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Descripción Corta *</label>
                <textarea
                  rows={2}
                  required
                  value={currentProject.short_description || ''}
                  onChange={(e) =>
                    setCurrentProject({ ...currentProject, short_description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Descripción Completa</label>
                <textarea
                  rows={5}
                  value={currentProject.full_description || ''}
                  onChange={(e) =>
                    setCurrentProject({ ...currentProject, full_description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 font-mono"
                />
              </div>

              {/* Main Cover Image */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Imagen Principal / Portada</label>
                <ImageUploader
                  value={currentProject.main_image || ''}
                  onChange={(url) => setCurrentProject({ ...currentProject, main_image: url })}
                  label="Subir portada del proyecto"
                  bucket="portfolio-media"
                  folder="projects"
                />
              </div>

              {/* Gallery Multi-upload */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-300">Galería de Capturas</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(currentProject.gallery || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-neutral-700 group">
                      <img src={img} alt="Captura" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-md opacity-80 hover:opacity-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-neutral-800 rounded-2xl border border-neutral-700 space-y-2">
                  <p className="text-[11px] text-neutral-400">Añadir imagen a la galería</p>
                  <ImageUploader
                    onChange={(url) => handleAddGalleryImage(url)}
                    label="Subir nueva captura"
                    bucket="portfolio-media"
                    folder="projects/gallery"
                  />
                </div>
              </div>

              {/* Videos Section */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-300">Videos de Demostración</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="url"
                    placeholder="URL del video (YouTube o Vimeo)"
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Título del video (opcional)"
                      value={videoTitleInput}
                      onChange={(e) => setVideoTitleInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                    />
                    <button
                      type="button"
                      onClick={handleAddVideo}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs rounded-xl"
                    >
                      Añadir
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  {(currentProject.videos || []).map((v, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-neutral-800 text-xs">
                      <span className="truncate text-neutral-300">{v.title || v.url}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveVideo(idx)}
                        className="text-red-400 hover:text-red-300"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Tecnologías Usadas</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej. React, TypeScript, Tailwind..."
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl"
                  >
                    Añadir
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(currentProject.technologies || []).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 text-[11px] bg-neutral-800 text-neutral-200 rounded-lg flex items-center gap-1"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(t)}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Guardar Proyecto</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Eliminar Proyecto"
        message="¿Estás seguro de que deseas eliminar permanentemente este proyecto?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
