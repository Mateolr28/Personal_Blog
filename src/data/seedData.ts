import {
  Profile,
  SocialLink,
  Experience,
  Technology,
  Project,
  Travel,
  Aviation,
  ContactMessage,
} from '../types';

export const initialProfile: Profile = {
  id: 'default-profile-id',
  full_name: 'Mateo Largo',
  profession: '',
  short_bio: '',
  bio: '',
  location: '',
  email: 'mateolriadev@gmail.com',
  avatar_url: '',
  hero_title: '',
  hero_subtitle: '',
  resume_url: '',
  interests: [],
};

export const initialSocialLinks: SocialLink[] = [];

export const initialExperiences: Experience[] = [];

export const initialTechnologies: Technology[] = [];

export const initialProjects: Project[] = [];

export const initialTravels: Travel[] = [];

export const initialAviation: Aviation[] = [];

export const initialMessages: ContactMessage[] = [];

