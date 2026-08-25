import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Calendar, MapPin, ArrowRight, Camera, Video } from 'lucide-react';
import { Aviation } from '../types';
import { formatShortDate } from '../lib/utils';

interface AircraftCardProps {
  aircraft: Aviation;
  onQuickView?: (aircraft: Aviation) => void;
}

export const AircraftCard: React.FC<AircraftCardProps> = ({ aircraft }) => {
  const photosCount = (aircraft.gallery?.length || 0) + (aircraft.main_image ? 1 : 0);

  return (
    <div
      id={`aircraft-card-${aircraft.registration}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl archive-card p-4 transition-all duration-300"
    >
      <div>
        {/* Spotter Photograph */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-neutral-900 mb-4 border border-white/5">
          <img
            src={aircraft.main_image}
            alt={`${aircraft.model} - ${aircraft.registration}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Registration Tag */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-0.5 bg-black/70 backdrop-blur-md text-blue-400 border border-blue-500/30 rounded font-mono text-[10px] font-bold tracking-wider">
            <Plane className="w-3 h-3 -rotate-45" />
            <span>{aircraft.registration}</span>
          </div>

          {/* Manufacturer Chip */}
          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/10 backdrop-blur-md text-white text-[10px] font-mono rounded">
            {aircraft.manufacturer}
          </div>

          {/* Airport & City */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[11px] font-mono">
            <div className="flex items-center gap-1 text-white/80 truncate max-w-[65%]">
              <MapPin className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="truncate">{aircraft.airport_code} · {aircraft.city}</span>
            </div>

            <span className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded text-[10px] text-white/60">
              <Calendar className="w-2.5 h-2.5" />
              {formatShortDate(aircraft.photo_date)}
            </span>
          </div>
        </div>

        {/* Technical & Spotting Specs */}
        <div>
          <div className="text-[10px] text-blue-400 font-mono tracking-wider uppercase mb-1">
            AVIATION / {aircraft.registration}
          </div>

          <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1 serif">
            {aircraft.model}
          </h3>

          <div className="flex items-center justify-between text-xs text-white/60 mt-1 mb-2">
            <span className="font-medium text-white/80">{aircraft.airline}</span>
            {aircraft.aircraft_type && (
              <span className="text-[10px] font-mono text-white/40 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/5">
                {aircraft.aircraft_type}
              </span>
            )}
          </div>

          {aircraft.description && (
            <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
              {aircraft.description}
            </p>
          )}

          {/* Media Badges */}
          <div className="mt-3 flex items-center gap-3 text-[11px] font-mono text-white/40">
            <span className="flex items-center gap-1">
              <Camera className="w-3 h-3 text-blue-400" />
              {photosCount} {photosCount === 1 ? 'foto' : 'fotos'}
            </span>
            {aircraft.videos && aircraft.videos.length > 0 && (
              <span className="flex items-center gap-1 text-blue-400">
                <Video className="w-3 h-3" />
                Video
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
        <Link
          to={`/aviation/${aircraft.id || aircraft.registration}`}
          className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-blue-400 hover:text-white transition-colors"
        >
          Ficha técnica & fotos
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
