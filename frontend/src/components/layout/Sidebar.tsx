import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  MessageCircleHeart,
  BookOpen,
  Wind,
  BookmarkCheck,
  Settings,
  Sparkles,
} from 'lucide-react';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const navItems = [
    {
      to: '/dashboard',
      label: 'Home Sanctuary',
      description: 'Your daily gentle harbor',
      icon: Home,
    },
    {
      to: '/chat',
      label: 'AI Companion',
      description: 'Empathetic listening without judgment',
      icon: MessageCircleHeart,
      badge: '4 Modes',
    },
    {
      to: '/journal',
      label: 'Private Journal',
      description: 'Unhurried reflections & thoughts',
      icon: BookOpen,
    },
    {
      to: '/calm',
      label: 'Calm Corner',
      description: 'Guided breath & sensory reset',
      icon: Wind,
    },
    {
      to: '/reminders',
      label: 'Little Reminders',
      description: 'Comforting notes for hard days',
      icon: BookmarkCheck,
    },
    {
      to: '/settings',
      label: 'Settings & Privacy',
      description: 'Data controls & preferences',
      icon: Settings,
    },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 flex flex-col justify-between py-6 px-4 space-y-6">
      <nav className="space-y-1.5" aria-label="Main Navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-lavender-100 text-lavender-900 shadow-soft font-semibold'
                    : 'text-content-secondary hover:text-content-primary hover:bg-lavender-50/70'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-lavender-500 group-hover:scale-110 transition-transform" />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-lavender-200/70 text-lavender-800 font-medium">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Gentle encouragement mini card in sidebar */}
      <div className="p-4 rounded-3xl bg-surface-cream/80 border border-amber-100/70 text-xs text-content-secondary space-y-2">
        <div className="flex items-center gap-1.5 text-content-primary font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Gentle reminder</span>
        </div>
        <p className="font-serif italic text-content-secondary leading-relaxed">
          "You are not required to set yourself on fire to keep others warm."
        </p>
      </div>
    </aside>
  );
};
