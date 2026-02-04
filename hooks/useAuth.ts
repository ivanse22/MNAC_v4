
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';

interface AuthState {
  user: any | null;
  role: UserRole;
  isLoading: boolean;
  signIn: (role: UserRole) => Promise<void>; // En demo, simula login. En prod, redirige a provider.
  signOut: () => Promise<void>;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Verificar sesión actual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        // Aquí podrías buscar el rol en una tabla 'profiles'
        // Por ahora, leemos de metadata o default a 'student'
        setRole(session.user.user_metadata?.role || 'student');
      }
      setIsLoading(false);
    });

    // Escuchar cambios de sesión
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) setRole(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (selectedRole: UserRole) => {
    if (!supabase) {
      // MODO DEMO / LOCAL
      setRole(selectedRole);
      return;
    }

    try {
      // En una app real, aquí llamarías a supabase.auth.signInWithOAuth() o Password
      // Para este prototipo híbrido, simulamos el set local si no hay login real
      // O permitimos login anónimo para demo
      const { error } = await supabase.auth.signInAnonymously({
        options: {
          data: { role: selectedRole }
        }
      });
      
      if (error) throw error;
      setRole(selectedRole);
    } catch (error) {
      console.error("Error signing in:", error);
      // Fallback a local state si falla la red
      setRole(selectedRole);
    }
  };

  const signOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setRole(null);
    setUser(null);
  };

  return { user, role, isLoading, signIn, signOut };
};
