import React from 'react';
import { Calendar, Trash2, Edit3, Tag } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { JournalEntry } from '../../types';
import { MOODS } from '../../lib/constants';

interface JournalCardProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export const JournalCard: React.FC<JournalCardProps> = ({ entry, onEdit, onDelete }) => {
  const moodConfig = MOODS.find((m) => m.type === entry.mood);
  const formattedDate = new Date(entry.created_at).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Card className="space-y-3 hover:border-lavender-200 transition-all flex flex-col justify-between">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs text-content-secondary">
            <Calendar className="w-3.5 h-3.5 text-lavender-500" />
            <span>{formattedDate}</span>
          </div>

          {moodConfig && (
            <Badge variant="lavender" size="sm">
              <span>{moodConfig.emojiText}</span>
              <span className="capitalize">{moodConfig.type}</span>
            </Badge>
          )}
        </div>

        <h3 className="font-serif font-medium text-base text-content-primary">
          {entry.title || 'Untitled Reflection'}
        </h3>

        <p className="text-xs text-content-secondary leading-relaxed line-clamp-4 whitespace-pre-line font-sans">
          {entry.content}
        </p>
      </div>

      <div className="pt-3 border-t border-lavender-100/70 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(entry)}
          className="p-1.5 rounded-xl text-content-secondary hover:text-lavender-700 hover:bg-lavender-100/60 text-xs font-medium inline-flex items-center gap-1 transition-colors"
          title="Edit entry"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>

        <button
          onClick={() => onDelete(entry.id)}
          className="p-1.5 rounded-xl text-content-secondary hover:text-rose-500 hover:bg-rose-50 text-xs font-medium inline-flex items-center gap-1 transition-colors"
          title="Delete entry"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </Card>
  );
};
