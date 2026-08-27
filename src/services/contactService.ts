import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ContactMessage } from '../types';
import { initialMessages } from '../data/seedData';

const LOCAL_KEY = 'portfolio_contact_messages';

export const contactService = {
  async sendMessage(msg: Omit<ContactMessage, 'id' | 'read' | 'created_at'>): Promise<void> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ ...msg, read: false }]);
      if (error) throw new Error(error.message);
      return;
    }

    const local = localStorage.getItem(LOCAL_KEY);
    const list: ContactMessage[] = local ? JSON.parse(local) : initialMessages;
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      read: false,
      created_at: new Date().toISOString(),
    };
    localStorage.setItem(LOCAL_KEY, JSON.stringify([newMsg, ...list]));
  },

  async getAll(): Promise<ContactMessage[]> {
    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('contact_messages')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) console.warn('Error fetching messages:', error);
        if (data) return data as ContactMessage[];
      } catch (e) {
        console.warn('Messages fetch exception:', e);
      }
    }

    const local = localStorage.getItem(LOCAL_KEY);
    let list: ContactMessage[] = initialMessages;
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed)) {
          list = parsed.filter((m) => m.id !== 'msg-1');
        }
      } catch {
        list = initialMessages;
      }
    }
    return list;
  },

  async getMessages(): Promise<ContactMessage[]> {
    return this.getAll();
  },

  async markAsRead(id: string, read: boolean = true): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.from('contact_messages').update({ read }).eq('id', id);
      return;
    }

    const list = await this.getAll();
    const updated = list.map((m) => (m.id === id ? { ...m, read } : m));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  },

  async delete(id: string): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.from('contact_messages').delete().eq('id', id);
      return;
    }

    const list = await this.getAll();
    const filtered = list.filter((m) => m.id !== id);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(filtered));
  },

  async deleteMessage(id: string): Promise<void> {
    return this.delete(id);
  },
};
