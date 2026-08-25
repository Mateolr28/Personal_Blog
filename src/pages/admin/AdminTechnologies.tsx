import React, { useEffect, useState } from 'react';
import { Layers, Plus, Edit2, Trash2, X, Save, Loader2 } from 'lucide-react';
import { technologyService } from '../../services/technologyService';
import { Technology, TechCategory, TechLevel } from '../../types';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { SEO } from '../../components/SEO';

export const AdminTechnologies: React.FC = () => {
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTech, setCurrentTech] = useState<Partial<Technology> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories: (TechCategory | 'All')[] = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Tools'];
  const levels: TechLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const loadTech = async () => {
    try {
      const data = await technologyService.getAll();
      setTechnologies(data);
    } catch (e) {
      console.error('Error loading technologies:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTech();
  }, []);

  const handleOpenAdd = () => {
    setCurrentTech({
      name: '',
      category: 'Frontend',
      level: 'Advanced',
      years_of_experience: 2,
      description: '',
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (tech: Technology) => {
    setCurrentTech(tech);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTech?.name || !currentTech?.category || !currentTech?.level) return;

    setSaving(true);
    try {
      if (currentTech.id) {
        await technologyService.update(currentTech.id, currentTech);
      } else {
        await technologyService.create(currentTech as Omit<Technology, 'id'>);
      }
      await loadTech();
      setIsEditing(false);
      setCurrentTech(null);
    } catch (err: any) {
      console.error('Error saving technology:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await technologyService.delete(deleteId);
      await loadTech();
    } catch (e) {
      console.error('Error deleting technology:', e);
    } finally {
      setDeleteId(null);
    }
  };

  const filteredTechnologies =
    selectedCategory === 'All'
      ? technologies
      : technologies.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-8 max-w-5xl">
      <SEO title="Gestión de Tecnologías | Admin" description="Administración de habilidades y stack tecnológico." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Stack Tecnológico & Habilidades
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Administra los lenguajes, frameworks, bases de datos y herramientas de tu catálogo.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs shadow-lg transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Tecnología</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white shadow'
                : 'bg-neutral-800 text-neutral-400 hover:text-white'
            }`}
          >
            {cat === 'All' ? 'Todas' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 rounded-2xl bg-neutral-900 animate-pulse" />
          ))
        ) : filteredTechnologies.length === 0 ? (
          <div className="col-span-full p-8 text-center bg-neutral-900 rounded-3xl border border-neutral-800">
            <p className="text-sm text-neutral-400">No hay tecnologías registradas en esta categoría.</p>
          </div>
        ) : (
          filteredTechnologies.map((tech) => (
            <div
              key={tech.id}
              className="p-5 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    {tech.category}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    {tech.level}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-2">{tech.name}</h3>
                {tech.description && (
                  <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{tech.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 mt-3 border-t border-neutral-800">
                <span className="text-[11px] text-neutral-500 font-mono">
                  {tech.years_of_experience ? `${tech.years_of_experience} años` : ''}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(tech)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteId(tech.id)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/Add Modal */}
      {isEditing && currentTech && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h2 className="text-base font-bold text-white">
                {currentTech.id ? 'Editar Tecnología' : 'Nueva Tecnología'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Nombre *</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. React, PostgreSQL, Docker..."
                  value={currentTech.name || ''}
                  onChange={(e) => setCurrentTech({ ...currentTech, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Categoría *</label>
                  <select
                    value={currentTech.category || 'Frontend'}
                    onChange={(e) =>
                      setCurrentTech({ ...currentTech, category: e.target.value as TechCategory })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  >
                    {categories.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Nivel *</label>
                  <select
                    value={currentTech.level || 'Advanced'}
                    onChange={(e) =>
                      setCurrentTech({ ...currentTech, level: e.target.value as TechLevel })
                    }
                    className="w-full px-3 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  >
                    {levels.map((lvl) => (
                      <option key={lvl} value={lvl}>
                        {lvl}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Años de Experiencia</label>
                <input
                  type="number"
                  min={0}
                  max={30}
                  value={currentTech.years_of_experience || ''}
                  onChange={(e) =>
                    setCurrentTech({
                      ...currentTech,
                      years_of_experience: Number(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Descripción / Enfoque</label>
                <textarea
                  rows={2}
                  value={currentTech.description || ''}
                  onChange={(e) => setCurrentTech({ ...currentTech, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-neutral-800">
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
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Eliminar Tecnología"
        message="¿Estás seguro de que deseas eliminar esta tecnología del catálogo?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
