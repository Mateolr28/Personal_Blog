import React, { useState } from 'react';
import {
  Settings,
  Database,
  Key,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  Server,
  HelpCircle,
  FileCode,
} from 'lucide-react';
import { isSupabaseConfigured } from '../../lib/supabase';
import { SEO } from '../../components/SEO';

export const AdminSettings: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'No configurado';
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configurado (Oculto)' : 'No configurado';

  const handleCopySql = () => {
    const sqlScript = `-- SCRIPT COMPLETO SUPABASE PARA MATEO LARGO PORTAFOLIO & AVIATION
-- Ejecuta este script en Supabase -> SQL Editor -> New Query

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  profession TEXT NOT NULL,
  short_bio TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT,
  location TEXT,
  email TEXT NOT NULL,
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  current BOOLEAN DEFAULT false,
  description TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.technologies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  level TEXT NOT NULL,
  icon_url TEXT,
  years_of_experience INT,
  description TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  main_image TEXT,
  gallery TEXT[] DEFAULT '{}',
  videos JSONB DEFAULT '[]'::jsonb,
  technologies TEXT[] DEFAULT '{}',
  demo_url TEXT,
  github_url TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.travels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  location_name TEXT,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  main_image TEXT,
  gallery TEXT[] DEFAULT '{}',
  videos JSONB DEFAULT '[]'::jsonb,
  places_visited TEXT[] DEFAULT '{}',
  coordinates JSONB DEFAULT '{"lat": 0, "lng": 0}'::jsonb,
  published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.aviation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration TEXT NOT NULL,
  model TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  airline TEXT NOT NULL,
  operator TEXT,
  country TEXT NOT NULL DEFAULT 'Colombia',
  photo_date DATE NOT NULL,
  airport_name TEXT NOT NULL,
  airport_code TEXT NOT NULL,
  city TEXT NOT NULL,
  aircraft_type TEXT NOT NULL DEFAULT 'Comercial',
  serial_number TEXT,
  description TEXT,
  main_image TEXT NOT NULL,
  gallery TEXT[] DEFAULT '{}',
  videos JSONB DEFAULT '[]'::jsonb,
  published BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- BUCKET DE ALMACENAMIENTO PARA IMÁGENES
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-media', 'portfolio-media', true)
ON CONFLICT (id) DO NOTHING;
`;
    navigator.clipboard.writeText(sqlScript);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleResetLocalStorage = () => {
    localStorage.clear();
    setResetSuccess(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <SEO title="Configuración & Diagnósticos | Admin" description="Estado de la base de datos y scripts de despliegue." />

      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Configuración del Sistema & Supabase
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Diagnósticos de conexión, variables de entorno y script SQL de base de datos.
        </p>
      </div>

      {/* Diagnostics Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-sky-400" />
          <span>Estado de la Conexión</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 space-y-1">
            <p className="text-[11px] text-neutral-400 uppercase font-mono">Modo de Operación</p>
            <p className="font-bold text-white flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isSupabaseConfigured() ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              {isSupabaseConfigured() ? 'Supabase Live Backend' : 'Almacenamiento Local (Desarrollo)'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 space-y-1">
            <p className="text-[11px] text-neutral-400 uppercase font-mono">Bucket de Storage</p>
            <p className="font-bold text-sky-400 font-mono">portfolio-media</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 space-y-1">
            <p className="text-[11px] text-neutral-400 uppercase font-mono">VITE_SUPABASE_URL</p>
            <p className="font-mono text-xs text-neutral-300 truncate">{supabaseUrl}</p>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-800/80 border border-neutral-700/60 space-y-1">
            <p className="text-[11px] text-neutral-400 uppercase font-mono">VITE_SUPABASE_ANON_KEY</p>
            <p className="font-mono text-xs text-neutral-300">{supabaseKey}</p>
          </div>
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-sky-400" />
              <span>Esquema SQL de Supabase (PostgreSQL)</span>
            </h2>
            <p className="text-xs text-neutral-400">
              Copia y pega este script en el SQL Editor de tu proyecto en Supabase.
            </p>
          </div>

          <button
            onClick={handleCopySql}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold text-xs shadow transition-transform hover:scale-105"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-950" />
                <span>¡Copiado al Portapapeles!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Script SQL</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-300 max-h-60 overflow-y-auto">
          <pre>{`-- Esquema y tablas principales
CREATE TABLE IF NOT EXISTS public.profiles (...);
CREATE TABLE IF NOT EXISTS public.experiences (...);
CREATE TABLE IF NOT EXISTS public.technologies (...);
CREATE TABLE IF NOT EXISTS public.projects (...);
CREATE TABLE IF NOT EXISTS public.travels (...);
CREATE TABLE IF NOT EXISTS public.aviation (...);
CREATE TABLE IF NOT EXISTS public.contact_messages (...);
-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-media', 'portfolio-media', true);`}</pre>
        </div>
      </div>

      {/* Local Storage & Cache Controls */}
      <div className="p-6 sm:p-8 rounded-3xl bg-neutral-900 border border-neutral-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-amber-400" />
          <span>Restablecer Datos de Demostración</span>
        </h2>
        <p className="text-xs text-neutral-400 max-w-xl">
          Si estás probando localmente y deseas reiniciar todos los datos a los valores iniciales (seed data), puedes borrar la caché local.
        </p>

        {resetSuccess && (
          <p className="text-xs font-semibold text-emerald-400">
            ¡Caché restablecida! Recargando aplicación...
          </p>
        )}

        <button
          onClick={handleResetLocalStorage}
          className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-red-500/20 text-neutral-300 hover:text-red-400 text-xs font-semibold border border-neutral-700 transition-colors"
        >
          Borrar Caché y Restablecer Semilla
        </button>
      </div>
    </div>
  );
};
