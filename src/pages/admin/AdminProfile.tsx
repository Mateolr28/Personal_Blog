import React, { useEffect, useState } from 'react';
import { User, Save, Plus, Trash2, CheckCircle2, AlertCircle, Loader2, Sparkles, Link as LinkIcon } from 'lucide-react';
import { profileService } from '../../services/profileService';
import { Profile, SocialLink } from '../../types';
import { ImageUploader } from '../../components/ImageUploader';
import { SEO } from '../../components/SEO';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New social link form state
  const [newSocialName, setNewSocialName] = useState('');
  const [newSocialUrl, setNewSocialUrl] = useState('');
  const [newSocialIcon, setNewSocialIcon] = useState('globe');

  useEffect(() => {
    const load = async () => {
      try {
        const [prof, soc] = await Promise.all([
          profileService.getProfile(),
          profileService.getSocialLinks(),
        ]);
        setProfile(prof);
        setSocialLinks(soc);
      } catch (err: any) {
        console.error('Error loading profile in admin:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleProfileChange = (field: keyof Profile, value: any) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleAddInterest = () => {
    if (!newInterest.trim() || !profile) return;
    const current = profile.interests || [];
    if (!current.includes(newInterest.trim())) {
      setProfile({ ...profile, interests: [...current, newInterest.trim()] });
    }
    setNewInterest('');
  };

  const handleRemoveInterest = (interest: string) => {
    if (!profile) return;
    setProfile({
      ...profile,
      interests: (profile.interests || []).filter((i) => i !== interest),
    });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await profileService.updateProfile(profile);
      setSuccessMessage('Perfil actualizado correctamente.');
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setErrorMessage(err.message || 'Error al guardar perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSocialLink = async () => {
    if (!newSocialName.trim() || !newSocialUrl.trim()) return;
    try {
      const created = await profileService.createSocialLink({
        platform: newSocialName.trim(),
        url: newSocialUrl.trim(),
        icon: newSocialIcon.trim() || 'globe',
      });
      setSocialLinks([...socialLinks, created]);
      setNewSocialName('');
      setNewSocialUrl('');
    } catch (err: any) {
      console.error('Error adding social link:', err);
    }
  };

  const handleDeleteSocialLink = async (id?: string) => {
    if (!id) return;
    try {
      await profileService.deleteSocialLink(id);
      setSocialLinks(socialLinks.filter((s) => s.id !== id));
    } catch (err: any) {
      console.error('Error deleting social link:', err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-neutral-800 rounded animate-pulse" />
        <div className="h-96 bg-neutral-900 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <SEO title="Editar Perfil | Admin" description="Gestión del perfil personal y redes." />

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Perfil & Biografía
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Configura tus datos principales mostrados en el inicio, sobre mí y footer.
        </p>
      </div>

      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-950/80 border border-red-800 text-red-300 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8">
        {/* Card 1: Avatar & Main Info */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <User className="w-4 h-4 text-sky-400" />
            <span>Datos Personales</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Avatar Uploader */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300">
                Foto de Perfil
              </label>
              <ImageUploader
                value={profile?.avatar_url || ''}
                onChange={(url) => handleProfileChange('avatar_url', url)}
                label="Subir foto de perfil"
                bucket="portfolio-media"
                folder="avatar"
              />
            </div>

            {/* Names & Titles */}
            <div className="md:col-span-2 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  required
                  value={profile?.full_name || ''}
                  onChange={(e) => handleProfileChange('full_name', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-neutral-800 text-white rounded-xl border border-neutral-700 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Profesión / Cargo Destacado
                </label>
                <input
                  type="text"
                  required
                  value={profile?.profession || ''}
                  onChange={(e) => handleProfileChange('profession', e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-neutral-800 text-white rounded-xl border border-neutral-700 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={profile?.email || ''}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-neutral-800 text-white rounded-xl border border-neutral-700 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-neutral-300">
                    Ubicación
                  </label>
                  <input
                    type="text"
                    value={profile?.location || ''}
                    onChange={(e) => handleProfileChange('location', e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-neutral-800 text-white rounded-xl border border-neutral-700 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Biographies */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
          <h2 className="text-base font-bold text-white">Biografías</h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Descripción Corta (Hero Banner)
            </label>
            <textarea
              rows={2}
              value={profile?.short_bio || ''}
              onChange={(e) => handleProfileChange('short_bio', e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-neutral-800 text-white rounded-xl border border-neutral-700 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Biografía Completa (Página Sobre Mí)
            </label>
            <textarea
              rows={6}
              value={profile?.bio || ''}
              onChange={(e) => handleProfileChange('bio', e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-neutral-800 text-white rounded-xl border border-neutral-700 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Card 3: Interests & Passions */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
          <h2 className="text-base font-bold text-white">Áreas de Interés & Etiquetas</h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Añadir interés (ej. Astrofotografía, Microservicios...)"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddInterest();
                }
              }}
              className="flex-1 px-4 py-2 text-sm bg-neutral-800 text-white rounded-xl border border-neutral-700 focus:outline-none focus:border-sky-500"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-xl border border-neutral-700"
            >
              Añadir
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {(profile?.interests || []).map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-800 text-white text-xs font-medium rounded-full border border-neutral-700"
              >
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="hover:text-red-400"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-neutral-950 font-bold text-sm shadow-xl transition-transform hover:scale-105"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Guardando cambios...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Guardar Perfil</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Card 4: Social Links CRUD */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <LinkIcon className="w-4 h-4 text-sky-400" />
          <span>Redes Sociales & Enlaces Externos</span>
        </h2>

        {/* Add new social link */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-neutral-800/60 border border-neutral-700/60">
          <input
            type="text"
            placeholder="Plataforma (GitHub, LinkedIn...)"
            value={newSocialName}
            onChange={(e) => setNewSocialName(e.target.value)}
            className="px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
          />
          <input
            type="url"
            placeholder="URL (https://...)"
            value={newSocialUrl}
            onChange={(e) => setNewSocialUrl(e.target.value)}
            className="px-3.5 py-2 text-xs bg-neutral-800 text-white rounded-xl border border-neutral-700"
          />
          <button
            type="button"
            onClick={handleAddSocialLink}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Enlace</span>
          </button>
        </div>

        {/* Social Links List */}
        <div className="space-y-2">
          {socialLinks.map((link, idx) => (
            <div
              key={link.id || idx}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-800 border border-neutral-700"
            >
              <div>
                <p className="text-xs font-bold text-white">{link.platform}</p>
                <p className="text-[11px] text-neutral-400 font-mono truncate max-w-md">
                  {link.url}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSocialLink(link.id)}
                className="p-2 text-neutral-400 hover:text-red-400 rounded-lg hover:bg-neutral-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
