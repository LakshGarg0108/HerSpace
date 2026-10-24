import React, { useState, useEffect } from 'react';
import { Save, X, Sparkles, Shield, Check } from 'lucide-react';
import { Button } from '../common/Button';
import { PromptPicker } from './PromptPicker';
import { MOODS } from '../../lib/constants';
import { JournalEntry, MoodType } from '../../types';

interface JournalEditorProps {
  initialEntry?: JournalEntry | null;
  onSave: (entry: { id?: string; title: string; content: string; mood?: MoodType }) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

export const JournalEditor: React.FC<JournalEditorProps> = ({
  initialEntry,
  onSave,
  onCancel,
  isSaving,
}) => {
  const [title, setTitle] = useState(initialEntry?.title || '');
  const [content, setContent] = useState(initialEntry?.content || '');
  const [mood, setMood] = useState<MoodType | undefined>(initialEntry?.mood);
  const [showPrompts, setShowPrompts] = useState(!initialEntry);

  useEffect(() => {
    if (initialEntry) {
      setTitle(initialEntry.title || '');
      setContent(initialEntry.content);
      setMood(initialEntry.mood);
    }
  }, [initialEntry]);

  const handleInsertPrompt = (prompt: string) => {
    setContent((prev) => {
      const prefix = prev ? prev + '\n\n' : '';
      return `${prefix}— ${prompt}\n`;
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onSave({
      id: initialEntry?.id,
      title: title.trim(),
      content: content.trim(),
      mood,
    });
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <form
      onSubmit={handleSave}
      className="p-6 sm:p-8 rounded-4xl bg-white border border-lavender-100 shadow-soft-md space-y-6 animate-in fade-in duration-200"
    >
      <div className="flex items-center justify-between border-b border-lavender-100/70 pb-4">
        <div>
          <h2 className="text-xl font-serif font-medium text-content-primary">
            {initialEntry ? 'Edit Your Reflection' : 'New Journal Entry'}
          </h2>
          <p className="text-xs text-content-secondary mt-0.5">
            Write unhurriedly. What you write here is your private sanctum.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!content.trim() || isSaving}
            isLoading={isSaving}
            leftIcon={<Save className="w-4 h-4" />}
          >
            Save Reflection
          </Button>
        </div>
      </div>

      {/* Prompts Drawer */}
      {showPrompts && (
        <div className="space-y-2">
          <PromptPicker onSelectPrompt={handleInsertPrompt} />
        </div>
      )}

      {/* Title & Mood Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 space-y-1.5">
          <label htmlFor="journal-title" className="block text-xs font-semibold uppercase tracking-wider text-content-secondary">
            Title (Optional)
          </label>
          <input
            id="journal-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="A word or phrase describing this moment..."
            className="w-full px-4 py-3 rounded-2xl bg-surface-muted/60 border border-lavender-200/80 text-sm text-content-primary focus:bg-white focus:border-lavender-500 focus:ring-2 focus:ring-lavender-200 outline-none"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="journal-mood" className="block text-xs font-semibold uppercase tracking-wider text-content-secondary">
            Feeling Tag (Optional)
          </label>
          <select
            id="journal-mood"
            value={mood || ''}
            onChange={(e) => setMood((e.target.value as MoodType) || undefined)}
            className="w-full px-4 py-3 rounded-2xl bg-surface-muted/60 border border-lavender-200/80 text-sm text-content-primary focus:bg-white focus:border-lavender-500 focus:ring-2 focus:ring-lavender-200 outline-none"
          >
            <option value="">No tag</option>
            {MOODS.map((m) => (
              <option key={m.type} value={m.type}>
                {m.emojiText} {m.type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Journal Content Textarea */}
      <div className="space-y-2">
        <label htmlFor="journal-content" className="sr-only">
          Journal Reflection
        </label>
        <textarea
          id="journal-content"
          rows={12}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing freely... You do not need to make sense or be coherent."
          className="w-full p-5 rounded-3xl bg-surface-muted/40 border border-lavender-200/80 text-sm text-content-primary focus:bg-white focus:border-lavender-500 focus:ring-2 focus:ring-lavender-200 outline-none resize-y leading-relaxed font-sans"
          required
        />
      </div>

      {/* Bottom Bar: Privacy guarantee & Word counts */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-content-secondary pt-2">
        <div className="flex items-center gap-1.5 text-sage-700">
          <Shield className="w-3.5 h-3.5" />
          <span>Private & user-owned: never auto-shared with the AI or logged.</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{wordCount} words</span>
          <span>•</span>
          <span>{charCount} characters</span>
        </div>
      </div>
    </form>
  );
};
