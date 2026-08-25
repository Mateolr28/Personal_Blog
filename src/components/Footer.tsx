import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Github, Linkedin, Instagram, Youtube, Heart, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="main-footer" className="border-t border-white/10 bg-[#080808]/90 backdrop-blur-md pt-16 pb-12 text-[#e0e0e0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/5">
          {/* Col 1: Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3 font-bold text-white">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center text-white border border-blue-400/30">
                <Plane className="w-3.5 h-3.5 -rotate-45" />
              </div>
              <span className="text-lg font-bold tracking-tight serif italic">MR.ARCHIVE</span>
            </div>
            <p className="text-sm text-white/50 max-w-md leading-relaxed">
              Un archivo digital de proyectos de ingeniería de software, bitácoras de viajes internacionales y fotografía de aviación civil comercial.
            </p>
            <div className="flex items-center gap-2 text-xs text-white/40 font-mono">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              <span>Bogotá (BOG / SKBO) & Worldwide</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40">
              Índice
            </p>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Sobre mí
                </Link>
              </li>
              <li>
                <Link to="/experience" className="hover:text-white transition-colors">
                  Experiencia Laboral
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  Proyectos & Código
                </Link>
              </li>
              <li>
                <Link to="/travel" className="hover:text-white transition-colors">
                  Bitácora de Viajes
                </Link>
              </li>
              <li>
                <Link to="/aviation" className="hover:text-white transition-colors">
                  Archivo de Aviación
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Social & Admin Access */}
          <div className="space-y-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40">
              Conexión
            </p>
            <div className="flex items-center gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-blue-500/50 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-blue-500/50 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-blue-500/50 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-white/[0.04] border border-white/10 text-white/70 hover:text-white hover:border-blue-500/50 transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
            <div className="pt-2 flex flex-col gap-1 text-xs">
              <span className="text-white/40 font-mono">mateolriadev@gmail.com</span>
              <Link to="/admin/login" className="text-white/40 hover:text-blue-400 underline underline-offset-4 text-[11px] font-mono transition-colors">
                Acceso Admin &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom copyright & Status */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] uppercase tracking-widest text-white/40 font-mono gap-4">
          <p>© {currentYear} MATEO LARGO ARCHIVE. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span>React + Supabase Stack</span>
            <span className="text-emerald-400">System: Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
