import React from 'react';
import { JOURNAL_PROMPTS } from '../../lib/constants';
import { Lightbulb } from 'lucide-react';

export const PromptPicker: React.FC<{ onSelectPrompt: (p: string) => void }> = ({
  onSelectPrompt,
}) => {
  return (
    <div className="space-y-2 p-4 rounded-3xl bg-surface-cream/80 border border-amber-100/70">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-content-primary">
        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
        <span>Need a gentle starting point? Tap any thought to insert:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {JOURNAL_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelectPrompt(prompt)}
            className="text-xs text-left px-3 py-1.5 rounded-2xl bg-white border border-amber-200/60 hover:border-amber-400 hover:bg-cream-200 text-content-secondary hover:text-content-primary transition-all shadow-soft"
          >
            "{prompt}"
          </button>
        ))}
      </div>
    </div>
  );
};
