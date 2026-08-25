import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Experience } from '../types';
import { initialExperiences } from '../data/seedData';

const LOCAL_KEY = 'portfolio_experiences_data';

export const experienceService = {
  async getAll(): Promise<Experience[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('experiences')
          .select('*')
          .order('start_date', { ascending: false });
        if (error) console.warn('Error fetching experiences:', error);
        if (data && data.length > 0) return data as Experience[];
      } catch (e) {
        console.warn('Experiences fetch exception:', e);
      }
    }

    const local = localStorage.getItem(LOCAL_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          return parsed.filter((e) => !['exp-1', 'exp-2', 'exp-3'].includes(e.id));
        }
      } catch {
        return initialExperiences;
      }
    }
    return initialExperiences;
  },

  async getById(id: string): Promise<Experience | null> {
    const list = await this.getAll();
    return list.find((item) => item.id === id) || null;
  },

  async create(experience: Omit<Experience, 'id'>): Promise<Experience> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('experiences')
        .insert([experience])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Experience;
    }

    const list = await this.getAll();
    const newItem: Experience = {
      ...experience,
      id: `exp-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newItem, ...list];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return newItem;
  },

  async update(id: string, experience: Partial<Experience>): Promise<Experience> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('experiences')
        .update(experience)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Experience;
    }

    const list = await this.getAll();
    const updated = list.map((item) =>
      item.id === id ? { ...item, ...experience, updated_at: new Date().toISOString() } : item
    );
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return updated.find((item) => item.id === id)!;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('experiences').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const list = await this.getAll();
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
  },
};
