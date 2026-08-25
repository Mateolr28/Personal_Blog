import React, { useEffect, useState } from 'react';
import {
  Compass,
  Plus,
  Edit2,
  Trash2,
  MapPin,
  Calendar,
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Play,
  Eye,
  EyeOff,
  Globe2,
} from 'lucide-react';
import { travelService } from '../../services/travelService';
import { Travel, MediaVideo } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { slugify } from '../../lib/utils';
import { SEO } from '../../components/SEO';

export const AdminTravel: React.FC = () => {
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTravel, setCurrentTravel] = useState<Partial<Travel> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form helpers
  const [placeInput, setPlaceInput] = useState('');
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoTitleInput, setVideoTitleInput] = useState('');

  const loadTravels = async () => {
    try {
      const data = await travelService.getAll(false);
      setTravels(data);
    } catch (e) {
      console.error('Error loading travels:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTravels();
  }, []);

  const handleOpenAdd = () => {
    setCurrentTravel({
      title: '',
      slug: '',
      country: '',
      city: '',
      location_name: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      places_visited: [],
      gallery: [],
      videos: [],
      published: true,
      coordinates: { lat: 0, lng: 0 },
    });
    setPlaceInput('');
    setVideoUrlInput('');
    setVideoTitleInput('');
    setIsEditing(true);
  };

  const handleOpenEdit = (travel: Travel) => {
    setCurrentTravel(travel);
    setPlaceInput('');
    setVideoUrlInput('');
    setVideoTitleInput('');
    setIsEditing(true);
  };

  const handleTitleChange = (title: string) => {
    if (!currentTravel) return;
    const update: Partial<Travel> = { title };
    if (!currentTravel.id) {
      update.slug = slugify(title);
    }
    setCurrentTravel({ ...currentTravel, ...update });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTravel?.title || !currentTravel?.country || !currentTravel?.city) return;

    setSaving(true);
    try {
      const payload: Partial<Travel> = {
        ...currentTravel,
        slug: currentTravel.slug || slugify(currentTravel.title),
      };

      if (currentTravel.id) {
        await travelService.update(currentTravel.id, payload);
      } else {
        await travelService.create(payload as Omit<Travel, 'id'>);
      }
      await loadTravels();
      setIsEditing(false);
      setCurrentTravel(null);
    } catch (err: any) {
      console.error('Error saving travel:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await travelService.delete(deleteId);
      await loadTravels();
    } catch (e) {
      console.error('Error deleting travel:', e);
    } finally {
      setDeleteId(null);
    }
  };

  const handleTogglePublish = async (travel: Travel) => {
    try {
      await travelService.update(travel.id, { published: !travel.published });
      await loadTravels();
    } catch (e) {
      console.error('Error toggling publish:', e);
    }
  };

  const handleAddPlace = () => {
    if (!placeInput.trim() || !currentTravel) return;
    const current = currentTravel.places_visited || [];
    if (!current.includes(placeInput.trim())) {
      setCurrentTravel({ ...currentTravel, places_visited: [...current, placeInput.trim()] });
    }
    setPlaceInput('');
  };

  const handleRemovePlace = (place: string) => {
    if (!currentTravel) return;
    setCurrentTravel({
      ...currentTravel,
      places_visited: (currentTravel.places_visited || []).filter((p) => p !== place),
    });
  };

  const handleAddVideo = () => {
    if (!videoUrlInput.trim() || !currentTravel) return;
    const newVid: MediaVideo = {
      url: videoUrlInput.trim(),
      title: videoTitleInput.trim() || undefined,
    };
    setCurrentTravel({
      ...currentTravel,
      videos: [...(currentTravel.videos || []), newVid],
    });
    setVideoUrlInput('');
    setVideoTitleInput('');
  };

  const handleRemoveVideo = (idx: number) => {
    if (!currentTravel) return;
    const current = [...(currentTravel.videos || [])];
    current.splice(idx, 1);
    setCurrentTravel({ ...currentTravel, videos: current });
  };

  const handleAddGalleryImage = (url: string) => {
    if (!url || !currentTravel) return;
    setCurrentTravel({
      ...currentTravel,
      gallery: [...(currentTravel.gallery || []), url],
    });
  };

  const handleRemoveGalleryImage = (idx: number) => {
    if (!currentTravel) return;
    const current = [...(currentTravel.gallery || [])];
    current.splice(idx, 1);
    setCurrentTravel({ ...currentTravel, gallery: current });
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <SEO title="Gestión de Viajes | Admin" description="CRUD de bitácoras de viaje." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Bitácora de Viajes
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Administra tus destinos, relatos fotográficos, coordenadas y lugares visitados.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs shadow-lg transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Viaje</span>
        </button>
      </div>

      {/* Travels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-neutral-900 animate-pulse" />
          ))
        ) : travels.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-neutral-900 rounded-3xl border border-neutral-800">
            <p className="text-sm text-neutral-400">No hay viajes registrados aún.</p>
          </div>
        ) : (
          travels.map((travel) => (
            <div
              key={travel.id}
              className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                {travel.main_image ? (
                  <img
                    src={travel.main_image}
                    alt={travel.title}
                    className="w-20 h-20 rounded-2xl object-cover border border-neutral-800 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-neutral-800 flex items-center justify-center shrink-0">
                    <Compass className="w-8 h-8 text-neutral-600" />
                  </div>
                )}

                <div className="space-y-1 min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white truncate">{travel.title}</h3>
                  <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {travel.city}, {travel.country}
                  </p>
                  <p className="text-xs text-neutral-400 line-clamp-2">{travel.description}</p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-neutral-500">
                    <span>{travel.gallery?.length || 0} fotos</span>
                    <span>•</span>
                    <span>{travel.places_visited?.length || 0} lugares</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(travel)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    travel.published
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                      : 'text-neutral-400 bg-neutral-800'
                  }`}
                >
                  {travel.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{travel.published ? 'Publicado' : 'Borrador'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(travel)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(travel.id)}
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
      {isEditing && currentTravel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {currentTravel.id ? 'Editar Bitácora' : 'Nueva Bitácora de Viaje'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Title & Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Título del Viaje *</label>
                  <input
                    type="text"
                    required
                    value={currentTravel.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Slug (URL) *</label>
                  <input
                    type="text"
                    required
                    value={currentTravel.slug || ''}
                    onChange={(e) =>
                      setCurrentTravel({ ...currentTravel, slug: slugify(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 font-mono"
                  />
                </div>
              </div>

              {/* Location Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">País *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Japón, Francia, Colombia..."
                    value={currentTravel.country || ''}
                    onChange={(e) => setCurrentTravel({ ...currentTravel, country: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Ciudad *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Tokio, París, Medellín..."
                    value={currentTravel.city || ''}
                    onChange={(e) => setCurrentTravel({ ...currentTravel, city: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Nombre del Lugar / Región</label>
                  <input
                    type="text"
                    placeholder="Ej. Shibuya & Akihabara"
                    value={currentTravel.location_name || ''}
                    onChange={(e) =>
                      setCurrentTravel({ ...currentTravel, location_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>
              </div>

              {/* Date, Coordinates & Published */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Fecha del Viaje *</label>
                  <input
                    type="date"
                    required
                    value={currentTravel.date || ''}
                    onChange={(e) => setCurrentTravel({ ...currentTravel, date: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Latitud</label>
                  <input
                    type="number"
                    step="any"
                    value={currentTravel.coordinates?.lat ?? 0}
                    onChange={(e) =>
                      setCurrentTravel({
                        ...currentTravel,
                        coordinates: {
                          lat: Number(e.target.value),
                          lng: currentTravel.coordinates?.lng ?? 0,
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Longitud</label>
                  <input
                    type="number"
                    step="any"
                    value={currentTravel.coordinates?.lng ?? 0}
                    onChange={(e) =>
                      setCurrentTravel({
                        ...currentTravel,
                        coordinates: {
                          lat: currentTravel.coordinates?.lat ?? 0,
                          lng: Number(e.target.value),
                        },
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 font-mono"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentTravel.published !== false}
                      onChange={(e) =>
                        setCurrentTravel({ ...currentTravel, published: e.target.checked })
                      }
                    />
                    <span>Publicado</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Relato & Experiencia *</label>
                <textarea
                  rows={6}
                  required
                  value={currentTravel.description || ''}
                  onChange={(e) =>
                    setCurrentTravel({ ...currentTravel, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 font-mono"
                />
              </div>

              {/* Main Photo Image */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Fotografía Principal / Portada</label>
                <ImageUploader
                  value={currentTravel.main_image || ''}
                  onChange={(url) => setCurrentTravel({ ...currentTravel, main_image: url })}
                  label="Subir foto principal"
                  bucket="portfolio-media"
                  folder="travels"
                />
              </div>

              {/* Gallery Multi-upload */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-300">Galería de Fotos</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(currentTravel.gallery || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-neutral-700 group">
                      <img src={img} alt="Foto" className="w-full h-full object-cover" />
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
                  <p className="text-[11px] text-neutral-400">Añadir foto a la galería</p>
                  <ImageUploader
                    onChange={(url) => handleAddGalleryImage(url)}
                    label="Subir nueva foto a la galería"
                    bucket="portfolio-media"
                    folder="travels/gallery"
                  />
                </div>
              </div>

              {/* Places Visited */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Lugares & Hitos Visitados</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej. Templo Senso-ji, Monte Fuji..."
                    value={placeInput}
                    onChange={(e) => setPlaceInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddPlace();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddPlace}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl"
                  >
                    Añadir
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(currentTravel.places_visited || []).map((p) => (
                    <span
                      key={p}
                      className="px-2 py-0.5 text-[11px] bg-neutral-800 text-neutral-200 rounded-lg flex items-center gap-1"
                    >
                      {p}
                      <button
                        type="button"
                        onClick={() => handleRemovePlace(p)}
                        className="hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Videos */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-300">Videos de Viaje</label>
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
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs rounded-xl"
                    >
                      Añadir
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  {(currentTravel.videos || []).map((v, idx) => (
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

              {/* Modal Action Buttons */}
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
                  className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Guardar Bitácora</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Eliminar Bitácora de Viaje"
        message="¿Estás seguro de que deseas eliminar permanentemente esta bitácora de viaje?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
