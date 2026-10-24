import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircleHeart, BookOpen, Wind, BookmarkCheck, Sparkles } from 'lucide-react';

export const QuickActionsGrid: React.FC = () => {
  const actions = [
    {
      to: '/chat',
      title: 'Talk to Companion',
      subtitle: 'Vent, seek comfort, or think things through',
      icon: MessageCircleHeart,
      bg: 'bg-lavender-50 hover:bg-lavender-100/80',
      border: 'border-lavender-200/70',
      iconColor: 'text-lavender-600',
    },
    {
      to: '/calm',
      title: 'Calm Corner',
      subtitle: 'Gentle 4-6 breathing & 5-senses grounding',
      icon: Wind,
      bg: 'bg-sage-50 hover:bg-sage-100/80',
      border: 'border-sage-200/70',
      iconColor: 'text-sage-700',
    },
    {
      to: '/journal',
      title: 'Private Journal',
      subtitle: 'Your thoughts, locked to your account',
      icon: BookOpen,
      bg: 'bg-cream-100 hover:bg-cream-200/80',
      border: 'border-cream-300',
      iconColor: 'text-amber-700',
    },
    {
      to: '/reminders',
      title: 'Little Reminders',
      subtitle: 'Comforting notes for hard days',
      icon: BookmarkCheck,
      bg: 'bg-surface-lavender/40 hover:bg-surface-lavender/80',
      border: 'border-lavender-200/60',
      iconColor: 'text-lavender-700',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Link
            key={act.to}
            to={act.to}
            className={`p-5 rounded-3xl border transition-all duration-200 shadow-soft hover:shadow-soft-md group flex flex-col justify-between min-h-[120px] ${act.bg} ${act.border}`}
          >
            <div className="flex items-center justify-between">
              <span className={`p-2.5 rounded-2xl bg-white shadow-soft ${act.iconColor}`}>
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-lavender-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="mt-4">
              <h3 className="font-serif font-medium text-sm text-content-primary">
                {act.title}
              </h3>
              <p className="text-xs text-content-secondary mt-0.5 line-clamp-1">
                {act.subtitle}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
