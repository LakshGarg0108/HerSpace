import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, Filter, BookmarkCheck, HeartHandshake, Mic, Pin } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Input, Textarea } from '../components/common/Input';
import { ReminderCard } from '../components/reminders/ReminderCard';
import { RandomComfortModal } from '../components/reminders/RandomComfortModal';
import { reminderService } from '../services/reminderService';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { PersonalReminder } from '../types';

export const RemindersPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useApp();

  const [reminders, setReminders] = useState<PersonalReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<PersonalReminder | null>(null);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('Overwhelm');
  const [isPinned, setIsPinned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadReminders = async () => {
    if (!user) return;
    try {
      const data = await reminderService.getReminders(user.id);
      setReminders(data);
    } catch (e) {
      console.warn('Could not load reminders', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReminders();
  }, [user]);

  const categories = ['All', 'Overwhelm', 'Family', 'Burnout', 'Self-Worth', 'Validation', 'Grounding'];

  const handleOpenCreate = () => {
    setEditingReminder(null);
    setTitle('');
    setMessage('');
    setCategory('Overwhelm');
    setIsPinned(false);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (reminder: PersonalReminder) => {
    setEditingReminder(reminder);
    setTitle(reminder.title);
    setMessage(reminder.message);
    setCategory(reminder.category || 'Overwhelm');
    setIsPinned(reminder.is_pinned);
    setIsCreateModalOpen(true);
  };

  const handleSaveReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || !user) return;

    setIsSaving(true);
    try {
      await reminderService.saveReminder(user.id, {
        id: editingReminder?.id,
        title: title.trim(),
        message: message.trim(),
        category,
        is_pinned: isPinned,
      });
      await loadReminders();
      setIsCreateModalOpen(false);
      addToast(editingReminder ? 'Comfort note updated.' : 'New reminder saved.', 'calm');
    } catch {
      addToast('Error saving note', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    if (!user) return;
    await reminderService.togglePin(id, user.id, currentPinned);
    await loadReminders();
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await reminderService.deleteReminder(id, user.id);
    await loadReminders();
    addToast('Note deleted.', 'calm');
  };

  const filteredReminders = reminders.filter((r) => {
    if (selectedCategory === 'All') return true;
    return r.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-medium text-content-primary">
            Little Reminders
          </h1>
          <p className="text-xs sm:text-sm text-content-secondary mt-1">
            Gentle anchors for when your head is spinning and self-criticism takes over.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsRandomModalOpen(true)}
            leftIcon={<Sparkles className="w-4 h-4 text-lavender-600" />}
          >
            Comfort Me Now
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleOpenCreate}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Note
          </Button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
              selectedCategory === c
                ? 'bg-lavender-500 text-white shadow-soft'
                : 'bg-white text-content-secondary border border-lavender-100 hover:bg-lavender-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Reminders Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="h-44 bg-surface-muted" />
          ))}
        </div>
      ) : filteredReminders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredReminders.map((r) => (
            <ReminderCard
              key={r.id}
              reminder={r}
              onTogglePin={handleTogglePin}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <Card className="p-10 text-center space-y-3 max-w-md mx-auto">
          <BookmarkCheck className="w-8 h-8 text-lavender-400 mx-auto" />
          <h3 className="font-serif font-medium text-base text-content-primary">
            No notes under this category
          </h3>
          <p className="text-xs text-content-secondary">
            Write down a kind reminder you wish someone would tell you right now.
          </p>
          <Button size="sm" variant="primary" onClick={handleOpenCreate}>
            Create your first reminder
          </Button>
        </Card>
      )}

      {/* Create / Edit Note Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title={editingReminder ? 'Edit Comfort Note' : 'Add a New Comfort Note'}
        subtitle="Write a gentle reminder to anchor yourself during stormy days."
      >
        <form onSubmit={handleSaveReminder} className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g. Permission to rest, Not my circus"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-content-secondary">
              Situation / Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-surface-muted/60 border border-lavender-200/80 text-sm text-content-primary focus:outline-none focus:border-lavender-400"
            >
              {categories.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Textarea
            label="Message"
            rows={4}
            placeholder="Write words of grace, patience, or truth..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="is_pinned"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded text-lavender-500 accent-lavender-500 cursor-pointer"
            />
            <label htmlFor="is_pinned" className="text-xs text-content-secondary cursor-pointer">
              Pin to top and display on Home Dashboard
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-lavender-100">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isSaving}
            >
              Save Note
            </Button>
          </div>
        </form>
      </Modal>

      {/* Random Comfort Modal */}
      <RandomComfortModal
        isOpen={isRandomModalOpen}
        onClose={() => setIsRandomModalOpen(false)}
        reminders={reminders}
      />
    </div>
  );
};
