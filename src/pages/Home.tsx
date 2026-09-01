import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Plane,
  Compass,
  FolderGit2,
  User,
  Sparkles,
  MapPin,
  Mail,
  Github,
  Linkedin,
  Instagram,
  Terminal,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import { profileService } from "../services/profileService";
import { projectService } from "../services/projectService";
import { travelService } from "../services/travelService";
import { aviationService } from "../services/aviationService";
import { technologyService } from "../services/technologyService";
import {
  Profile,
  Project,
  Travel,
  Aviation,
  Technology,
  SocialLink,
} from "../types";
import { ProjectCard } from "../components/ProjectCard";
import { TravelCard } from "../components/TravelCard";
import { AircraftCard } from "../components/AircraftCard";
import { SEO } from "../components/SEO";

export const Home: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [travels, setTravels] = useState<Travel[]>([]);
  const [aviationList, setAviationList] = useState<Aviation[]>([]);
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prof, soc, proj, trav, av, tech] = await Promise.all([
          profileService.getProfile(),
          profileService.getSocialLinks(),
          projectService.getAll(true),
          travelService.getAll(true),
          aviationService.getAll(true),
          technologyService.getAll(),
        ]);
        setProfile(prof);
        setSocialLinks(soc);
        setProjects(proj.slice(0, 3));
        setTravels(trav.slice(0, 3));
        setAviationList(av.slice(0, 4));
        setTechnologies(tech.slice(0, 8));
      } catch (err) {
        console.error("Error fetching home data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      <SEO
        title={`${profile?.full_name || "Mateo Largo"} | Software Engineer, Traveler & Aviation Spotter`}
        description={
          profile?.short_bio ||
          "Portafolio profesional, bitácora de viajes y archivo digital de fotografía aeronáutica."
        }
      />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative pt-8 sm:pt-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Subtle obsidian glow accents */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-blue-900/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-center">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 flex items-center justify-center border border-blue-400/30 shadow-lg">
                <Plane className="w-5 h-5 -rotate-45 text-white" />
              </div>
              <div className="leading-tight">
                <div className="text-lg font-semibold text-white tracking-tight">mateolargo.site</div>
                <div className="text-[11px] text-white/50 font-mono tracking-wide">
                  https://www.mateolargo.site
                </div>
              </div>
            </div>

            {/* Status Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded admin-badge text-[10px] font-mono font-bold tracking-widest uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Software Engineer</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl serif font-light text-white leading-[1.08] tracking-tight">
              Capturando ideas,{" "}
              <span className="italic text-blue-400 font-normal">
                construyendo proyectos
              </span>{" "}
              & <span className="italic font-normal">explorando el mundo</span>.
            </h1>

            <p className="text-base sm:text-lg text-white/50 leading-relaxed max-w-xl">
              {profile?.short_bio ||
                "Un espacio personal donde comparto mi camino en la ingeniería de software, mis proyectos, viajes y mi pasión por la aviación."}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/projects"
                id="hero-cta-projects"
                className="inline-flex items-center gap-2 bg-white text-black px-7 py-3 font-semibold rounded-sm text-sm hover:bg-neutral-200 shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Explorar Proyectos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/aviation"
                id="hero-cta-aviation"
                className="inline-flex items-center gap-2 border border-white/20 px-7 py-3 font-semibold rounded-sm text-sm text-white hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plane className="w-4 h-4 -rotate-45" />
                <span>Bitácora de Aviación</span>
              </Link>

              <Link
                to="/travel"
                id="hero-cta-travel"
                className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white uppercase tracking-wider font-mono transition-colors"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Viajes &rarr;</span>
              </Link>
            </div>

            {/* Core Tech Minimal Row */}
            <div className="pt-6 border-t border-white/5 flex items-center gap-6 text-white/40">
              <span className="text-[10px] uppercase tracking-[0.2em] font-mono">
                Core Stack
              </span>
              <div className="flex gap-4 text-xs font-mono">
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-white/70">
                  React
                </span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-white/70">
                  TypeScript
                </span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-white/70">
                  Supabase
                </span>
                <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/10 text-white/70">
                  PostgreSQL
                </span>
              </div>
            </div>
          </motion.div>

          {/* Hero Avatar / Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-5 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm">
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-neutral-950 archive-card flex flex-col justify-end">
                {profile?.avatar_url ? (
                  <>
                    <img
                      src={profile.avatar_url}
                      alt={profile?.full_name || "Mateo"}
                      className="w-full h-full object-cover absolute inset-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-transparent to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-b from-blue-950/20 to-black">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 border border-blue-400/30 shadow-lg flex items-center justify-center mb-4">
                      <Plane className="w-10 h-10 -rotate-45 text-white" />
                    </div>
                    <div className="text-xs font-mono uppercase tracking-widest text-white/40">
                      Archivo Digital Personal
                    </div>
                    <div className="text-[10px] font-mono text-white/30 mt-1">
                      {profile?.email || "mateolriadev@gmail.com"}
                    </div>
                  </div>
                )}

                {/* Floating Info inside Hero */}
                <div className="relative z-10 m-4 p-4 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold serif tracking-wide">
                      {profile?.full_name || "Mateo Largo"}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-blue-600/80 rounded uppercase tracking-wider">
                      {profile?.profession ? "Perfil" : "Ingeniería"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/60 font-mono">
                    <MapPin className="w-3 h-3 text-blue-400" />
                    <span>{profile?.location || "Bogotá, Colombia"}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CORE TECHNOLOGIES & STACK */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-white/5 pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400">
              Stack Tecnológico
            </span>
            <h2 className="text-2xl sm:text-3xl serif font-normal text-white mt-1">
              Herramientas & Especialidades
            </h2>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-400 hover:text-white transition-colors"
          >
            Ver stack completo
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {technologies.length === 0 ? (
          <div className="p-8 rounded-xl archive-card text-center text-white/40 font-mono text-xs border border-dashed border-white/10">
            <span>No hay tecnologías registradas aún.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {technologies.map((tech) => (
              <div
                key={tech.id}
                className="p-4 rounded-lg archive-card flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-sm font-semibold text-white">
                    {tech.name}
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                  {tech.level}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 3. FEATURED PROJECTS */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-white/5 pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400">
              Desarrollo & Software
            </span>
            <h2 className="text-2xl sm:text-3xl serif font-normal text-white mt-1">
              Proyectos Destacados
            </h2>
          </div>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-400 hover:text-white transition-colors"
          >
            Explorar todos los proyectos
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 rounded-xl archive-card text-center space-y-3 border border-dashed border-white/10">
            <FolderGit2 className="w-8 h-8 text-white/30 mx-auto" />
            <h3 className="text-sm font-semibold text-white/80 serif">
              No hay proyectos publicados aún
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 4. AVIATION SPOTTER ARCHIVE TEASER */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-10 rounded-2xl bg-white/[0.02] border border-white/10 text-white shadow-2xl relative overflow-hidden">
          {/* Subtle plane silhouette decor */}
          <Plane className="absolute right-[-40px] top-[-40px] w-96 h-96 text-white/[0.02] pointer-events-none -rotate-12" />

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8 relative z-10 border-b border-white/5 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-blue-950/60 text-blue-400 text-[10px] font-mono uppercase tracking-widest border border-blue-500/30 mb-3">
                <Plane className="w-3 h-3 -rotate-45" />
                <span>Civil Aviation Spotting Archive</span>
              </div>
              <h2 className="text-3xl sm:text-4xl serif font-normal tracking-tight">
                Fotografía & Registro Aeronáutico
              </h2>
              <p className="mt-2 text-sm text-white/50 max-w-2xl leading-relaxed">
                Archivo digital de aeronaves comerciales con matrículas,
                modelos, especificaciones técnicas y aeropuertos.
              </p>
            </div>

            <Link
              to="/aviation"
              className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 font-semibold rounded-sm text-xs uppercase tracking-wider hover:bg-neutral-200 transition-all hover:scale-105 shrink-0"
            >
              <span>Ver archivo completo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Aviation Spotting Grid */}
          {aviationList.length === 0 ? (
            <div className="p-10 rounded-xl archive-card text-center space-y-2 relative z-10 border border-dashed border-white/10">
              <Plane className="w-8 h-8 text-white/30 mx-auto -rotate-45" />
              <p className="text-xs text-white/40 font-mono">
                No hay aeronaves registradas en el archivo todavía.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
              {aviationList.map((plane) => (
                <AircraftCard key={plane.id} aircraft={plane} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. RECENT TRAVELS */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-white/5 pb-4">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-blue-400">
              Bitácora Fotográfica
            </span>
            <h2 className="text-2xl sm:text-3xl serif font-normal text-white mt-1">
              Últimos Viajes & Expediciones
            </h2>
          </div>
          <Link
            to="/travel"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-blue-400 hover:text-white transition-colors"
          >
            Ver todos los destinos
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {travels.length === 0 ? (
          <div className="p-12 rounded-xl archive-card text-center space-y-3 border border-dashed border-white/10">
            <Compass className="w-8 h-8 text-white/30 mx-auto" />
            <h3 className="text-sm font-semibold text-white/80 serif">
              No hay bitácoras de viaje publicadas aún
            </h3>
            <p className="text-xs text-white/40 font-mono max-w-md mx-auto">
              Las bitácoras de viajes y expediciones que agregues aparecerán
              aquí.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {travels.map((travel) => (
              <TravelCard key={travel.id} travel={travel} />
            ))}
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* 6. CONTACT CTA */}
      {/* ========================================================================= */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-400 border border-blue-500/20 flex items-center justify-center mx-auto">
            <Mail className="w-5 h-5" />
          </div>

          <h2 className="text-2xl sm:text-3xl serif font-normal text-white max-w-xl mx-auto leading-tight">
            ¿Tienes un proyecto en mente o quieres conversar sobre aviación y
            tecnología?
          </h2>

          <p className="text-sm text-white/50 max-w-md mx-auto leading-relaxed">
            Escríbeme para colaborar en proyectos de ingeniería de software,
            publicaciones o fotografía aeronáutica.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-sm bg-white text-black font-semibold text-sm shadow hover:bg-neutral-200 transition-all hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              <span>Enviar mensaje</span>
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-sm border border-white/20 text-white font-semibold text-sm hover:bg-white/5 transition-colors"
            >
              <span>Conoce más de mi perfil</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
