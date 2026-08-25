import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Technology } from '../types';
import { initialTechnologies } from '../data/seedData';

const LOCAL_KEY = 'portfolio_technologies_data';

export const technologyService = {
  async getAll(): Promise<Technology[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('technologies')
          .select('*')
          .order('order_index', { ascending: true });
        if (error) console.warn('Error fetching technologies:', error);
        if (data && data.length > 0) return data as Technology[];
      } catch (e) {
        console.warn('Technologies fetch exception:', e);
      }
    }

    const local = localStorage.getItem(LOCAL_KEY);
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          return parsed.filter((t) => !['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8'].includes(t.id));
        }
      } catch {
        return initialTechnologies;
      }
    }
    return initialTechnologies;
  },

  async create(tech: Omit<Technology, 'id'>): Promise<Technology> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('technologies')
        .insert([tech])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Technology;
    }

    const list = await this.getAll();
    const newItem: Technology = {
      ...tech,
      id: `tech-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    const updated = [...list, newItem];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return newItem;
  },

  async update(id: string, tech: Partial<Technology>): Promise<Technology> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('technologies')
        .update(tech)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Technology;
    }

    const list = await this.getAll();
    const updated = list.map((item) => (item.id === id ? { ...item, ...tech } : item));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return updated.find((item) => item.id === id)!;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('technologies').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const list = await this.getAll();
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
  },
};
