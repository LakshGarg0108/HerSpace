import React, { useState } from 'react';
import { Wind, Eye, Sparkles, CloudRain } from 'lucide-react';
import { BreathingCircle } from '../components/calm/BreathingCircle';
import { FiveSensesGrounding } from '../components/calm/FiveSensesGrounding';
import { ShortReset } from '../components/calm/ShortReset';
import { AmbientSoundPlayer } from '../components/calm/AmbientSoundPlayer';

export const CalmCornerPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'breathing' | 'grounding' | 'reset' | 'ambient'>('breathing');

  const tabs = [
    { id: 'breathing' as const, label: '4-6 Breathing', icon: Wind },
    { id: 'grounding' as const, label: '5-Senses Grounding', icon: Eye },
    { id: 'reset' as const, label: '60-Sec Reset', icon: Sparkles },
    { id: 'ambient' as const, label: 'Ambient Sounds', icon: CloudRain },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-content-primary">
          Calm Corner
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary mt-1">
          Slow, self-paced sensory resets. No right or wrong way to participate.
        </p>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 border-b border-lavender-100/80 pb-3">
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-lavender-500 text-white shadow-soft ring-2 ring-lavender-200'
                  : 'bg-white text-content-secondary border border-lavender-100 hover:bg-lavender-50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Exercise View */}
      <div className="mt-4">
        {activeTab === 'breathing' && <BreathingCircle />}
        {activeTab === 'grounding' && <FiveSensesGrounding />}
        {activeTab === 'reset' && <ShortReset />}
        {activeTab === 'ambient' && <AmbientSoundPlayer />}
      </div>
    </div>
  );
};
