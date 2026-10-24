import React, { useState, useEffect, useRef } from 'react';
import { Send, Trash2, RotateCcw, AlertCircle, ShieldAlert, Sparkles, Heart } from 'lucide-react';
import { ModeSelector } from './ModeSelector';
import { SuggestedPrompts } from './SuggestedPrompts';
import { ChatMessageItem } from './ChatMessageItem';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { SupportMode, ChatMessage } from '../../types';
import { chatService } from '../../services/chatService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const ChatInterface: React.FC = () => {
  const { user } = useAuth();
  const { activeSupportMode, setActiveSupportMode, openEmergencyModal, addToast } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Initial welcome message
  const WELCOME_MESSAGE: ChatMessage = {
    id: 'welcome-companion-msg',
    conversation_id: 'active-convo',
    role: 'assistant',
    content:
      "Hello, friend. I'm here with you. There are no expectations here—you don't have to explain anything perfectly, and you don't have to be strong. How is your heart doing in this moment?",
    created_at: new Date().toISOString(),
  };

  useEffect(() => {
    // Load local history if any
    const loadChat = async () => {
      const history = await chatService.getHistory();
      if (history && history.length > 0) {
        setMessages(history);
      } else {
        setMessages([WELCOME_MESSAGE]);
      }
    };
    loadChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Distress detection heuristic on user input for proactive care
  const checkForSevereDistress = (text: string) => {
    const lower = text.toLowerCase();
    const distressWords = [
      'kill myself',
      'want to die',
      'suicide',
      'end my life',
      'self harm',
      'cutting myself',
      'can’t go on',
      "can't go on",
      'hurt myself',
    ];
    return distressWords.some((word) => lower.includes(word));
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    // Check distress
    const distressDetected = checkForSevereDistress(text);

    const userMessage: ChatMessage = {
      id: 'usr-' + Date.now(),
      conversation_id: 'active-convo',
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };

    chatService.saveMessageLocally({
      conversation_id: userMessage.conversation_id,
      role: userMessage.role,
      content: userMessage.content,
    });

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setErrorMsg(null);
    setLastFailedMessage(null);
    setIsLoading(true);

    // If severe distress detected, companion immediately offers warm safety grounding
    if (distressDetected) {
      setTimeout(() => {
        const safetyCompanionMsg: ChatMessage = {
          id: 'safety-companion-' + Date.now(),
          conversation_id: 'active-convo',
          role: 'assistant',
          content:
            "I hear how deeply in pain you are right now, and I want you to know your life has immense value. I am an AI companion and cannot keep you physically safe or provide medical care. Please let someone hold this weight with you right now—whether a trusted friend, family member, or one of the free, confidential 24/7 helplines.\n\nPlease click 'Get Help Now' above or at the bottom of our conversation to speak to someone who cares.",
          created_at: new Date().toISOString(),
        };
        chatService.saveMessageLocally({
          conversation_id: safetyCompanionMsg.conversation_id,
          role: safetyCompanionMsg.role,
          content: safetyCompanionMsg.content,
        });
        setMessages((prev) => [...prev, safetyCompanionMsg]);
        setIsLoading(false);
      }, 700);
      return;
    }

    try {
      const historyContext = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-6)
        .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

      const res = await chatService.sendMessage(
        text,
        activeSupportMode,
        'active-convo',
        historyContext
      );

      const assistantMsg: ChatMessage = {
        id: 'ast-' + Date.now(),
        conversation_id: 'active-convo',
        role: 'assistant',
        content: res.response,
        created_at: new Date().toISOString(),
        is_demo: res.isDemo,
      };

      chatService.saveMessageLocally({
        conversation_id: assistantMsg.conversation_id,
        role: assistantMsg.role,
        content: assistantMsg.content,
        is_demo: assistantMsg.is_demo,
      });

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setErrorMsg('I had trouble connecting for a moment. You can retry safely.');
      setLastFailedMessage(text);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearHistory = async () => {
    await chatService.clearHistory();
    setMessages([WELCOME_MESSAGE]);
    setIsConfirmClearOpen(false);
    addToast('Conversation history cleared peacefully.', 'calm');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[550px] bg-white rounded-4xl border border-lavender-100/80 shadow-soft overflow-hidden">
      {/* Top Header of Chat Window */}
      <div className="p-4 sm:p-5 bg-surface-lavender/40 border-b border-lavender-100/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-lavender-500 text-white flex items-center justify-center shadow-soft shrink-0">
            <Heart className="w-5 h-5 fill-lavender-200" />
          </div>
          <div>
            <h2 className="text-base font-serif font-medium text-content-primary flex items-center gap-2">
              <span>Your Empathetic Companion</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-sage-100 text-sage-800 font-sans font-medium">
                Active & Gentle
              </span>
            </h2>
            <p className="text-xs text-content-secondary">
              A gentle harbor. Never judgmental, never rushing you.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([WELCOME_MESSAGE])}
            className="p-2 rounded-xl text-content-secondary hover:text-content-primary hover:bg-lavender-100/70 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            title="Start fresh conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

          <button
            onClick={() => setIsConfirmClearOpen(true)}
            className="p-2 rounded-xl text-content-secondary hover:text-rose-500 hover:bg-rose-50 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            title="Clear all messages"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear History</span>
          </button>
        </div>
      </div>

      {/* Support Mode Selector at top */}
      <div className="p-3 bg-surface-muted/40 border-b border-lavender-100/50">
        <ModeSelector
          currentMode={activeSupportMode}
          onSelectMode={setActiveSupportMode}
          disabled={isLoading}
        />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-start gap-3 my-4 animate-in fade-in">
            <div className="w-8 h-8 rounded-2xl bg-lavender-100 border border-lavender-200 flex items-center justify-center text-lavender-600 shadow-soft">
              <Heart className="w-4 h-4 fill-lavender-400" />
            </div>
            <div className="bg-white border border-lavender-100 rounded-3xl p-4 shadow-soft inline-flex items-center gap-1.5 text-xs text-content-secondary">
              <span className="w-2 h-2 rounded-full bg-lavender-400 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-lavender-400 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-lavender-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              <span className="ml-2 font-medium text-lavender-700">Listening with care...</span>
            </div>
          </div>
        )}

        {/* Error retry banner */}
        {errorMsg && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-500 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            {lastFailedMessage && (
              <button
                onClick={() => handleSendMessage(lastFailedMessage)}
                className="underline font-semibold hover:text-rose-600"
              >
                Retry message
              </button>
            )}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts if only welcome message is present */}
      {messages.length <= 2 && (
        <div className="px-4 sm:px-6">
          <SuggestedPrompts
            onSelectPrompt={(p) => handleSendMessage(p)}
            disabled={isLoading}
          />
        </div>
      )}

      {/* Input Form at bottom */}
      <div className="p-3 sm:p-4 bg-surface-lavender/30 border-t border-lavender-100/70">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-end gap-2 bg-white rounded-3xl p-2 pl-4 border border-lavender-200/80 focus-within:border-lavender-500 focus-within:ring-2 focus-within:ring-lavender-200 transition-all shadow-soft"
        >
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Say whatever is on your mind (${activeSupportMode.toLowerCase().replace('_', ' ')} mode)...`}
            className="flex-1 max-h-32 min-h-[38px] py-1.5 text-xs sm:text-sm bg-transparent outline-none resize-none text-content-primary placeholder:text-content-light"
          />

          <Button
            type="submit"
            size="sm"
            variant="primary"
            disabled={!inputText.trim() || isLoading}
            isLoading={isLoading}
            className="rounded-2xl shrink-0 p-2.5 h-10 w-10 !px-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        <div className="flex items-center justify-between px-2 pt-2 text-[10px] text-content-light">
          <span>Press Enter to send, Shift + Enter for new line</span>
          <span>Conversations are private & never shared with advertisers</span>
        </div>
      </div>

      {/* Confirmation Modal to Clear Chat */}
      <Modal
        isOpen={isConfirmClearOpen}
        onClose={() => setIsConfirmClearOpen(false)}
        title="Clear conversation history?"
        subtitle="This will gently remove messages from your current screen."
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Your conversation is private. Clearing it removes local records permanently.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmClearOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="rose"
              size="sm"
              onClick={handleClearHistory}
            >
              Clear Messages
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
