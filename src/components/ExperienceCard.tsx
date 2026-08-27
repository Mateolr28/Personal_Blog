import React from 'react';
import { Briefcase, Calendar, CheckCircle2 } from 'lucide-react';
import { Experience } from '../types';
import { formatDate } from '../lib/utils';

interface ExperienceCardProps {
  experience: Experience;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  return (
    <div
      id={`experience-item-${experience.id}`}
      className="relative pl-8 sm:pl-10 group before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-0 before:w-px before:bg-white/10 last:before:hidden pb-10"
    >
      {/* Node Dot */}
      <div className="absolute left-1.5 sm:left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border border-blue-400 bg-[#080808] group-hover:scale-125 transition-transform" />

      <div className="p-6 rounded-xl archive-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
          <div>
            <div className="text-[10px] text-blue-400 font-mono tracking-wider uppercase mb-1">
              EXP / {experience.company}
            </div>
            <h3 className="text-lg font-semibold text-white serif">
              {experience.role}
            </h3>
            <p className="text-xs font-mono text-white/60 flex items-center gap-1.5 mt-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              {experience.company}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-white/40">
            <Calendar className="w-3.5 h-3.5" />
            <span>
              {formatDate(experience.start_date)} -{' '}
              {experience.current ? (
                <span className="text-emerald-400 font-semibold">
                  Actualmente
                </span>
              ) : (
                formatDate(experience.end_date)
              )}
            </span>
          </div>
        </div>

        {experience.description && (
          <div className="mt-3 space-y-3 text-xs sm:text-sm text-white/60 leading-relaxed">
            {experience.description
              .split(/\n\s*\n/)
              .filter((paragraph) => paragraph.trim())
              .map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line">
                  {paragraph.trim()}
                </p>
              ))}
          </div>
        )}

        {experience.achievements && experience.achievements.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
              Puntos destacados
            </p>
            {experience.achievements.map((achievement, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-white/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>{achievement}</span>
              </div>
            ))}
          </div>
        )}

        {experience.technologies && experience.technologies.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
            {experience.technologies.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[10px] font-mono bg-white/[0.04] text-white/70 rounded border border-white/10"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
