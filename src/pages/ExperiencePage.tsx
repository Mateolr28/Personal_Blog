import React, { useEffect, useState } from 'react';
import { Briefcase, Calendar, Award } from 'lucide-react';
import { experienceService } from '../services/experienceService';
import { Experience } from '../types';
import { ExperienceCard } from '../components/ExperienceCard';
import { SEO } from '../components/SEO';

export const ExperiencePage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await experienceService.getAll();
        setExperiences(data);
      } catch (e) {
        console.error('Error fetching experiences:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      <SEO
        title="Experiencia Laboral & Trayectoria | Mateo Largo"
        description="Línea de tiempo profesional, empresas, cargos, logros técnicos y tecnologías empleadas."
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-blue-400">
          Trayectoria Profesional
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl serif font-normal text-white">
          Experiencia Laboral
        </h1>
        <p className="text-sm sm:text-base text-white/50 leading-relaxed font-sans">
          Historial de roles técnicos, proyectos corporativos y tecnologías empleadas.
        </p>
      </div>

      {/* Timeline */}
      <div className="relative pt-6">
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-40 rounded-xl bg-white/[0.03] border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-12 text-center archive-card rounded-xl border border-dashed border-white/10 space-y-3">
            <Briefcase className="w-8 h-8 text-white/30 mx-auto" />
            <p className="text-sm font-semibold text-white/70 serif">No hay experiencias registradas aún.</p>
          </div>
        ) : (
          <div>
            {experiences.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
