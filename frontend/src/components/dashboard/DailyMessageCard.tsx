import React from 'react';
import { Sparkles, SunMedium } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DailyMessageCard: React.FC = () => {
  const { user } = useAuth();
  const displayName = user?.display_name || 'you';

  return (
    <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-lavender-100 via-surface-cream to-sage-50 border border-lavender-200/60 p-6 sm:p-8 shadow-soft">
      {/* Delicate background ambient circle */}
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-lavender-200/40 blur-2xl pointer-events-none" />
      <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-cream-300/50 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-lavender-200/60 text-xs font-semibold text-lavender-700">
          <SunMedium className="w-3.5 h-3.5 text-amber-500" />
          <span>Safe Harbor</span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium text-content-primary tracking-tight">
          Hey, {displayName}.
        </h1>

        <p className="text-sm sm:text-base text-content-secondary font-sans leading-relaxed">
          "You don't have to figure everything out today. Let's take this one moment at a time."
        </p>

        <div className="pt-2 flex items-center gap-2 text-xs text-lavender-700/80 font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Whatever you brought with you today, there is space for it here.</span>
        </div>
      </div>
    </div>
  );
};
