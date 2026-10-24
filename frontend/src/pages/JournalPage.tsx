import React, { useState, useEffect } from 'react';
import { PenLine, Search, Download, Trash2, BookOpen, Sparkles, Filter } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { JournalCard } from '../components/journal/JournalCard';
import { JournalEditor } from '../components/journal/JournalEditor';
import { journalService } from '../services/journalService';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { JournalEntry, MoodType } from '../types';
import { MOODS } from '../lib/constants';

export const JournalPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useApp();

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const loadEntries = async () => {
    if (!user) return;
    try {
      const data = await journalService.getEntries(user.id);
      setEntries(data);
    } catch (e) {
      console.warn('Failed to load journal entries', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, [user]);

  const handleOpenNew = () => {
    setEditingEntry(null);
    setIsEditorOpen(true);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsEditorOpen(true);
  };

  const handleSaveEntry = async (entryData: {
    id?: string;
    title: string;
    content: string;
    mood?: MoodType;
  }) => {
    if (!user) return;
    setIsSaving(true);
    try {
      await journalService.saveEntry({
        id: entryData.id,
        user_id: user.id,
        title: entryData.title,
        content: entryData.content,
        mood: entryData.mood,
      });
      await loadEntries();
      setIsEditorOpen(false);
      setEditingEntry(null);
      addToast(entryData.id ? 'Entry updated gently.' : 'New reflection saved to your private journal.', 'success');
    } catch {
      addToast('Error saving entry', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!entryToDelete || !user) return;
    try {
      await journalService.deleteEntry(entryToDelete, user.id);
      await loadEntries();
      addToast('Reflection removed.', 'calm');
    } catch {
      addToast('Could not delete entry', 'info');
    } finally {
      setEntryToDelete(null);
    }
  };

  // Filtered entries
  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      (e.title && e.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood =
      selectedMoodFilter === 'all' || e.mood === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-content-primary">
            Private Journal
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1">
            An unhurried space for your thoughts. Never sent to the AI or shared.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {entries.length > 0 && (
            <div className="relative group">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="w-3.5 h-3.5" />}
                onClick={() => journalService.exportEntriesAsText(entries)}
              >
                Export
              </Button>
            </div>
          )}

          <Button
            variant="primary"
            size="md"
            leftIcon={<PenLine className="w-4 h-4" />}
            onClick={handleOpenNew}
          >
            Write Reflection
          </Button>
        </div>
      </div>

      {/* Inline / Modal Editor */}
      {isEditorOpen && (
        <JournalEditor
          initialEntry={editingEntry}
          onSave={handleSaveEntry}
          onCancel={() => {
            setIsEditorOpen(false);
            setEditingEntry(null);
          }}
          isSaving={isSaving}
        />
      )}

      {/* Search and Mood Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-content-light absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search through your entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-lavender-100 text-xs sm:text-sm text-content-primary focus:outline-none focus:border-lavender-400 focus:ring-2 focus:ring-lavender-200"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0 overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedMoodFilter}
            onChange={(e) => setSelectedMoodFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-2xl bg-white border border-lavender-100 text-xs text-content-secondary font-medium focus:outline-none focus:border-lavender-400"
          >
            <option value="all">All Mood Tags</option>
            {MOODS.map((m) => (
              <option key={m.type} value={m.type}>
                {m.emojiText} {m.type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Entries List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-44 bg-surface-muted" />
          ))}
        </div>
      ) : filteredEntries.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEntries.map((entry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onEdit={handleEdit}
              onDelete={(id) => setEntryToDelete(id)}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center space-y-3 max-w-lg mx-auto bg-white/70">
          <BookOpen className="w-8 h-8 text-lavender-300 mx-auto" />
          <h3 className="font-serif font-medium text-base text-content-primary">
            {searchQuery ? 'No matching reflections found' : 'Your journal is completely quiet'}
          </h3>
          <p className="text-xs text-content-secondary leading-relaxed">
            {searchQuery
              ? 'Try searching with a different word or clearing your filter.'
              : 'Write down whatever feels tangled. No one is grading your grammar or judging your feelings.'}
          </p>
          {!searchQuery && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenNew}
              leftIcon={<PenLine className="w-3.5 h-3.5" />}
            >
              Write your first reflection
            </Button>
          )}
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(entryToDelete)}
        onClose={() => setEntryToDelete(null)}
        title="Delete this reflection?"
        subtitle="This entry will be permanently removed from your private storage."
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Are you sure you want to delete this thought? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEntryToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="rose"
              size="sm"
              onClick={confirmDelete}
            >
              Yes, Delete Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
