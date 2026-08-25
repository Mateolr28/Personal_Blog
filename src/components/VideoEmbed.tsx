import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { getEmbedUrl } from '../lib/utils';
import { VideoMedia } from '../types';

interface VideoEmbedProps {
  video: VideoMedia;
  className?: string;
}

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ video, className = '' }) => {
  const { type, embedUrl } = getEmbedUrl(video.url, video.platform);

  return (
    <div className={`overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-black ${className}`}>
      {video.title && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium text-neutral-700 dark:text-neutral-300">
          <div className="flex items-center gap-2">
            <Play className="w-3.5 h-3.5 text-sky-500 fill-sky-500" />
            <span className="truncate">{video.title}</span>
          </div>
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-neutral-500 hover:text-sky-500 transition-colors"
          >
            Abrir
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}

      <div className="relative aspect-video w-full">
        {type === 'youtube' || type === 'vimeo' ? (
          <iframe
            src={embedUrl}
            title={video.title || 'Video Player'}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            src={video.url}
            controls
            className="w-full h-full object-cover"
            preload="metadata"
          >
            Tu navegador no soporta el elemento de video.
          </video>
        )}
      </div>
    </div>
  );
};
