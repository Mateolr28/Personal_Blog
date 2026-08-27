import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Edit2, Trash2, Calendar, CheckCircle2, X, Save, Loader2 } from 'lucide-react';
import { experienceService } from '../../services/experienceService';
import { Experience } from '../../types';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { SEO } from '../../components/SEO';

export const AdminExperience: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<Experience> | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form helpers
  const [techInput, setTechInput] = useState('');
  const [achievementInput, setAchievementInput] = useState('');

  const loadExperiences = async () => {
    try {
      const data = await experienceService.getAll();
      setExperiences(data);
    } catch (e) {
      console.error('Error loading experiences:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExperiences();
  }, []);

  const handleOpenAdd = () => {
    setCurrentExp({
      company: '',
      role: '',
      start_date: new Date().toISOString().split('T')[0],
      current: true,
      description: '',
      technologies: [],
      achievements: [],
    });
    setTechInput('');
    setAchievementInput('');
    setIsEditing(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setCurrentExp(exp);
    setTechInput('');
    setAchievementInput('');
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentExp?.company || !currentExp?.role || !currentExp?.start_date) return;

    setSaving(true);
    try {
      if (currentExp.id) {
        await experienceService.update(currentExp.id, currentExp);
      } else {
        await experienceService.create(currentExp as Omit<Experience, 'id'>);
      }
      await loadExperiences();
      setIsEditing(false);
      setCurrentExp(null);
    } catch (err: any) {
      console.error('Error saving experience:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    try {
      await experienceService.delete(deleteId);
      await loadExperiences();
    } catch (e) {
      console.error('Error deleting experience:', e);
    } finally {
      setDeleteId(null);
    }
  };

  const handleAddTech = () => {
    if (!techInput.trim() || !currentExp) return;
    const current = currentExp.technologies || [];
    if (!current.includes(techInput.trim())) {
      setCurrentExp({ ...currentExp, technologies: [...current, techInput.trim()] });
    }
    setTechInput('');
  };

  const handleRemoveTech = (tech: string) => {
    if (!currentExp) return;
    setCurrentExp({
      ...currentExp,
      technologies: (currentExp.technologies || []).filter((t) => t !== tech),
    });
  };

  const handleAddAchievement = () => {
    if (!achievementInput.trim() || !currentExp) return;
    const current = currentExp.achievements || [];
    setCurrentExp({ ...currentExp, achievements: [...current, achievementInput.trim()] });
    setAchievementInput('');
  };

  const handleRemoveAchievement = (idx: number) => {
    if (!currentExp) return;
    const current = [...(currentExp.achievements || [])];
    current.splice(idx, 1);
    setCurrentExp({ ...currentExp, achievements: current });
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <SEO title="Gestión de Experiencia Laboral | Admin" description="CRUD de cargos y experiencia profesional." />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Experiencia Laboral
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Gestiona tu trayectoria profesional, empresas, cargos, logros y tecnologías.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs shadow-lg transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Experiencia</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-neutral-900 animate-pulse" />
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-8 text-center bg-neutral-900 rounded-3xl border border-neutral-800">
            <p className="text-sm text-neutral-400">No hay registros de experiencia aún.</p>
          </div>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{exp.role}</h3>
                  <span className="text-xs text-sky-400 font-semibold">@{exp.company}</span>
                  {exp.current && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Actual
                    </span>
                  )}
                </div>
                <p className="text-xs text-neutral-400 font-mono">
                  {exp.start_date} → {exp.current ? 'Presente' : exp.end_date}
                </p>
                <p className="text-xs text-neutral-300 line-clamp-2">{exp.description}</p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleOpenEdit(exp)}
                  className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteId(exp.id)}
                  className="p-2.5 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit/Add Modal */}
      {isEditing && currentExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {currentExp.id ? 'Editar Experiencia' : 'Nueva Experiencia'}
              </h2>
              <button onClick={() => setIsEditing(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Empresa *</label>
                  <input
                    type="text"
                    required
                    value={currentExp.company || ''}
                    onChange={(e) => setCurrentExp({ ...currentExp, company: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Cargo / Rol *</label>
                  <input
                    type="text"
                    required
                    value={currentExp.role || ''}
                    onChange={(e) => setCurrentExp({ ...currentExp, role: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">Fecha de Inicio *</label>
                  <input
                    type="date"
                    required
                    value={currentExp.start_date || ''}
                    onChange={(e) => setCurrentExp({ ...currentExp, start_date: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-neutral-300">Fecha Fin</label>
                    <label className="text-xs text-sky-400 flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={currentExp.current || false}
                        onChange={(e) =>
                          setCurrentExp({
                            ...currentExp,
                            current: e.target.checked,
                            end_date: e.target.checked ? undefined : currentExp.end_date,
                          })
                        }
                      />
                      <span>Cargo Actual</span>
                    </label>
                  </div>
                  <input
                    type="date"
                    disabled={currentExp.current}
                    value={currentExp.end_date || ''}
                    onChange={(e) => setCurrentExp({ ...currentExp, end_date: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700 disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">Descripción del Rol por párrafos</label>
                <textarea
                  rows={6}
                  placeholder="Escribe un párrafo y deja una línea en blanco para comenzar otro..."
                  value={currentExp.description || ''}
                  onChange={(e) => setCurrentExp({ ...currentExp, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                />
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Tecnologías Usadas</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej. React, Node.js, AWS..."
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
                  {(currentExp.technologies || []).map((t) => (
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

              {/* Achievements */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-300">Puntos destacados</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Añade un punto para describir una responsabilidad o logro..."
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAchievement();
                      }
                    }}
                    className="flex-1 px-3 py-1.5 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
                  />
                  <button
                    type="button"
                    onClick={handleAddAchievement}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl"
                  >
                    Añadir
                  </button>
                </div>
                <div className="space-y-1">
                  {(currentExp.achievements || []).map((ach, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-neutral-800/80 text-xs text-neutral-200"
                    >
                      <span>{ach}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAchievement(idx)}
                        className="hover:text-red-400 text-neutral-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

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
                  className="px-6 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Guardar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Eliminar Experiencia"
        message="¿Estás seguro de que deseas eliminar este registro de experiencia laboral?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};
