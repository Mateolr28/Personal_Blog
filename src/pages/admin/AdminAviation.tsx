import React, { useEffect, useState } from 'react';
import {
  Plane,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  X,
  Save,
  Loader2,
  Image as ImageIcon,
  Play,
  Eye,
  EyeOff,
  Search,
} from 'lucide-react';
import { aviationService } from '../../services/aviationService';
import { Aviation, MediaVideo } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { SEO } from '../../components/SEO';

export const AdminAviation: React.FC = () => {
  const [aviationList, setAviationList] = useState<Aviation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAircraft, setCurrentAircraft] = useState<Partial<Aviation> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Video helpers
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videoTitleInput, setVideoTitleInput] = useState('');

  const loadAviation = async () => {
    try {
      const data = await aviationService.getAll(false);
      setAviationList(data);
    } catch (e) {
      console.error('Error loading aviation in admin:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAviation();
  }, []);

  const handleOpenAdd = () => {
    setCurrentAircraft({
      registration: '',
      model: '',
      manufacturer: 'Airbus',
      airline: '',
      operator: '',
      country: 'Colombia',
      photo_date: new Date().toISOString().split('T')[0],
      airport_code: 'BOG',
      airport_name: 'Aeropuerto Internacional El Dorado',
      city: 'Bogotá',
      aircraft_type: 'Comercial',
      serial_number: '',
      description: '',
      gallery: [],
      videos: [],
      published: true,
    });
    setVideoUrlInput('');
    setVideoTitleInput('');
    setIsEditing(true);
  };

  const handleOpenEdit = (aircraft: Aviation) => {
    setCurrentAircraft(aircraft);
    setVideoUrlInput('');
    setVideoTitleInput('');
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !currentAircraft?.registration ||
      !currentAircraft?.model ||
      !currentAircraft?.manufacturer ||
      !currentAircraft?.airline
    ) {
      return;
    }

    setSaving(true);
    try {
      if (currentAircraft.id) {
        await aviationService.update(currentAircraft.id, currentAircraft);
      } else {
        await aviationService.create(currentAircraft as Omit<Aviation, 'id'>);
      }
      await loadAviation();
      setIsEditing(false);
      setCurrentAircraft(null);
    } catch (err: any) {
      console.error('Error saving aircraft spotting:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await aviationService.delete(deleteId);
      await loadAviation();
    } catch (e) {
      console.error('Error deleting aviation record:', e);
    } finally {
      setDeleteId(null);
    }
  };

  const handleTogglePublish = async (aircraft: Aviation) => {
    try {
      await aviationService.update(aircraft.id, { published: !aircraft.published });
      await loadAviation();
    } catch (e) {
      console.error('Error toggling publish:', e);
    }
  };

  const handleAddVideo = () => {
    if (!videoUrlInput.trim() || !currentAircraft) return;
    const newVid: MediaVideo = {
      url: videoUrlInput.trim(),
      title: videoTitleInput.trim() || undefined,
    };
    setCurrentAircraft({
      ...currentAircraft,
      videos: [...(currentAircraft.videos || []), newVid],
    });
    setVideoUrlInput('');
    setVideoTitleInput('');
  };

  const handleRemoveVideo = (idx: number) => {
    if (!currentAircraft) return;
    const current = [...(currentAircraft.videos || [])];
    current.splice(idx, 1);
    setCurrentAircraft({ ...currentAircraft, videos: current });
  };

  const handleAddGalleryImage = (url: string) => {
    if (!url || !currentAircraft) return;
    setCurrentAircraft({
      ...currentAircraft,
      gallery: [...(currentAircraft.gallery || []), url],
    });
  };

  const handleRemoveGalleryImage = (idx: number) => {
    if (!currentAircraft) return;
    const current = [...(currentAircraft.gallery || [])];
    current.splice(idx, 1);
    setCurrentAircraft({ ...currentAircraft, gallery: current });
  };

  const filteredAviation = aviationList.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.registration.toLowerCase().includes(q) ||
      a.model.toLowerCase().includes(q) ||
      a.airline.toLowerCase().includes(q) ||
      a.airport_code.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 max-w-6xl">
      <SEO title="Gestión de Aviación | Admin" description="CRUD del archivo fotográfico de plane spotting." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Archivo Digital de Aviación
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Administra tus registros de plane spotting, matrículas, especificaciones y fotografías.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs shadow-lg transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Aeronave</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Buscar por matrícula, modelo o aerolínea..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-xs bg-neutral-900 text-white rounded-xl border border-neutral-800 focus:outline-none focus:border-sky-500"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-neutral-900 animate-pulse" />
          ))
        ) : filteredAviation.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-neutral-900 rounded-3xl border border-neutral-800">
            <p className="text-sm text-neutral-400">No hay aeronaves registradas aún.</p>
          </div>
        ) : (
          filteredAviation.map((plane) => (
            <div
              key={plane.id}
              className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start gap-4">
                {plane.main_image ? (
                  <img
                    src={plane.main_image}
                    alt={plane.registration}
                    className="w-24 h-20 rounded-2xl object-cover border border-neutral-800 shrink-0"
                  />
                ) : (
                  <div className="w-24 h-20 rounded-2xl bg-neutral-800 flex items-center justify-center shrink-0">
                    <Plane className="w-8 h-8 text-neutral-600 -rotate-45" />
                  </div>
                )}

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800">
                      {plane.registration}
                    </span>
                    <span className="text-xs font-bold text-white truncate">{plane.model}</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-semibold">{plane.airline}</p>
                  <p className="text-[11px] text-neutral-400 flex items-center gap-1 font-mono">
                    <MapPin className="w-3 h-3 text-sky-400" />
                    {plane.airport_code} • {plane.photo_date}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => handleTogglePublish(plane)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                    plane.published
                      ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800'
                      : 'text-neutral-400 bg-neutral-800'
                  }`}
                >
                  {plane.published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{plane.published ? 'Publicado' : 'Borrador'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(plane)}
                    className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(plane.id)}
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
      {isEditing && currentAircraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {currentAircraft.id ? 'Editar Registro de Aeronave' : 'Registrar Nueva Aeronave'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Registration, Model, Manufacturer */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Matrícula (Registration) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. HK-5335, N789AA"
                    value={currentAircraft.registration || ''}
                    onChange={(e) =>
                      setCurrentAircraft({
                        ...currentAircraft,
                        registration: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 font-mono uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Modelo de Aeronave *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Airbus A320neo, Boeing 787-9"
                    value={currentAircraft.model || ''}
                    onChange={(e) =>
                      setCurrentAircraft({ ...currentAircraft, model: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Fabricante *</label>
                  <select
                    value={currentAircraft.manufacturer || 'Airbus'}
                    onChange={(e) =>
                      setCurrentAircraft({ ...currentAircraft, manufacturer: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  >
                    <option value="Airbus">Airbus</option>
                    <option value="Boeing">Boeing</option>
                    <option value="Embraer">Embraer</option>
                    <option value="Bombardier">Bombardier</option>
                    <option value="ATR">ATR</option>
                    <option value="Cessna">Cessna</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              {/* Airline & Operator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Aerolínea Comercial *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Avianca, LATAM, Emirates, Lufthansa..."
                    value={currentAircraft.airline || ''}
                    onChange={(e) =>
                      setCurrentAircraft({ ...currentAircraft, airline: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Operador (opcional)</label>
                  <input
                    type="text"
                    placeholder="Ej. Wamos Air, Titan Airways..."
                    value={currentAircraft.operator || ''}
                    onChange={(e) =>
                      setCurrentAircraft({ ...currentAircraft, operator: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>
              </div>

              {/* Location & Airport */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Código IATA/ICAO *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. BOG / SKBO"
                    value={currentAircraft.airport_code || ''}
                    onChange={(e) =>
                      setCurrentAircraft({
                        ...currentAircraft,
                        airport_code: e.target.value.toUpperCase(),
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 font-mono uppercase"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Nombre del Aeropuerto *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Aeropuerto El Dorado"
                    value={currentAircraft.airport_name || ''}
                    onChange={(e) =>
                      setCurrentAircraft({ ...currentAircraft, airport_name: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Ciudad & País</label>
                  <input
                    type="text"
                    placeholder="Bogotá, Colombia"
                    value={currentAircraft.city || ''}
                    onChange={(e) =>
                      setCurrentAircraft({ ...currentAircraft, city: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>
              </div>

              {/* Photo Date, Serial & Type */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Fecha de Captura *</label>
                  <input
                    type="date"
                    required
                    value={currentAircraft.photo_date || ''}
                    onChange={(e) =>
                      setCurrentAircraft({ ...currentAircraft, photo_date: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Serial Number (MSN)</label>
                  <input
                    type="text"
                    placeholder="Ej. 10245"
                    value={currentAircraft.serial_number || ''}
                    onChange={(e) =>
                      setCurrentAircraft({ ...currentAircraft, serial_number: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Tipo de Aeronave</label>
                  <select
                    value={currentAircraft.aircraft_type || 'Comercial'}
                    onChange={(e) =>
                      setCurrentAircraft({ ...currentAircraft, aircraft_type: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  >
                    <option value="Comercial">Comercial</option>
                    <option value="Carga">Carga</option>
                    <option value="Militar">Militar</option>
                    <option value="Ejecutivo">Ejecutivo</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentAircraft.published !== false}
                      onChange={(e) =>
                        setCurrentAircraft({ ...currentAircraft, published: e.target.checked })
                      }
                    />
                    <span>Publicado</span>
                  </label>
                </div>
              </div>

              {/* Description / Spotting Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Notas de Avistamiento / Detalles Técnicos</label>
                <textarea
                  rows={4}
                  placeholder="Detalles sobre la librea (livery), motores, pista de aterrizaje o historia del avión..."
                  value={currentAircraft.description || ''}
                  onChange={(e) =>
                    setCurrentAircraft({ ...currentAircraft, description: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                />
              </div>

              {/* Main Photo Uploader */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Fotografía Principal *</label>
                <ImageUploader
                  value={currentAircraft.main_image || ''}
                  onChange={(url) => setCurrentAircraft({ ...currentAircraft, main_image: url })}
                  label="Subir foto de plane spotting"
                  bucket="portfolio-media"
                  folder="aviation"
                />
              </div>

              {/* Gallery Multi-upload */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-300">Galería de Ángulos Adicionales</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(currentAircraft.gallery || []).map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-neutral-700 group">
                      <img src={img} alt="Foto ángulo" className="w-full h-full object-cover" />
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
                  <p className="text-[11px] text-neutral-400">Añadir foto a la galería de aviación</p>
                  <ImageUploader
                    onChange={(url) => handleAddGalleryImage(url)}
                    label="Subir nueva foto"
                    bucket="portfolio-media"
                    folder="aviation/gallery"
                  />
                </div>
              </div>

              {/* Videos */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-neutral-300">Videos de Despegue / Aterrizaje</label>
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
                  {(currentAircraft.videos || []).map((v, idx) => (
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
                  <span>Guardar Aeronave</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Eliminar Registro de Aeronave"
        message="¿Estás seguro de que deseas eliminar este registro fotográfico de aviación?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
