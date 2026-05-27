import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiSignIn, getToken, removeToken, saveToken } from '@/lib/api';
import { User } from '@/lib/types';
import * as SecureStore from 'expo-secure-store';

const USER_KEY = 'glouglou_user';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  saveSession: (token: string, apiUser: { id: string; email: string; name: string; plan: string }) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserPlan: (plan: 'free' | 'premium') => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    try {
      const token = await getToken();
      const userStr = await SecureStore.getItemAsync(USER_KEY);
      if (token && userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch {
      // session invalide
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const { token, user: apiUser } = await apiSignIn(email, password);
    const u: User = {
      id: apiUser.id,
      email: apiUser.email,
      name: apiUser.name,
      plan: apiUser.plan as 'free' | 'premium',
    };
    await saveToken(token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(u));
    setUser(u);
  }

  async function saveSession(token: string, apiUser: { id: string; email: string; name: string; plan: string }) {
    const u: User = {
      id: apiUser.id,
      email: apiUser.email,
      name: apiUser.name,
      plan: apiUser.plan as 'free' | 'premium',
    };
    await saveToken(token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(u));
    setUser(u);
  }

  async function signOut() {
    await removeToken();
    await SecureStore.deleteItemAsync(USER_KEY);
    setUser(null);
  }

  function updateUserPlan(plan: 'free' | 'premium') {
    if (!user) return;
    const updated = { ...user, plan };
    setUser(updated);
    SecureStore.setItemAsync(USER_KEY, JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, saveSession, signOut, updateUserPlan }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
}
