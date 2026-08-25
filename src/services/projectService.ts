import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Project } from '../types';
import { initialProjects } from '../data/seedData';

const LOCAL_KEY = 'portfolio_projects_data';

export const projectService = {
  async getAll(onlyPublished: boolean = true): Promise<Project[]> {
    if (isSupabaseConfigured()) {
      try {
        let query = supabase.from('projects').select('*').order('order_index', { ascending: true });
        if (onlyPublished) {
          query = query.eq('published', true);
        }
        const { data, error } = await query;
        if (error) console.warn('Error fetching projects:', error);
        if (data && data.length > 0) return data as Project[];
      } catch (e) {
        console.warn('Projects fetch exception:', e);
      }
    }

    const local = localStorage.getItem(LOCAL_KEY);
    let list: Project[] = initialProjects;
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          list = parsed.filter((p) => !['proj-1', 'proj-2', 'proj-3'].includes(p.id));
        }
      } catch {
        list = initialProjects;
      }
    }
    return onlyPublished ? list.filter((p) => p.published) : list;
  },

  async getBySlugOrId(slugOrId: string): Promise<Project | null> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .or(`slug.eq.${slugOrId},id.eq.${slugOrId}`)
          .single();
        if (!error && data) return data as Project;
      } catch (e) {
        console.warn('Project detail exception:', e);
      }
    }

    const list = await this.getAll(false);
    return list.find((p) => p.slug === slugOrId || p.id === slugOrId) || null;
  },

  async create(project: Omit<Project, 'id'>): Promise<Project> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Project;
    }

    const list = await this.getAll(false);
    const newItem: Project = {
      ...project,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const updated = [newItem, ...list];
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return newItem;
  },

  async update(id: string, project: Partial<Project>): Promise<Project> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('projects')
        .update(project)
        .eq('id', id)
        .select()
        .single();
      if (error) throw new Error(error.message);
      return data as Project;
    }

    const list = await this.getAll(false);
    const updated = list.map((item) =>
      item.id === id ? { ...item, ...project, updated_at: new Date().toISOString() } : item
    );
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return updated.find((item) => item.id === id)!;
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw new Error(error.message);
      return;
    }

    const list = await this.getAll(false);
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
  },
};
