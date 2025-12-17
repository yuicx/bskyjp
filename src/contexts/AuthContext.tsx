import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '../services/auth';
import type { AuthSession } from '../types/bluesky';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthSession | null;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  
  const authService = AuthService.getInstance();

  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = authService.isAuthenticated();
      const currentUser = authService.getCurrentUser();
      
      setIsAuthenticated(authenticated);
      setUser(currentUser || null);
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (identifier: string, password: string): Promise<boolean> => {
    setLoading(true);
    const success = await authService.login(identifier, password);
    
    if (success) {
      setIsAuthenticated(true);
      setUser(authService.getCurrentUser() || null);
    }
    
    setLoading(false);
    return success;
  };

  const logout = async (): Promise<void> => {
    setLoading(true);
    await authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        login, 
        logout, 
        loading 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
