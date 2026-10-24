import React, { useState } from 'react';
import { ShieldAlert, X, HeartHandshake } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [dismissed, setDismissed] = useState(false);
  const { openEmergencyModal } = useApp();

  if (dismissed) return null;

  if (compact) {
    return (
      <div className="bg-lavender-100/70 border border-lavender-200/60 rounded-2xl p-3 text-xs text-content-secondary flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-lavender-600 shrink-0" />
          <span>
            <strong>Her Safe Space is a wellness companion</strong>, not a therapist or crisis hotline.
          </span>
        </div>
        <button
          onClick={openEmergencyModal}
          className="text-lavender-700 font-semibold underline hover:text-lavender-900 shrink-0"
        >
          Get help now
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-cream/80 border border-amber-200/50 rounded-3xl p-4 sm:p-5 shadow-soft flex items-start justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-cream-300 rounded-2xl text-amber-800 shrink-0 mt-0.5">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-content-primary">
            A Safe Harbor, Not a Crisis Clinic
          </h4>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Her Safe Space is designed to help you breathe, vent, and gently reflect on difficult moments.
            The AI companion is here to listen with empathy, but does not provide medical diagnosis, psychological treatment, or emergency rescue.
          </p>
          <div className="pt-1">
            <button
              onClick={openEmergencyModal}
              className="text-xs font-semibold text-lavender-700 hover:text-lavender-900 underline inline-flex items-center gap-1"
            >
              If you or someone you know is in immediate danger or severe crisis, click here for verified 24/7 helplines →
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss notice"
        className="text-content-light hover:text-content-secondary p-1 rounded-full hover:bg-black/5"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
