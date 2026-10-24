import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportMode } from '../types';

interface ToastMessage {
  id: string;
  text: string;
  type?: 'info' | 'success' | 'calm';
}

interface AppContextType {
  isEmergencyModalOpen: boolean;
  openEmergencyModal: () => void;
  closeEmergencyModal: () => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  activeSupportMode: SupportMode;
  setActiveSupportMode: (mode: SupportMode) => void;
  toasts: ToastMessage[];
  addToast: (text: string, type?: 'info' | 'success' | 'calm') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [reducedMotion, setReducedMotionState] = useState(() => {
    return localStorage.getItem('hss_reduced_motion') === 'true';
  });
  const [activeSupportMode, setActiveSupportMode] = useState<SupportMode>('LISTEN');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    if (reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  const setReducedMotion = (val: boolean) => {
    setReducedMotionState(val);
    localStorage.setItem('hss_reduced_motion', String(val));
  };

  const addToast = (text: string, type: 'info' | 'success' | 'calm' = 'calm') => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        isEmergencyModalOpen,
        openEmergencyModal: () => setIsEmergencyModalOpen(true),
        closeEmergencyModal: () => setIsEmergencyModalOpen(false),
        reducedMotion,
        setReducedMotion,
        activeSupportMode,
        setActiveSupportMode,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
