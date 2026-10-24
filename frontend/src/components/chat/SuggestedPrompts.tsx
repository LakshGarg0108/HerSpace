import React from 'react';
import { SUGGESTED_CHAT_PROMPTS } from '../../lib/constants';
import { Sparkles } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelectPrompt,
  disabled = false,
}) => {
  return (
    <div className="space-y-2.5 my-4">
      <div className="flex items-center gap-1.5 text-xs text-content-secondary px-1">
        <Sparkles className="w-3.5 h-3.5 text-lavender-500" />
        <span className="font-medium">When it's hard to find words, you can tap any of these:</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_CHAT_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(prompt)}
            className="text-xs text-left px-3.5 py-2 rounded-2xl bg-white border border-lavender-200/70 hover:border-lavender-400 hover:bg-lavender-50/70 text-content-primary transition-all shadow-soft active:scale-95 disabled:opacity-50"
          >
            "{prompt}"
          </button>
        ))}
      </div>
    </div>
  );
};
