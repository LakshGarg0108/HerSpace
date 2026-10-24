import React from 'react';
import { Pin, Trash2, Edit3, HeartHandshake, User } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { PersonalReminder } from '../../types';

interface ReminderCardProps {
  reminder: PersonalReminder;
  onTogglePin: (id: string, currentPinned: boolean) => void;
  onEdit: (reminder: PersonalReminder) => void;
  onDelete: (id: string) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onTogglePin,
  onEdit,
  onDelete,
}) => {
  const isCreatorAuthor = reminder.author_type === 'creator';

  return (
    <Card
      className={`space-y-4 transition-all duration-200 flex flex-col justify-between ${
        reminder.is_pinned
          ? 'bg-surface-cream border-amber-200/80 shadow-soft-md'
          : 'bg-white border-lavender-100/80 hover:border-lavender-200'
      }`}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          {reminder.category ? (
            <Badge variant="lavender" size="sm">
              {reminder.category}
            </Badge>
          ) : (
            <span />
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => onTogglePin(reminder.id, reminder.is_pinned)}
              className={`p-1.5 rounded-full transition-colors ${
                reminder.is_pinned
                  ? 'text-amber-600 bg-amber-100 hover:bg-amber-200'
                  : 'text-content-light hover:text-content-secondary hover:bg-black/5'
              }`}
              title={reminder.is_pinned ? 'Unpin reminder' : 'Pin to top & dashboard'}
            >
              <Pin className={`w-3.5 h-3.5 ${reminder.is_pinned ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-serif font-medium text-base text-content-primary">
            {reminder.title}
          </h3>
          <p className="text-xs sm:text-sm font-serif italic text-content-secondary leading-relaxed mt-1.5">
            "{reminder.message}"
          </p>
        </div>
      </div>

      <div className="pt-3 border-t border-lavender-100/70 flex items-center justify-between text-xs text-content-light">
        <div className="flex items-center gap-1.5">
          {isCreatorAuthor ? (
            <span className="inline-flex items-center gap-1 text-[11px] text-lavender-700 font-medium">
              <HeartHandshake className="w-3 h-3" />
              <span>Prepared comfort</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] text-content-secondary font-medium">
              <User className="w-3 h-3" />
              <span>Personal note</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(reminder)}
            className="p-1.5 rounded-xl text-content-secondary hover:text-lavender-700 hover:bg-lavender-100/60 transition-colors"
            title="Edit reminder"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(reminder.id)}
            className="p-1.5 rounded-xl text-content-secondary hover:text-rose-500 hover:bg-rose-50 transition-colors"
            title="Delete reminder"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Card>
  );
};
