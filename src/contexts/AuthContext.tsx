import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType } from '@/types';
import { apiRequest, tokenStorage } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  login: (phone: string, password: string, userType: UserType) => Promise<boolean>;
  signup: (userData: Omit<User, 'id' | 'createdAt'>) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapSession = async () => {
      const token = tokenStorage.get();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiRequest<{ user: any }>('/api/auth/me');
        const backendUser = response.user;
        setUser({
          id: backendUser._id,
          name: backendUser.name,
          phone: backendUser.phone,
          location: backendUser.location,
          userType: backendUser.userType,
          companyName: backendUser.companyName ?? undefined,
          createdAt: backendUser.createdAt,
        });
      } catch (_error) {
        tokenStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapSession();
  }, []);

  const login = async (phone: string, password: string, userType: UserType): Promise<boolean> => {
    try {
      const response = await apiRequest<{ user: any; token: string }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password, userType }),
      });

      tokenStorage.set(response.token);
      const backendUser = response.user;
      setUser({
        id: backendUser._id,
        name: backendUser.name,
        phone: backendUser.phone,
        location: backendUser.location,
        userType: backendUser.userType,
        companyName: backendUser.companyName ?? undefined,
        createdAt: backendUser.createdAt,
      });
      return true;
    } catch (_error) {
      return false;
    }
  };

  const signup = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const response = await apiRequest<{ user: any; token: string }>('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData),
      });

      tokenStorage.set(response.token);
      const backendUser = response.user;
      setUser({
        id: backendUser._id,
        name: backendUser.name,
        phone: backendUser.phone,
        location: backendUser.location,
        userType: backendUser.userType,
        companyName: backendUser.companyName ?? undefined,
        createdAt: backendUser.createdAt,
      });
      return true;
    } catch (_error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    tokenStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
