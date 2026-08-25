import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { SEO } from '../../components/SEO';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If already authenticated, redirect to dashboard
  if (user) {
    navigate('/admin/dashboard', { replace: true });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa correo y contraseña.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      await login(email.trim(), password.trim());
      const from = (location.state as any)?.from?.pathname || '/admin/dashboard';
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Credenciales inválidas. Verifica tu correo y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = () => {
    setEmail('admin@mateo.dev');
    setPassword('admin123456');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 bg-neutral-950 text-white relative">
      <SEO title="Acceso Administrativo | Mateo Largo" description="Portal de administración de contenidos." />

      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500 flex items-center justify-center text-white mx-auto shadow-xl">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Panel de Administración
          </h1>
          <p className="text-xs text-neutral-400">
            Ingresa tus credenciales para gestionar el portafolio, viajes y archivo de aviación.
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="p-8 rounded-3xl bg-neutral-900 border border-neutral-800 shadow-2xl space-y-5"
        >
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isSupabaseConfigured() && (
            <div className="p-3.5 rounded-xl bg-sky-950/60 border border-sky-800 text-sky-300 text-xs flex flex-col gap-1.5">
              <p className="font-semibold">Modo de Desarrollo Local Activo</p>
              <p className="text-[11px] text-sky-200/80">
                Puedes usar cualquier usuario de prueba para autenticarte localmente.
              </p>
              <button
                type="button"
                onClick={handleQuickDemoAdmin}
                className="text-left font-mono underline hover:text-white mt-0.5"
              >
                Autocompletar credenciales de prueba
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@mateo.dev"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-800 text-white rounded-xl border border-neutral-700 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-neutral-800 text-white rounded-xl border border-neutral-700 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            id="admin-login-submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-neutral-950 font-bold text-sm shadow-md transition-all hover:scale-[1.01]"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Autenticando...</span>
              </>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to public site */}
        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver al sitio público</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
