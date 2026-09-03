import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Profile, SocialLink } from '../types';
import { initialProfile, initialSocialLinks } from '../data/seedData';

const LOCAL_PROFILE_KEY = 'portfolio_profile_data';
const LOCAL_SOCIAL_KEY = 'portfolio_social_links';

export const profileService = {
  async getProfile(): Promise<Profile> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.from('profiles').select('*').limit(1).single();
        if (error && error.code !== 'PGRST116') {
          console.warn('Error fetching profile from Supabase:', error);
        }
        if (data) return data as Profile;
      } catch (err) {
        console.warn('Profile fetch exception:', err);
      }
    }

    const local = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed && (parsed.bio?.includes('más de 6 años') || parsed.profession?.includes('Senior Full-Stack Engineer & Aviation Spotter'))) {
          // Reset to clean initial profile
          localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(initialProfile));
          return initialProfile;
        }
        return parsed;
      } catch {
        return initialProfile;
      }
    }
    return initialProfile;
  },

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    if (isSupabaseConfigured()) {
      const current = await this.getProfile();
      if (current.id && current.id !== 'default-profile-id') {
        const { data, error } = await supabase
          .from('profiles')
          .update(profile)
          .eq('id', current.id)
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data as Profile;
      } else {
        const { id: _ignoredId, ...profileData } = profile;
        const { data, error } = await supabase
          .from('profiles')
          .insert([profileData])
          .select()
          .single();
        if (error) throw new Error(error.message);
        return data as Profile;
      }
    }

    const current = await this.getProfile();
    const updated = { ...current, ...profile, updated_at: new Date().toISOString() };
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated));
    return updated;
  },

  async getSocialLinks(): Promise<SocialLink[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('social_links')
          .select('*')
          .order('order_index', { ascending: true });
        if (error) console.warn('Error fetching social links:', error);
        if (data && data.length > 0) return data as SocialLink[];
      } catch (e) {
        console.warn('Social links fetch exception:', e);
      }
    }

    const local = localStorage.getItem(LOCAL_SOCIAL_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          return parsed.filter((s) => !['1', '2', '3', '4'].includes(s.id));
        }
      } catch {
        return initialSocialLinks;
      }
    }
    return initialSocialLinks;
  },

  async updateSocialLinks(links: SocialLink[]): Promise<SocialLink[]> {
    if (isSupabaseConfigured()) {
      // Clear and re-insert or upsert
      await supabase.from('social_links').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      const { data, error } = await supabase.from('social_links').insert(links).select();
      if (error) throw new Error(error.message);
      return (data || []) as SocialLink[];
    }

    localStorage.setItem(LOCAL_SOCIAL_KEY, JSON.stringify(links));
    return links;
  },

  async createSocialLink(link: Omit<SocialLink, 'id'>): Promise<SocialLink> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('social_links')
        .insert([link])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as SocialLink;
    }

    const current = await this.getSocialLinks();
    const newLink: SocialLink = {
      ...link,
      id: `link-${Date.now()}`,
    };
    await this.updateSocialLinks([...current, newLink]);
    return newLink;
  },

  async deleteSocialLink(id: string): Promise<void> {
    const current = await this.getSocialLinks();
    const filtered = current.filter((l) => l.id !== id);
    await this.updateSocialLinks(filtered);
  },
};
