import { createContext, useContext, useState } from 'react';
import { getAccessToken, clearAccessToken } from '@/utils/auth';

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    getAccessToken()
  );

  const login = (newToken: string) => {
    localStorage.setItem("accessToken", newToken);
    setToken(newToken);
  };

  const logout = () => {
    clearAccessToken();
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};