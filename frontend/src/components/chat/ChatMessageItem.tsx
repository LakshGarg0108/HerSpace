import React from 'react';
import { Heart, User, Sparkles } from 'lucide-react';
import { ChatMessage } from '../../types';

export const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`flex items-start gap-3 my-4 animate-in fade-in duration-200 ${
        isAssistant ? 'justify-start' : 'justify-end'
      }`}
    >
      {/* Companion Avatar */}
      {isAssistant && (
        <div className="w-8 h-8 rounded-2xl bg-lavender-100 border border-lavender-200 flex items-center justify-center text-lavender-600 shrink-0 mt-1 shadow-soft">
          <Heart className="w-4 h-4 fill-lavender-400" />
        </div>
      )}

      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 space-y-1.5 shadow-soft ${
          isAssistant
            ? 'bg-white border border-lavender-100/90 text-content-primary rounded-tl-sm'
            : 'bg-lavender-500 text-white rounded-tr-sm'
        }`}
      >
        <div className="flex items-center justify-between gap-3 text-[11px] font-semibold tracking-wider uppercase opacity-75">
          <span>{isAssistant ? 'Companion' : 'You'}</span>
          <span>
            {new Date(message.created_at).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        {/* Message body with paragraphs */}
        <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {message.content}
        </div>

        {/* Demo Mode Badge if transparent fallback */}
        {message.is_demo && (
          <div className="pt-1.5 flex items-center gap-1 text-[10px] text-amber-700/80 font-medium">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Generated in Demo Mode (Local response)</span>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {!isAssistant && (
        <div className="w-8 h-8 rounded-2xl bg-lavender-200 border border-lavender-300 flex items-center justify-center text-lavender-800 shrink-0 mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
