import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Camera,
  Play,
  Globe2,
  CheckCircle2,
  Navigation,
} from 'lucide-react';
import { travelService } from '../services/travelService';
import { Travel } from '../types';
import { Lightbox, LightboxImage } from '../components/Lightbox';
import { VideoEmbed } from '../components/VideoEmbed';
import { SEO } from '../components/SEO';
import { formatDate } from '../lib/utils';

export const TravelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [travel, setTravel] = useState<Travel | null>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      try {
        const data = await travelService.getBySlugOrId(id);
        setTravel(data);
      } catch (e) {
        console.error('Error loading travel detail:', e);
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
        <div className="aspect-[16/9] w-full bg-neutral-200 dark:bg-neutral-800 rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (!travel) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Destino no encontrado
        </h2>
        <p className="text-sm text-neutral-500">
          La bitácora de viaje que buscas no existe o ha sido despublicada.
        </p>
        <Link
          to="/travel"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a viajes</span>
        </Link>
      </div>
    );
  }

  const allImages: LightboxImage[] = [
    ...(travel.main_image
      ? [{ url: travel.main_image, title: `${travel.city}, ${travel.country}`, caption: travel.title }]
      : []),
    ...(travel.gallery || []).map((imgUrl, idx) => ({
      url: imgUrl,
      title: `${travel.title} - Fotografía ${idx + 1}`,
      caption: travel.location_name || `${travel.city}, ${travel.country}`,
    })),
  ];

  const handleOpenLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 pb-24">
      <SEO
        title={`${travel.title} | Bitácora de Viaje`}
        description={travel.description}
        image={travel.main_image}
      />

      {/* Back Button */}
      <button
        onClick={() => navigate('/travel')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:text-emerald-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Volver a Bitácora de Viajes</span>
      </button>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
            <MapPin className="w-3.5 h-3.5" />
            {travel.city}, {travel.country}
          </span>
          <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(travel.date)}
          </span>
          {travel.coordinates && (
            <span className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-md">
              <Navigation className="w-3 h-3 text-emerald-500" />
              {travel.coordinates.lat.toFixed(4)}°, {travel.coordinates.lng.toFixed(4)}°
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-white leading-tight">
          {travel.title}
        </h1>

        {travel.location_name && (
          <p className="text-base font-semibold text-emerald-600 dark:text-emerald-400">
            {travel.location_name}
          </p>
        )}
      </div>

      {/* Main Photo Banner */}
      {travel.main_image && (
        <div
          onClick={() => handleOpenLightbox(0)}
          className="group relative aspect-[16/9] w-full rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 cursor-pointer shadow-xl bg-neutral-100 dark:bg-neutral-900"
        >
          <img
            src={travel.main_image}
            alt={travel.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="px-4 py-2 bg-black/70 backdrop-blur-md text-white text-xs font-semibold rounded-full border border-white/20">
              Clic para ver en visor de alta resolución
            </span>
          </div>
        </div>
      )}

      {/* Places Visited Checklist */}
      {travel.places_visited && travel.places_visited.length > 0 && (
        <div className="p-6 rounded-2xl bg-neutral-100/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
            <Globe2 className="w-4 h-4 text-emerald-500" />
            <span>Lugares & Hitos Visitados</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
            {travel.places_visited.map((place, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 shadow-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="truncate">{place}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Travel Story */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Relato & Bitácora de Viaje
        </h2>
        <div className="prose dark:prose-invert max-w-none text-base text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
          {travel.description}
        </div>
      </div>

      {/* Videos */}
      {travel.videos && travel.videos.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-emerald-500" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Videos del Destino
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {travel.videos.map((vid, idx) => (
              <VideoEmbed key={idx} video={vid} />
            ))}
          </div>
        </div>
      )}

      {/* Photo Gallery Grid */}
      {travel.gallery && travel.gallery.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-500" />
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Galería Fotográfica ({travel.gallery.length} fotos)
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {travel.gallery.map((imgUrl, idx) => {
              const globalIndex = (travel.main_image ? 1 : 0) + idx;
              return (
                <div
                  key={idx}
                  onClick={() => handleOpenLightbox(globalIndex)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 cursor-pointer shadow hover:shadow-lg transition-all hover:scale-[1.02]"
                >
                  <img
                    src={imgUrl}
                    alt={`${travel.title} - Fotografía ${idx + 1}`}
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
