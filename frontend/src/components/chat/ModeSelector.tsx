import React from 'react';
import { SUPPORT_MODES } from '../../lib/constants';
import { SupportMode } from '../../types';
import { Ear, HeartHandshake, Wind, Compass } from 'lucide-react';

interface ModeSelectorProps {
  currentMode: SupportMode;
  onSelectMode: (mode: SupportMode) => void;
  disabled?: boolean;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({
  currentMode,
  onSelectMode,
  disabled = false,
}) => {
  const getIcon = (id: SupportMode) => {
    switch (id) {
      case 'LISTEN':
        return <Ear className="w-3.5 h-3.5" />;
      case 'COMFORT':
        return <HeartHandshake className="w-3.5 h-3.5" />;
      case 'CALM_DOWN':
        return <Wind className="w-3.5 h-3.5" />;
      case 'THINK_IT_THROUGH':
        return <Compass className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-content-secondary px-1">
        <span className="font-semibold uppercase tracking-wider text-[11px]">How should I be here for you?</span>
        <span className="text-[11px] text-lavender-700 font-medium">Choose a mode anytime</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SUPPORT_MODES.map((mode) => {
          const isSelected = currentMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectMode(mode.id)}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'bg-lavender-500 text-white border-lavender-600 shadow-soft ring-2 ring-lavender-200'
                  : 'bg-white text-content-secondary border-lavender-100/80 hover:border-lavender-200 hover:bg-lavender-50/50'
              }`}
            >
              <div className="flex items-center gap-1.5 font-medium text-xs">
                <span className={isSelected ? 'text-lavender-200' : 'text-lavender-600'}>
                  {getIcon(mode.id)}
                </span>
                <span className={isSelected ? 'text-white' : 'text-content-primary'}>
                  {mode.name}
                </span>
              </div>
              <p
                className={`text-[11px] leading-tight line-clamp-2 ${
                  isSelected ? 'text-lavender-100' : 'text-content-secondary'
                }`}
              >
                {mode.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
