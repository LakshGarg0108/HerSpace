import React from 'react';
import { Link } from 'react-router-dom';
import { BookmarkCheck, ArrowRight, Sparkles, Pin } from 'lucide-react';
import { Card } from '../common/Card';
import { PersonalReminder } from '../../types';

export const PinnedRemindersWidget: React.FC<{
  reminders: PersonalReminder[];
  loading: boolean;
}> = ({ reminders, loading }) => {
  const pinned = reminders.filter((r) => r.is_pinned).slice(0, 3);

  if (loading) {
    return (
      <Card className="animate-pulse space-y-3">
        <div className="h-4 bg-lavender-100 rounded w-1/3" />
        <div className="h-16 bg-lavender-50 rounded" />
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookmarkCheck className="w-4 h-4 text-amber-600" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-content-secondary">
            Pinned Comfort Notes
          </h3>
        </div>
        <Link
          to="/reminders"
          className="text-xs font-semibold text-lavender-700 hover:text-lavender-900 inline-flex items-center gap-1"
        >
          <span>All notes</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {pinned.length > 0 ? (
        <div className="space-y-2.5">
          {pinned.map((reminder) => (
            <div
              key={reminder.id}
              className="p-3.5 rounded-2xl bg-surface-cream/80 border border-amber-100/80 space-y-1 hover:border-amber-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-content-primary flex items-center gap-1.5">
                  <Pin className="w-3 h-3 text-amber-600 fill-amber-400" />
                  {reminder.title}
                </span>
                {reminder.category && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/80 text-content-secondary border border-amber-100">
                    {reminder.category}
                  </span>
                )}
              </div>
              <p className="text-xs font-serif italic text-content-secondary leading-relaxed">
                "{reminder.message}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-surface-muted text-center space-y-2">
          <p className="text-xs text-content-secondary">
            Pin your favorite personal reminders or notes so they appear here when you need them most.
          </p>
          <Link
            to="/reminders"
            className="text-xs font-medium text-lavender-700 hover:underline"
          >
            Explore comforting reminders →
          </Link>
        </div>
      )}
    </Card>
  );
};
