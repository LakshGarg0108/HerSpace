import React, { useState } from 'react';
import { Info, Sparkles, Database, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Modal } from './Modal';

export const DemoModeBadge: React.FC = () => {
  const { isSupabaseConnected, isDemoMode } = useAuth();
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowDetails(true)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
          isDemoMode
            ? 'bg-amber-50 text-amber-800 border-amber-200/80 hover:bg-amber-100/80'
            : 'bg-sage-100 text-sage-800 border-sage-200 hover:bg-sage-200'
        }`}
        title="Click to view environment & storage status"
      >
        {isDemoMode ? (
          <>
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>Demo Mode</span>
          </>
        ) : (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-sage-700" />
            <span>Supabase Connected</span>
          </>
        )}
      </button>

      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Environment & Storage Status"
        subtitle="Her Safe Space operates with complete transparency regarding where your data lives."
      >
        <div className="space-y-4 text-xs sm:text-sm text-content-secondary leading-relaxed">
          <div className="p-4 rounded-2xl bg-surface-muted border border-lavender-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-content-primary flex items-center gap-2">
                <Database className="w-4 h-4 text-lavender-500" />
                Database & Auth:
              </span>
              <span
                className={`font-semibold px-2.5 py-0.5 rounded-full text-xs ${
                  isSupabaseConnected
                    ? 'bg-sage-100 text-sage-700'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isSupabaseConnected ? 'Live Supabase Cloud' : 'Local Browser Storage'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="font-semibold text-content-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-lavender-500" />
                AI Companion:
              </span>
              <span className="font-semibold px-2.5 py-0.5 rounded-full text-xs bg-lavender-100 text-lavender-700">
                Backend API / Local Fallback
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-content-primary">
              What does this mean for you?
            </h4>
            {isDemoMode ? (
              <p>
                You are currently in <strong>Local Demo Mode</strong>. Your journal entries, mood reflections, and reminders are saved locally in your current browser profile so you can explore every feature smoothly. They are <strong>never sent to an unconfigured cloud</strong>. If you want permanent multi-device sync, simply provide your Supabase and OpenAI API keys in the environment file.
              </p>
            ) : (
              <p>
                The application is connected to your private <strong>Supabase</strong> PostgreSQL instance with <strong>Row Level Security (RLS)</strong> enabled. All your personal data is locked to your authenticated user ID.
              </p>
            )}
          </div>

          <div className="p-3 bg-lavender-50 rounded-2xl border border-lavender-100 text-xs text-lavender-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-lavender-600 shrink-0 mt-0.5" />
            <span>
              We believe in honest technology: we never fabricate test responses or claim data is end-to-end encrypted when in local browser storage.
            </span>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setShowDetails(false)}
              className="px-4 py-2 bg-lavender-500 hover:bg-lavender-600 text-white rounded-full text-xs font-medium"
            >
              Understood
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
