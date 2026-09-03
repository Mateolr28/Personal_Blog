import React from 'react';
import {
  Facebook,
  Github,
  Globe2,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  Twitter,
  Youtube,
} from 'lucide-react';
import { SocialLink } from '../types';

interface SocialLinksProps {
  links: SocialLink[];
  className?: string;
  linkClassName?: string;
  iconClassName?: string;
}

const getSocialIcon = (link: SocialLink) => {
  const icon = link.icon.toLowerCase().trim();
  const platform = link.platform.toLowerCase();

  if (icon === 'github' || platform.includes('github')) return Github;
  if (icon === 'linkedin' || platform.includes('linkedin')) return Linkedin;
  if (icon === 'instagram' || platform.includes('instagram')) return Instagram;
  if (icon === 'youtube' || platform.includes('youtube')) return Youtube;
  if (icon === 'twitter' || icon === 'x' || platform.includes('twitter')) return Twitter;
  if (icon === 'facebook' || platform.includes('facebook')) return Facebook;
  if (icon === 'globe' || icon === 'globe2' || icon === 'website') return Globe2;
  return LinkIcon;
};

const getExternalUrl = (url: string) => {
  const trimmedUrl = url.trim();
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(trimmedUrl)) return trimmedUrl;
  return `https://${trimmedUrl}`;
};

const getSocialUrl = (link: SocialLink) => {
  const platform = link.platform.toLowerCase();
  const icon = link.icon.toLowerCase().trim();
  const externalUrl = getExternalUrl(link.url);

  if (icon === 'linkedin' || platform.includes('linkedin')) {
    try {
      const hostname = new URL(externalUrl).hostname.toLowerCase();
      if (hostname === 'linkedin.com' || hostname === 'www.linkedin.com') {
        const pathname = new URL(externalUrl).pathname.toLowerCase();
        if (pathname.startsWith('/in/') || pathname.startsWith('/pub/')) {
          return externalUrl;
        }
      }
    } catch {}
    return 'https://www.linkedin.com/in/mateolr';
  }

  return externalUrl;
};

export const SocialLinks: React.FC<SocialLinksProps> = ({
  links,
  className = '',
  linkClassName = '',
  iconClassName = 'w-4 h-4',
}) => {
  if (links.length === 0) return null;

  return (
    <div className={className}>
      {links.map((link, index) => {
        const Icon = getSocialIcon(link);
        return (
          <a
            key={link.id || `${link.platform}-${index}`}
            href={getSocialUrl(link)}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
            aria-label={link.platform}
            title={link.platform}
          >
            <Icon className={iconClassName} />
          </a>
        );
      })}
    </div>
  );
};
