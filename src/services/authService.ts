import { supabase, isSupabaseConfigured } from '../lib/supabase';

const LOCAL_ADMIN_KEY = 'portfolio_admin_session';

export interface UserSession {
  id: string;
  email: string;
  role: string;
}

export const authService = {
  /**
   * Log in with Email and Password using Supabase Auth
   */
  async login(email: string, password: string): Promise<UserSession> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || 'Credenciales inválidas');
      }

      if (!data.user) {
        throw new Error('No se pudo autenticar el usuario.');
      }

      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (adminError || !adminData) {
        await supabase.auth.signOut();
        throw new Error('El usuario está autenticado, pero no está registrado como administrador.');
      }

      return {
        id: data.user.id,
        email: data.user.email || email,
        role: adminData.role,
      };
    } else {
      // Local fallback mode when Supabase variables are not yet configured in UI
      // Allows testing full admin CRUD functionality
      if (!email || !password) {
        throw new Error('Por favor ingresa email y contraseña');
      }

      const mockSession: UserSession = {
        id: 'admin-local-uuid',
        email,
        role: 'admin',
      };

      localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(mockSession));
      return mockSession;
    }
  },

  /**
   * Log out current session
   */
  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(LOCAL_ADMIN_KEY);
  },

  /**
   * Get current authenticated user session
   */
  async getCurrentSession(): Promise<UserSession | null> {
    if (isSupabaseConfigured()) {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) return null;

      const { data: adminData } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', data.session.user.id)
        .single();

      if (!adminData) return null;

      return {
        id: data.session.user.id,
        email: data.session.user.email || '',
        role: adminData.role,
      };
    } else {
      const saved = localStorage.getItem(LOCAL_ADMIN_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return null;
        }
      }
      return null;
    }
  },

  /**
   * Check if the user is authorized admin
   */
  async isAdmin(): Promise<boolean> {
    const session = await this.getCurrentSession();
    return Boolean(session);
  },
};
