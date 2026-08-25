import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Camera, ArrowRight, Video } from 'lucide-react';
import { Travel } from '../types';
import { formatShortDate } from '../lib/utils';

interface TravelCardProps {
  travel: Travel;
}

export const TravelCard: React.FC<TravelCardProps> = ({ travel }) => {
  const photosCount = (travel.gallery?.length || 0) + (travel.main_image ? 1 : 0);

  return (
    <div
      id={`travel-card-${travel.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-xl archive-card p-4 transition-all duration-300"
    >
      <div>
        {/* Cover Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-neutral-900 mb-4 border border-white/5">
          <img
            src={travel.main_image || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
            alt={travel.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Location Chip */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 px-2.5 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-mono rounded border border-white/10">
            <MapPin className="w-3 h-3 text-blue-400" />
            <span>{travel.city}, {travel.country}</span>
          </div>

          {/* Counters */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-[10px] font-mono">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded text-white/80">
                <Camera className="w-2.5 h-2.5 text-blue-400" />
                {photosCount} fotos
              </span>
              {travel.videos && travel.videos.length > 0 && (
                <span className="flex items-center gap-1 bg-black/60 px-1.5 py-0.5 rounded text-blue-400">
                  <Video className="w-2.5 h-2.5" />
                  Video
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-white/60 bg-black/60 px-1.5 py-0.5 rounded">
              <Calendar className="w-2.5 h-2.5" />
              <span>{formatShortDate(travel.date)}</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="text-[10px] text-blue-400 font-mono tracking-wider uppercase mb-1">
            TRAVEL / {travel.country}
          </div>

          <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1 serif">
            {travel.title}
          </h3>

          <p className="mt-1.5 text-xs text-white/50 line-clamp-2 leading-relaxed">
            {travel.description}
          </p>

          {travel.places_visited && travel.places_visited.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {travel.places_visited.slice(0, 3).map((place) => (
                <span
                  key={place}
                  className="text-[10px] font-mono px-2 py-0.5 bg-white/[0.04] text-white/70 rounded border border-white/10"
                >
                  {place}
                </span>
              ))}
              {travel.places_visited.length > 3 && (
                <span className="text-[10px] font-mono px-1.5 py-0.5 text-white/40">
                  +{travel.places_visited.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-4 mt-4 border-t border-white/5">
        <Link
          to={`/travel/${travel.slug || travel.id}`}
          className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-blue-400 hover:text-white transition-colors"
        >
          Explorar bitácora
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};
