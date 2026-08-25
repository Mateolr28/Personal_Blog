import React from 'react';
import { Code, Database, Server, Cpu, Wrench, Layers } from 'lucide-react';
import { Technology } from '../types';

interface TechnologyCardProps {
  technology: Technology;
}

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Frontend':
      return <Code className="w-4 h-4 text-sky-500" />;
    case 'Backend':
      return <Server className="w-4 h-4 text-emerald-500" />;
    case 'Database':
      return <Database className="w-4 h-4 text-amber-500" />;
    case 'DevOps':
      return <Cpu className="w-4 h-4 text-purple-500" />;
    case 'Tools':
      return <Wrench className="w-4 h-4 text-rose-500" />;
    default:
      return <Layers className="w-4 h-4 text-indigo-500" />;
  }
};

const getLevelBadgeColor = (level: string) => {
  switch (level) {
    case 'Expert':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800/40';
    case 'Advanced':
      return 'bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800/40';
    case 'Intermediate':
      return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40';
    default:
      return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
  }
};

export const TechnologyCard: React.FC<TechnologyCardProps> = ({ technology }) => {
  return (
    <div
      id={`tech-card-${technology.name.toLowerCase().replace(/\s+/g, '-')}`}
      className="p-5 rounded-xl archive-card flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10">
            {technology.icon_url ? (
              <img src={technology.icon_url} alt={technology.name} className="w-5 h-5 object-contain" />
            ) : (
              getCategoryIcon(technology.category)
            )}
          </div>

          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-500/30">
            {technology.level}
          </span>
        </div>

        <div className="text-[10px] text-white/40 font-mono tracking-wider uppercase mb-0.5">
          {technology.category}
        </div>

        <h4 className="text-base font-semibold text-white serif">
          {technology.name}
        </h4>

        {technology.description && (
          <p className="mt-1.5 text-xs text-white/50 line-clamp-2 leading-relaxed">
            {technology.description}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40 font-mono">
        <span>STACK / {technology.category.toUpperCase()}</span>
        {technology.years_of_experience && (
          <span>{technology.years_of_experience} {technology.years_of_experience === 1 ? 'año' : 'años'}</span>
        )}
      </div>
    </div>
  );
};
