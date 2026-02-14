
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { PortfolioData, AuthState, Message } from '../types';
import { INITIAL_DATA } from '../constants';
import { supabase, fetchPortfolioData, syncPortfolioData } from '../services/supabase';

interface AppContextType {
  data: PortfolioData;
  auth: AuthState;
  darkMode: boolean;
  isHydrating: boolean;
  toggleDarkMode: () => void;
  login: (user: string) => void;
  logout: () => void;
  updateData: (newData: Partial<PortfolioData>) => void;
  addMessage: (message: Omit<Message, 'id' | 'date' | 'read'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  incrementViews: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('portfolio_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.analytics) parsed.analytics = INITIAL_DATA.analytics;
      return parsed;
    }
    return INITIAL_DATA;
  });

  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('portfolio_auth');
    return saved ? JSON.parse(saved) : { isAuthenticated: false, user: null };
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark';
  });

  const [isHydrating, setIsHydrating] = useState(true);
  const syncTimeoutRef = useRef<number | null>(null);

  // Initial Sync from Supabase
  useEffect(() => {
    const hydrate = async () => {
      setIsHydrating(true);
      try {
        const remoteData = await fetchPortfolioData();
        if (remoteData) {
          setData(remoteData);
          localStorage.setItem('portfolio_data', JSON.stringify(remoteData));
        }
      } catch (err) {
        console.error('Hydration failed:', err);
      } finally {
        setIsHydrating(false);
      }
    };
    hydrate();
  }, []);

  // Persist to local storage and Supabase
  useEffect(() => {
    // Crucial: Only sync if hydration is complete to avoid overwriting remote data with initial local state
    if (isHydrating) return;

    localStorage.setItem('portfolio_data', JSON.stringify(data));

    // Debounced sync to avoid hitting rate limits on frequent updates (like typing or rapid clicks)
    if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
    
    syncTimeoutRef.current = window.setTimeout(() => {
      syncPortfolioData(data);
    }, 1000);

    return () => {
      if (syncTimeoutRef.current) window.clearTimeout(syncTimeoutRef.current);
    };
  }, [data, isHydrating]);

  useEffect(() => {
    localStorage.setItem('portfolio_auth', JSON.stringify(auth));
  }, [auth]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  const login = (user: string) => setAuth({ isAuthenticated: true, user });
  const logout = () => setAuth({ isAuthenticated: false, user: null });

  const updateData = (newData: Partial<PortfolioData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const incrementViews = useCallback(() => {
    const sessionKey = 'has_counted_view';
    if (!sessionStorage.getItem(sessionKey)) {
      setData(prev => {
        const history = prev.analytics.viewHistory.map((item, index) => {
          if (index === prev.analytics.viewHistory.length - 1) {
            return { ...item, views: item.views + 1 };
          }
          return item;
        });

        return {
          ...prev,
          analytics: {
            ...prev.analytics,
            totalViews: prev.analytics.totalViews + 1,
            viewHistory: history
          }
        };
      });
      sessionStorage.setItem(sessionKey, 'true');
    }
  }, []);

  const addMessage = (message: Omit<Message, 'id' | 'date' | 'read'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      read: false
    };
    setData(prev => ({
      ...prev,
      messages: [newMessage, ...prev.messages]
    }));
  };

  const markMessageRead = (id: string) => {
    setData(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === id ? { ...m, read: true } : m)
    }));
  };

  const deleteMessage = (id: string) => {
    setData(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.id !== id)
    }));
  };

  return (
    <AppContext.Provider value={{
      data,
      auth,
      darkMode,
      isHydrating,
      toggleDarkMode,
      login,
      logout,
      updateData,
      addMessage,
      markMessageRead,
      deleteMessage,
      incrementViews
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
