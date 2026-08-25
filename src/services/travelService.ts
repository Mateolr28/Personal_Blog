import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Travel } from '../types';
import { initialTravels } from '../data/seedData';

const LOCAL_KEY = 'portfolio_travels_data';

export const travelService = {
  async getAll(onlyPublished: boolean = true): Promise<Travel[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('travels').select('*').order('date', { ascending: false });
        if (onlyPublished) {
          query = query.eq('published', true);
        }
        const { data, error } = await query;
        if (error) console.warn('Error fetching travels:', error);
        if (data && data.length > 0) return data as Travel[];
      } catch (e) {
        console.warn('Travels fetch exception:', e);
      }
    }

    const local = localStorage.getItem(LOCAL_KEY);
    let list: Travel[] = initialTravels;
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          list = parsed.filter((t) => !['trav-1', 'trav-2', 'trav-3'].includes(t.id));
        }
      } catch {
        list = initialTravels;
      }
    }
    return onlyPublished ? list.filter((t) => t.published) : list;
  },

  async getBySlugOrId(slugOrId: string): Promise<Travel | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('travels')
          .select('*')
          .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
          .single();
        if (!error && data) return data as Travel;
      } catch (e) {
        console.warn('Travel detail exception:', e);
      }
    }

    const list = await this.getAll(false);
    return list.find((t) => t.slug === slugOrId || t.id === slugOrId) || null;
  },

  async create(travel: Omit<Travel, 'id'>): Promise<Travel> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('travels')
        .insert([travel])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Travel;
    }

    const list = await this.getAll(false);
    const newItem: Travel = {
      ...travel,
      id: `trav-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newItem, ...list];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return newItem;
  },

  async update(id: string, travel: Partial<Travel>): Promise<Travel> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('travels')
        .update(travel)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Travel;
    }

    const list = await this.getAll(false);
    const updated = list.map((item) =>
      item.id === id ? { ...item, ...travel, updated_at: new Date().toISOString() } : item
    );
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return updated.find((item) => item.id === id)!;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('travels').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const list = await this.getAll(false);
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
  },
};
