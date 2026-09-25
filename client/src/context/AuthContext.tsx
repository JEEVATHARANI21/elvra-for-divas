import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Address } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  addresses: Address[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
  saveAddress: (address: Address) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('elvra_token'));
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshProfile = async () => {
    const currentToken = localStorage.getItem('elvra_token');
    if (!currentToken) {
      setUser(null);
      setAddresses([]);
      setIsLoading(false);
      return;
    }

    try {
      const data = await api.getProfile();
      setUser(data.user);
      setAddresses(data.addresses || []);
    } catch (err) {
      console.warn('Session expired or invalid, clearing token.');
      localStorage.removeItem('elvra_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProfile();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.login(email, password);
    localStorage.setItem('elvra_token', data.token);
    setToken(data.token);
    setUser(data.user);
    await refreshProfile();
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const data = await api.register(name, email, password, phone);
    localStorage.setItem('elvra_token', data.token);
    setToken(data.token);
    setUser(data.user);
    await refreshProfile();
  };

  const logout = () => {
    localStorage.removeItem('elvra_token');
    setToken(null);
    setUser(null);
    setAddresses([]);
  };

  const saveAddress = async (address: Address) => {
    await api.saveAddress(address);
    await refreshProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        addresses,
        isLoading,
        login,
        register,
        logout,
        refreshProfile,
        saveAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
