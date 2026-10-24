import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  Trash2,
  LogOut,
  EyeOff,
  Sparkles,
  Download,
  AlertTriangle,
  Database,
  Lock,
  Check,
} from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { journalService } from '../services/journalService';
import { chatService } from '../services/chatService';

export const SettingsPage: React.FC = () => {
  const { user, signOut, updateDisplayName, deleteAccount, isDemoMode, isSupabaseConnected } = useAuth();
  const { reducedMotion, setReducedMotion, addToast } = useApp();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.display_name || '');
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isClearChatModalOpen, setIsClearChatModalOpen] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsUpdatingName(true);
    try {
      await updateDisplayName(name.trim());
      addToast('Display name updated.', 'success');
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleClearChatHistory = async () => {
    await chatService.clearHistory();
    setIsClearChatModalOpen(false);
    addToast('Chat messages removed completely.', 'calm');
  };

  const handleExportJournal = async () => {
    if (!user) return;
    const entries = await journalService.getEntries(user.id);
    if (entries.length === 0) {
      addToast('No journal entries to export.', 'info');
      return;
    }
    journalService.exportEntriesAsText(entries);
    addToast('Journal downloaded as text file.', 'success');
  };

  const handleDeleteAccount = async () => {
    setIsDeletingAccount(true);
    try {
      const res = await deleteAccount();
      if (res.error) {
        addToast(res.error, 'info');
      } else {
        addToast('All personal records have been wiped clean.', 'calm');
        navigate('/');
      }
    } finally {
      setIsDeletingAccount(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-content-primary">
          Settings & Privacy Transparency
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary mt-1">
          Complete control over your identity, sensory experience, and private data.
        </p>
      </div>

      {/* Account Info */}
      <Card className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-lavender-100">
          <div className="w-10 h-10 rounded-2xl bg-lavender-100 text-lavender-600 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-medium text-base text-content-primary">
              Your Identity
            </h2>
            <p className="text-xs text-content-secondary">
              Email: {user?.email || 'Guest Explorer'}
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdateName} className="flex flex-col sm:flex-row items-end gap-3 pt-2">
          <div className="w-full sm:flex-1">
            <Input
              label="Companion Greeting Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="How the companion greets you"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isUpdatingName}
            className="shrink-0"
          >
            Update Name
          </Button>
        </form>
      </Card>

      {/* Accessibility & Visual Preferences */}
      <Card className="p-6 sm:p-8 space-y-4">
        <h2 className="font-serif font-medium text-base text-content-primary pb-2 border-b border-lavender-100">
          Sensory & Visual Preferences
        </h2>

        <div className="flex items-center justify-between py-2">
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold text-content-primary">
              Reduced Motion
            </h3>
            <p className="text-xs text-content-secondary">
              Disables breathing animations and scale transitions for a gentler static layout.
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={reducedMotion}
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              reducedMotion ? 'bg-lavender-500' : 'bg-lavender-200'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                reducedMotion ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </Card>

      {/* Plain Language Privacy & Data Disclosure */}
      <Card className="p-6 sm:p-8 space-y-4 bg-surface-muted/60">
        <div className="flex items-center gap-2 text-lavender-800">
          <Shield className="w-5 h-5 text-lavender-600" />
          <h2 className="font-serif font-medium text-base text-content-primary">
            Plain-Language Privacy Explanations
          </h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-content-secondary leading-relaxed">
          <div className="p-4 rounded-2xl bg-white border border-lavender-100 space-y-1.5">
            <h3 className="font-semibold text-content-primary">Where is your data kept?</h3>
            <p>
              {isDemoMode
                ? 'Your records live purely inside this browser on this device. They are never sent to external servers.'
                : 'Your records live securely in Supabase PostgreSQL, protected by Row Level Security (RLS) policies where only your authenticated user ID can read or write rows.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-lavender-100 space-y-1.5">
            <h3 className="font-semibold text-content-primary">Are your thoughts sent to AI providers?</h3>
            <p>
              <strong>Journal entries and mood reflections are NEVER sent to the AI.</strong> Only the specific message you type into the Companion chat box (and the immediate recent conversation context) is transmitted to the AI endpoint to generate a reply.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-lavender-100 space-y-1.5">
            <h3 className="font-semibold text-content-primary">Who can read your words?</h3>
            <p>
              There is no social feed, no public sharing, and no administrator dashboard reading your private journal. Because no system can promise mathematical invisibility, we encourage you to use caution on shared family devices.
            </p>
          </div>
        </div>
      </Card>

      {/* Data Management & Deletion */}
      <Card className="p-6 sm:p-8 space-y-5 border-rose-200/60">
        <h2 className="font-serif font-medium text-base text-rose-500 pb-2 border-b border-rose-100">
          Data Management & Total Wipe
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleExportJournal}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export All Journal Entries
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={() => setIsClearChatModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4 text-rose-500" />}
          >
            Clear Companion Chat History
          </Button>
        </div>

        <div className="pt-4 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Button
            variant="rose"
            size="md"
            onClick={() => setIsDeleteModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Delete Account & Wipe All Data
          </Button>

          <Button
            variant="ghost"
            size="md"
            onClick={() => {
              signOut();
              navigate('/');
            }}
            leftIcon={<LogOut className="w-4 h-4" />}
          >
            Sign Out Peacefully
          </Button>
        </div>
      </Card>

      {/* Clear Chat Confirmation Modal */}
      <Modal
        isOpen={isClearChatModalOpen}
        onClose={() => setIsClearChatModalOpen(false)}
        title="Clear all chat history?"
        subtitle="This will erase all past conversation messages from your companion."
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-content-secondary">
            Your journal reflections and pinned notes will remain safe.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsClearChatModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="rose" size="sm" onClick={handleClearChatHistory}>
              Clear Chat
            </Button>
          </div>
        </div>
      </Modal>

      {/* Account Deletion Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Permanently Delete Everything?"
        subtitle="This will wipe all journal reflections, mood entries, chat messages, and account details."
      >
        <div className="space-y-4">
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-500 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>
              This action is completely permanent and cannot be reversed. All data linked to your identity will be destroyed.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeletingAccount}
            >
              Nevermind, Keep My Sanctuary
            </Button>
            <Button
              variant="rose"
              size="sm"
              onClick={handleDeleteAccount}
              isLoading={isDeletingAccount}
            >
              Wipe Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
