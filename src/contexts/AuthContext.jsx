import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select(`*, subscription:subscription_id(*)`)
          .eq('id', session.user.id)
          .single();
        setUser({ ...session.user, ...profile });
      }
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select(`*, subscription:subscription_id(*)`)
          .eq('id', session.user.id)
          .single();
        setUser({ ...session.user, ...profile });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      const isDark = JSON.parse(savedDarkMode);
      setDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      }
    }

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    
    const { data: profile } = await supabase
      .from('profiles')
      .select(`*, subscription:subscription_id(*)`)
      .eq('id', data.user.id)
      .single();

    return { success: true, role: profile?.role || 'student' };
  };

  const register = async (userData) => {
    const { email, password, firstName, middleName, lastName, phone, grade, track } = userData;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          middle_name: middleName,
          last_name: lastName,
          phone,
          grade,
          track,
          role: 'student'
        }
      }
    });

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    darkMode,
    toggleDarkMode
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
