import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, PenLine, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { JournalEntry } from '../../types';

interface RecentJournalSnippetProps {
  latestEntry: JournalEntry | null;
  loading: boolean;
}

export const RecentJournalSnippet: React.FC<RecentJournalSnippetProps> = ({
  latestEntry,
  loading,
}) => {
  if (loading) {
    return (
      <Card className="animate-pulse space-y-3">
        <div className="h-4 bg-lavender-100 rounded w-1/3" />
        <div className="h-12 bg-lavender-50 rounded" />
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-lavender-500" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-content-secondary">
            Your Private Journal
          </h3>
        </div>
        <Link
          to="/journal"
          className="text-xs font-semibold text-lavender-700 hover:text-lavender-900 inline-flex items-center gap-1"
        >
          <span>All reflections</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {latestEntry ? (
        <div className="p-4 rounded-2xl bg-surface-muted/60 border border-lavender-100 space-y-2">
          <div className="flex items-center justify-between text-xs text-content-secondary">
            <span className="font-medium text-content-primary">
              {latestEntry.title || 'Untitled Entry'}
            </span>
            <span>
              {new Date(latestEntry.created_at).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          <p className="text-xs text-content-secondary line-clamp-2 leading-relaxed">
            {latestEntry.content}
          </p>
          <div className="pt-1">
            <Link
              to="/journal"
              className="text-[11px] font-semibold text-lavender-700 hover:underline"
            >
              Continue writing or edit →
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-5 rounded-2xl bg-surface-lavender/40 border border-lavender-100 text-center space-y-2">
          <Sparkles className="w-5 h-5 text-lavender-400 mx-auto" />
          <p className="text-xs text-content-secondary max-w-sm mx-auto leading-relaxed">
            No journal entries written yet. When your mind feels noisy, letting words spill onto the page can be a quiet relief.
          </p>
          <Link
            to="/journal"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-lavender-500 hover:bg-lavender-600 text-white text-xs font-medium transition-colors shadow-soft"
          >
            <PenLine className="w-3.5 h-3.5" />
            <span>Write your first thought</span>
          </Link>
        </div>
      )}
    </Card>
  );
};
