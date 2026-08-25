import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface LightboxImage {
  url: string;
  title?: string;
  caption?: string;
  metadata?: string;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    setCurrentIndex(initialIndex);
    setZoomLevel(1);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, images.length]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleNext = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setZoomLevel(1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <AnimatePresence>
      <div
        id="lightbox-container"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        {/* Top Controls */}
        <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-neutral-900/80 border border-neutral-800 rounded-full px-3 py-1.5 text-white">
          <button
            id="lightbox-zoom-in-btn"
            onClick={handleZoomIn}
            className="p-1.5 hover:text-amber-400 transition-colors"
            title="Acercar (+)"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            id="lightbox-zoom-out-btn"
            onClick={handleZoomOut}
            className="p-1.5 hover:text-amber-400 transition-colors"
            title="Alejar (-)"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          {zoomLevel > 1 && (
            <button
              id="lightbox-reset-zoom-btn"
              onClick={handleResetZoom}
              className="p-1.5 hover:text-amber-400 transition-colors text-xs font-mono"
              title="Restablecer tamaño"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <div className="w-px h-4 bg-neutral-700 mx-1" />
          <button
            id="lightbox-close-btn"
            onClick={onClose}
            className="p-1.5 hover:text-red-400 transition-colors"
            title="Cerrar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Counter Info */}
        <div className="absolute top-4 left-4 z-50 bg-neutral-900/80 border border-neutral-800 rounded-full px-4 py-1.5 text-xs font-medium text-neutral-300 font-mono">
          {currentIndex + 1} / {images.length}
        </div>

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            id="lightbox-prev-btn"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 transition-all hover:scale-105 active:scale-95"
            title="Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next Button */}
        {images.length > 1 && (
          <button
            id="lightbox-next-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 transition-all hover:scale-105 active:scale-95"
            title="Siguiente"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}

        {/* Main Image Stage */}
        <div className="relative max-w-6xl max-h-[82vh] flex flex-col items-center justify-center overflow-hidden">
          <motion.img
            key={currentImage.url}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: zoomLevel }}
            transition={{ duration: 0.2 }}
            src={currentImage.url}
            alt={currentImage.title || 'Fotografía'}
            className="max-h-[75vh] w-auto object-contain rounded-lg shadow-2xl transition-transform duration-150"
            referrerPolicy="no-referrer"
          />

          {/* Caption / Info bar */}
          {(currentImage.title || currentImage.caption || currentImage.metadata) && (
            <div className="mt-4 px-6 py-2.5 max-w-2xl text-center bg-neutral-900/90 border border-neutral-800/80 rounded-xl text-neutral-200 text-sm">
              {currentImage.title && <p className="font-semibold text-white">{currentImage.title}</p>}
              {currentImage.metadata && (
                <p className="text-xs text-sky-400 font-mono mt-0.5">{currentImage.metadata}</p>
              )}
              {currentImage.caption && (
                <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{currentImage.caption}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </AnimatePresence>
  );
};
