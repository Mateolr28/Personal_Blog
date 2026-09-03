import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Briefcase,
  Plane,
  Camera,
  Terminal,
  Download,
  ArrowRight,
  Heart,
} from 'lucide-react';
import { profileService } from '../services/profileService';
import { technologyService } from '../services/technologyService';
import { Profile, Technology, SocialLink } from '../types';
import { TechnologyCard } from '../components/TechnologyCard';
import { SEO } from '../components/SEO';
import { SocialLinks } from '../components/SocialLinks';

export const About: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [p, s, t] = await Promise.all([
          profileService.getProfile(),
          profileService.getSocialLinks(),
          technologyService.getAll(),
        ]);
        setProfile(p);
        setSocialLinks(s);
        setTechnologies(t);
      } catch (e) {
        console.error('Error loading about data:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categories = ['All', 'Frontend', 'Backend', 'Database', 'DevOps', 'Tools'];

  const filteredTechnologies =
    selectedCategory === 'All'
      ? technologies
      : technologies.filter((t) => t.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20 pb-24">
      <SEO
        title={`Sobre Mí | ${profile?.full_name || 'Mateo Largo'}`}
        description={profile?.bio || 'Conoce más sobre mi trayectoria profesional, intereses y tecnologías.'}
      />

      {/* ========================================================================= */}
      {/* 1. PROFILE HEADER */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-4 flex justify-center">
          <div className="relative w-full max-w-sm">
            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-950 archive-card flex items-center justify-center">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile?.full_name || 'Perfil'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="p-8 text-center flex flex-col items-center">
                  <div className="w-24 h-24 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3">
                    <span className="serif text-3xl font-light text-blue-400">MR</span>
                  </div>
                  <span className="text-xs font-mono uppercase tracking-wider text-white/40">
                    {profile?.full_name || 'Mateo Largo'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
              Perfil Profesional
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl serif font-normal text-white mt-1">
              {profile?.full_name || 'Mateo Largo'}
            </h1>
            {profile?.profession && (
              <p className="text-base sm:text-lg font-mono text-white/70 mt-1">
                {profile.profession}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-white/60">
            {profile?.location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>{profile.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>{profile?.email || 'mateolriadev@gmail.com'}</span>
            </div>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-white/60 leading-relaxed font-sans">
            {profile?.bio ? (
              profile.bio.split('\n').map((paragraph, index) => (
                paragraph.trim() && (
                  <p key={index}>
                    {paragraph}
                  </p>
                )
              ))
            ) : (
              <p>
                {profile?.short_bio ||
                  'Perfil en configuración. La información biográfica y trayectoria profesional se agregarán próximamente.'}
              </p>
            )}
          </div>

          {/* Interests Chips */}
          {profile?.interests && profile.interests.length > 0 && (
            <div className="space-y-2 pt-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                Áreas de Interés
              </p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded text-xs font-mono bg-white/[0.04] text-white/80 border border-white/10"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Social Links & Navigation */}
          <div className="flex flex-wrap items-center gap-3 pt-4">
            <Link
              to="/experience"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm bg-white text-black font-semibold text-xs uppercase tracking-wider shadow transition-transform hover:scale-105"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>Ver Experiencia</span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-white/20 text-white font-semibold text-xs uppercase tracking-wider transition-colors hover:bg-white/5"
            >
              <Mail className="w-3.5 h-3.5 text-blue-400" />
              <span>Contacto</span>
            </Link>
          </div>

          {socialLinks.length > 0 && (
            <div className="space-y-3 pt-2">
              <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                Redes & Enlaces
              </p>
              <SocialLinks
                links={socialLinks}
                className="flex flex-wrap items-center gap-2"
                linkClassName="inline-flex items-center gap-2 px-3 py-2 rounded-sm border border-white/10 text-white/70 hover:text-white hover:border-blue-400/60 transition-colors text-xs font-mono"
              />
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TECHNOLOGIES & STACK CATALOG */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
              Conocimientos
            </span>
            <h2 className="text-2xl sm:text-3xl serif font-normal text-white mt-1">
              Tecnologías & Herramientas
            </h2>
            <p className="text-xs font-mono text-white/50 mt-1">
              Lenguajes, frameworks, bases de datos y herramientas de desarrollo.
            </p>
          </div>

          {/* Filter Pills */}
          {categories.length > 0 && technologies.length > 0 && (
            <div className="flex flex-wrap gap-1.5 p-1 rounded-lg bg-white/[0.03] border border-white/10">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 text-xs font-mono rounded transition-colors ${
                    selectedCategory === cat
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {cat === 'All' ? 'Todas' : cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {filteredTechnologies.length === 0 ? (
          <div className="p-10 rounded-xl archive-card text-center text-white/40 font-mono text-xs border border-dashed border-white/10">
            <span>No hay tecnologías registradas en esta categoría aún.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTechnologies.map((tech) => (
              <TechnologyCard key={tech.id} technology={tech} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
