import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MapPin, Github, Linkedin, Instagram, Youtube, Loader2 } from 'lucide-react';
import { contactService } from '../services/contactService';
import { SEO } from '../components/SEO';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Por favor introduce un correo electrónico válido.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      await contactService.sendMessage({
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim() || undefined,
        message: message.trim(),
      });

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('Error sending contact message:', err);
      setError(err.message || 'Error al enviar el mensaje. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      <SEO
        title="Contacto & Redes | Mateo Largo"
        description="Ponte en contacto para proyectos de desarrollo de software, fotografía aeronáutica o colaboraciones."
      />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
          Hablemos
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white">
          Contacto & Colaboración
        </h1>
        <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
          ¿Tienes una propuesta técnica, una consulta sobre mis bitácoras o deseas utilizar alguna fotografía? Envíame un mensaje.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Contact Info Col */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
              Información de Contacto
            </h2>

            <div className="space-y-4 text-sm text-neutral-600 dark:text-neutral-300">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase">Correo Directo</p>
                  <a
                    href="mailto:mateolriadev@gmail.com"
                    className="font-medium text-neutral-900 dark:text-white hover:text-sky-500 transition-colors"
                  >
                    mateolriadev@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-400 uppercase">Ubicación</p>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    Bogotá, Colombia (Zona Horaria UTC-5)
                  </p>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Redes & Perfiles
              </p>
              <div className="flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-sky-500 dark:hover:text-sky-400 border border-neutral-200 dark:border-neutral-700 transition-all hover:scale-105 shadow-sm"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-sky-500 dark:hover:text-sky-400 border border-neutral-200 dark:border-neutral-700 transition-all hover:scale-105 shadow-sm"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-sky-500 dark:hover:text-sky-400 border border-neutral-200 dark:border-neutral-700 transition-all hover:scale-105 shadow-sm"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-2xl bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-sky-500 dark:hover:text-sky-400 border border-neutral-200 dark:border-neutral-700 transition-all hover:scale-105 shadow-sm"
                  aria-label="YouTube"
                >
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Col */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-5"
          >
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
              Envíame un Mensaje
            </h2>

            {success && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>
                  ¡Mensaje enviado con éxito! Te responderé lo antes posible.
                </span>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Nombre completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Correo electrónico <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Asunto / Motivo
              </label>
              <input
                type="text"
                placeholder="Ej. Propuesta de proyecto, Consulta técnica..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Mensaje <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={5}
                placeholder="Cuéntame en detalle tu propuesta o consulta..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 text-sm bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:border-sky-500 resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando mensaje...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Enviar mensaje</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
