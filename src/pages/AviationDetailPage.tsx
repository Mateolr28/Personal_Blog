import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plane,
  Calendar,
  MapPin,
  Camera,
  Play,
  Building2,
  Tag,
  Hash,
  Globe2,
} from 'lucide-react';
import { aviationService } from '../services/aviationService';
import { Aviation } from '../types';
import { Lightbox, LightboxImage } from '../components/Lightbox';
import { VideoEmbed } from '../components/VideoEmbed';
import { SEO } from '../components/SEO';
import { formatDate } from '../lib/utils';

export const AviationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [aircraft, setAircraft] = useState<Aviation | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await aviationService.getById(id);
        setAircraft(data);
      } catch (e) {
        console.error('Error loading aviation detail:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="h-10 w-48 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse mb-8" />
        <div className="aspect-[16/10] w-full bg-neutral-200 dark:bg-neutral-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!aircraft) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Registro no encontrado
        </h2>
        <p className="text-sm text-neutral-500">
          La aeronave solicitada no existe en el archivo o ha sido retirada.
        </p>
        <Link
          to="/aviation"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al archivo de aviación</span>
        </Link>
      </div>
    );
  }

  const allImages: LightboxImage[] = [
    ...(aircraft.main_image
      ? [
          {
            url: aircraft.main_image,
            title: `${aircraft.registration} · ${aircraft.model}`,
            caption: `${aircraft.airline} | ${aircraft.airport_name} (${aircraft.airport_code})`,
            metadata: `${aircraft.manufacturer} · MSN: ${aircraft.serial_number || 'N/A'}`,
          },
        ]
      : []),
    ...(aircraft.gallery || []).map((imgUrl, idx) => ({
      url: imgUrl,
      title: `${aircraft.registration} - Fotografía ${idx + 1}`,
      caption: `${aircraft.airline} · ${aircraft.model}`,
      metadata: `${aircraft.airport_code} · ${formatDate(aircraft.photo_date)}`,
    })),
  ];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      <SEO
        title={`${aircraft.registration} (${aircraft.model}) | Archivo de Aviación`}
        description={`Ficha técnica y fotografía de ${aircraft.model} operado por ${aircraft.airline} en ${aircraft.airport_name}.`}
        image={aircraft.main_image}
      />

      {/* Back Button */}
      <button
        onClick={() => navigate('/aviation')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-sky-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a Aviación</span>
      </button>

      {/* Header Technical Banner */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-neutral-900 dark:bg-sky-950 text-sky-400 border border-sky-500/40 rounded-xl font-mono text-base font-bold tracking-wider shadow">
            <Plane className="w-4 h-4" />
            <span>{aircraft.registration}</span>
          </div>

          <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold rounded-lg">
            {aircraft.manufacturer}
          </span>

          <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(aircraft.photo_date)}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight">
          {aircraft.model}
        </h1>

        <p className="text-xl font-semibold text-sky-600 dark:text-sky-400">
          {aircraft.airline} {aircraft.operator && `(Operado por ${aircraft.operator})`}
        </p>
      </div>

      {/* Main Photographic Stage */}
      {aircraft.main_image && (
        <div
          onClick={() => handleOpenLightbox(0)}
          className="group relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 cursor-pointer shadow-2xl bg-neutral-100 dark:bg-neutral-900"
        >
          <img
            src={aircraft.main_image}
            alt={`${aircraft.model} - ${aircraft.registration}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 bg-black/70 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
              Clic para ampliar en alta definición
            </span>
          </div>
        </div>
      )}

      {/* Technical Specifications Grid */}
      <div className="p-6 rounded-3xl bg-neutral-100/80 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-800/80 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          <Plane className="w-4 h-4 text-sky-500" />
          <span>Ficha Técnica de Spotting</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 text-sm">
          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            <p className="text-[11px] text-neutral-500 uppercase font-mono">Matrícula</p>
            <p className="font-bold text-neutral-900 dark:text-white font-mono">{aircraft.registration}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            <p className="text-[11px] text-neutral-500 uppercase font-mono">Modelo</p>
            <p className="font-bold text-neutral-900 dark:text-white">{aircraft.model}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            <p className="text-[11px] text-neutral-500 uppercase font-mono">Fabricante</p>
            <p className="font-bold text-neutral-900 dark:text-white">{aircraft.manufacturer}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            <p className="text-[11px] text-neutral-500 uppercase font-mono">Aerolínea</p>
            <p className="font-bold text-neutral-900 dark:text-white">{aircraft.airline}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            <p className="text-[11px] text-neutral-500 uppercase font-mono">Aeropuerto</p>
            <p className="font-bold text-neutral-900 dark:text-white truncate">
              {aircraft.airport_code} - {aircraft.airport_name}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            <p className="text-[11px] text-neutral-500 uppercase font-mono">Ciudad & País</p>
            <p className="font-bold text-neutral-900 dark:text-white">
              {aircraft.city}, {aircraft.country}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            <p className="text-[11px] text-neutral-500 uppercase font-mono">Tipo de Aeronave</p>
            <p className="font-bold text-neutral-900 dark:text-white">{aircraft.aircraft_type || 'Comercial'}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-700/60">
            <p className="text-[11px] text-neutral-500 uppercase font-mono">Número de Serie (MSN)</p>
            <p className="font-bold text-neutral-900 dark:text-white font-mono">{aircraft.serial_number || 'N/D'}</p>
          </div>
        </div>
      </div>

      {/* Description / Spotting Notes */}
      {aircraft.description && (
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
            Notas de Avistamiento
          </h2>
          <p className="text-base text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
            {aircraft.description}
          </p>
        </div>
      )}

      {/* Videos Section */}
      {aircraft.videos && aircraft.videos.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-sky-500" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Videos & Tomas en Movimiento
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {aircraft.videos.map((vid, idx) => (
              <VideoEmbed key={idx} video={vid} />
            ))}
          </div>
        </div>
      )}

      {/* Gallery Section */}
      {aircraft.gallery && aircraft.gallery.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-sky-500" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Galería de Ángulos & Detalles ({aircraft.gallery.length} fotos)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {aircraft.gallery.map((imgUrl, idx) => {
              const globalIndex = (aircraft.main_image ? 1 : 0) + idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleOpenLightbox(globalIndex)}
                  className="group relative aspect-[16/10] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 cursor-pointer shadow hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <img
                    src={imgUrl}
                    alt={`${aircraft.registration} - Fotografía ${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs font-semibold text-white bg-black/60 px-3 py-1 rounded-full border border-white/20">
                      Ampliar
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        images={allImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};
