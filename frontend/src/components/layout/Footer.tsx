import React from 'react';
import { Heart, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { openEmergencyModal } = useApp();

  return (
    <footer className="mt-auto border-t border-lavender-100/70 bg-white/40 py-8 px-4 text-xs text-content-secondary">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="space-y-1">
          <p className="font-serif text-sm font-medium text-content-primary">
            Her Safe Space
          </p>
          <p className="text-content-light">
            You don't have to be okay all the time. Crafted with gentle care and radical empathy.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-content-secondary">
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sage-700" />
            <span>Privacy-First Architecture</span>
          </span>
          <span>•</span>
          <button
            onClick={openEmergencyModal}
            className="hover:text-rose-500 font-semibold underline transition-colors"
          >
            Crisis Helplines
          </button>
        </div>
      </div>
    </footer>
  );
};
