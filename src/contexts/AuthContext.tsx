import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isGuest: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const guestMode = localStorage.getItem('guestMode');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (guestMode === 'true') {
      setIsGuest(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - 실제로는 백엔드 API 호출
    const mockUser = {
      id: '1',
      name: email.split('@')[0],
      email,
      avatar: 'https://readdy.ai/api/search-image?query=professional%20user%20avatar%20profile%20picture%20with%20modern%20minimalist%20design%20clean%20background&width=100&height=100&seq=user-avatar-001&orientation=squarish'
    };
    setUser(mockUser);
    setIsGuest(false);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.removeItem('guestMode');
  };

  const signup = async (name: string, email: string, password: string) => {
    // Mock signup - 실제로는 백엔드 API 호출
    const mockUser = {
      id: Date.now().toString(),
      name,
      email,
      avatar: 'https://readdy.ai/api/search-image?query=professional%20user%20avatar%20profile%20picture%20with%20modern%20minimalist%20design%20clean%20background&width=100&height=100&seq=user-avatar-002&orientation=squarish'
    };
    setUser(mockUser);
    setIsGuest(false);
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.removeItem('guestMode');
  };

  const logout = () => {
    setUser(null);
    setIsGuest(false);
    localStorage.removeItem('user');
    localStorage.removeItem('guestMode');
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    localStorage.setItem('guestMode', 'true');
  };

  return (
    <AuthContext.Provider value={{ user, isGuest, login, signup, logout, continueAsGuest }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
