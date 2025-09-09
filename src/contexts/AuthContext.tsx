import React, { createContext, useState, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const signIn = async (email: string, password: string) => {
    // TODO: Implement actual authentication logic
    console.log('Sign in:', email, password);
    // Mock user for now
    setUser({ id: '1', name: 'User', email });
  };

  const signUp = async (email: string, password: string, name: string) => {
    // TODO: Implement actual authentication logic
    console.log('Sign up:', email, password, name);
    // Mock user for now
    setUser({ id: '1', name, email });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signIn, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
