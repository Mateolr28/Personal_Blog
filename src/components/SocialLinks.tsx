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
            href={link.url}
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
