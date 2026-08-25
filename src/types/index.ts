export type TechnologyCategory = 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Tools' | 'Other';
export type TechnologyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type TechCategory = TechnologyCategory;
export type TechLevel = TechnologyLevel;
export type ProjectStatus = 'development' | 'completed' | 'paused';
export type VideoPlatform = 'youtube' | 'vimeo' | 'direct';

export interface VideoMedia {
  url: string;
  platform?: VideoPlatform;
  title?: string;
}

export type MediaVideo = VideoMedia;

export interface Profile {
  id?: string;
  full_name: string;
  profession: string;
  short_bio: string;
  bio: string;
  location: string;
  email: string;
  avatar_url?: string;
  hero_title?: string;
  hero_subtitle?: string;
  resume_url?: string;
  interests?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SocialLink {
  id?: string;
  platform: string;
  url: string;
  icon: string;
  order_index?: number;
  created_at?: string;
}

export interface Experience {
  id?: string;
  company: string;
  role: string;
  start_date: string;
  end_date?: string | null;
  current: boolean;
  description: string;
  technologies: string[];
  achievements: string[];
  company_logo_url?: string;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Technology {
  id?: string;
  name: string;
  icon_url?: string;
  category: TechnologyCategory;
  level: TechnologyLevel;
  years_of_experience?: number;
  description?: string;
  order_index?: number;
  created_at?: string;
}

export interface Project {
  id?: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  main_image: string;
  gallery: string[];
  videos?: VideoMedia[];
  technologies: string[];
  date?: string;
  github_url?: string;
  demo_url?: string;
  status: ProjectStatus;
  featured: boolean;
  published: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Travel {
  id?: string;
  title: string;
  slug: string;
  country: string;
  city: string;
  date: string;
  description: string;
  main_image: string;
  gallery: string[];
  videos?: VideoMedia[];
  location_name?: string;
  coordinates?: Coordinates;
  places_visited: string[];
  published: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Aviation {
  id?: string;
  registration: string;
  model: string;
  manufacturer: string;
  airline: string;
  operator?: string;
  country: string;
  photo_date: string;
  airport_name: string;
  airport_code: string;
  city: string;
  aircraft_type: string;
  serial_number?: string;
  description?: string;
  main_image: string;
  gallery: string[];
  videos?: VideoMedia[];
  published: boolean;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  created_at?: string;
}

export interface SiteSettings {
  [key: string]: any;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
  published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at?: string;
}

export interface DashboardStats {
  projectsCount: number;
  travelsCount: number;
  aviationCount: number;
  photosCount: number;
  experiencesCount: number;
  technologiesCount: number;
  unreadMessagesCount: number;
}
