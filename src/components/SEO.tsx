import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SITE_URL = 'https://www.mateolargo.site';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

export const SEO: React.FC<SEOProps> = ({
  title = 'Mateo Largo | Software Engineer & Aviation Spotter',
  description = 'Portafolio profesional, bitácora de viajes y archivo digital de fotografía aeronáutica.',
  image = `${SITE_URL}/og-image.jpg`,
}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    const url = `${SITE_URL}${pathname}`;

    document.title = title;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:image', image);
    // Keep the admin console out of search results
    setMeta('name', 'robots', pathname.startsWith('/admin') ? 'noindex, nofollow' : 'index, follow');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, image, pathname]);

  return null;
};
