import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Aviation } from '../types';
import { initialAviation } from '../data/seedData';

const LOCAL_KEY = 'portfolio_aviation_data';

export const aviationService = {
  async getAll(onlyPublished: boolean = true): Promise<Aviation[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('aviation').select('*').order('photo_date', { ascending: false });
        if (onlyPublished) {
          query = query.eq('published', true);
        }
        const { data, error } = await query;
        if (error) console.warn('Error fetching aviation data:', error);
        if (data && data.length > 0) return data as Aviation[];
      } catch (e) {
        console.warn('Aviation fetch exception:', e);
      }
    }

    const local = localStorage.getItem(LOCAL_KEY);
    let list: Aviation[] = initialAviation;
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          list = parsed.filter((a) => !['av-1', 'av-2', 'av-3', 'av-4'].includes(a.id));
        }
      } catch {
        list = initialAviation;
      }
    }
    return onlyPublished ? list.filter((a) => a.published) : list;
  },

  async getById(id: string): Promise<Aviation | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('aviation')
          .select('*')
          .eq('id', id)
          .single();
        if (!error && data) return data as Aviation;
      } catch (e) {
        console.warn('Aviation detail exception:', e);
      }
    }

    const list = await this.getAll(false);
    return list.find((a) => a.id === id || a.registration.toLowerCase() === id.toLowerCase()) || null;
  },

  async create(item: Omit<Aviation, 'id'>): Promise<Aviation> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('aviation')
        .insert([item])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Aviation;
    }

    const list = await this.getAll(false);
    const newItem: Aviation = {
      ...item,
      id: `av-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newItem, ...list];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return newItem;
  },

  async update(id: string, item: Partial<Aviation>): Promise<Aviation> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('aviation')
        .update(item)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Aviation;
    }

    const list = await this.getAll(false);
    const updated = list.map((a) =>
      a.id === id ? { ...a, ...item, updated_at: new Date().toISOString() } : a
    );
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return updated.find((a) => a.id === id)!;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('aviation').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const list = await this.getAll(false);
    const filtered = list.filter((a) => a.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
  },
};
