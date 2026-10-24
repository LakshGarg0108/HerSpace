import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { EmergencyHelpModal } from '../common/EmergencyHelpModal';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, Info, Heart } from 'lucide-react';

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toasts, removeToast } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-background text-content-primary">
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Mobile Sidebar Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-lavender-900/30 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-white h-full shadow-soft-lg flex flex-col z-10 animate-in slide-in-from-left duration-200">
            <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row gap-8">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Page Content */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <Footer />

      {/* Global Modals & Toasts */}
      <EmergencyHelpModal />

      {/* Calm Toast Notifications */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className="pointer-events-auto max-w-sm p-4 rounded-2xl bg-white border border-lavender-200/80 shadow-soft-lg text-xs font-medium text-content-primary flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 cursor-pointer"
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-sage-700 shrink-0" />
            ) : toast.type === 'calm' ? (
              <Heart className="w-4 h-4 text-lavender-500 fill-lavender-200 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-lavender-600 shrink-0" />
            )}
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
