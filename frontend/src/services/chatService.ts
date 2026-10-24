import { apiRequest } from './api';
import { SupportMode, ChatMessage } from '../types';
import { demoStorage } from '../lib/storage';

interface ChatRequestPayload {
  message: string;
  support_mode: SupportMode;
  conversation_id?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

interface ChatResponsePayload {
  response: string;
  conversation_id: string;
  is_demo: boolean;
  support_mode: SupportMode;
  safety_warning?: boolean;
}

// Gentle fallback responses when running without live AI connection
const LOCAL_DEMO_RESPONSES: Record<SupportMode, string[]> = {
  LISTEN: [
    "I'm right here with you. Thank you for telling me what's on your heart. Please take all the time you need—I'm just listening, with no pressure and no rush.",
    "That sounds genuinely heavy to carry alone. I hear you, and you don't need to explain or justify any of it to me. Keep letting it out if you want to.",
  ],
  COMFORT: [
    "I want you to know: you are not failing, even if today feels completely overwhelming. It's so understandable that you feel worn down. Breathe gently right now.",
    "Your feelings make complete sense given everything you're experiencing. You deserve kindness, patience, and a safe harbor today. I'm right here.",
  ],
  CALM_DOWN: [
    "Let's pause together for just ten seconds. Unclench your jaw, soften your shoulders, and feel the solid ground beneath your feet. You are safe in this quiet moment.",
    "When everything spins inside, we don't have to fix anything right now. Let's take one slow breath in through your nose... and a long, gentle exhale out. You are doing okay.",
  ],
  THINK_IT_THROUGH: [
    "It makes sense that this feels tangled. Let's look at one small piece: What is one thing right now that you have direct control over, and what is one thing that belongs to someone else?",
    "When a situation feels overwhelming, breaking it into tiny pieces helps. If you could give yourself just one small, gentle grace today, what would it look like?",
  ],
};

export const chatService = {
  sendMessage: async (
    message: string,
    mode: SupportMode,
    conversationId?: string,
    history: { role: 'user' | 'assistant'; content: string }[] = []
  ): Promise<{ response: string; isDemo: boolean; error?: string }> => {
    // 1. Try sending to FastAPI backend
    const res = await apiRequest<ChatResponsePayload>('/api/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        support_mode: mode,
        conversation_id: conversationId,
        history,
      } as ChatRequestPayload),
    });

    if (res.data) {
      return {
        response: res.data.response,
        isDemo: res.data.is_demo,
      };
    }

    // 2. If backend is not reached (e.g. standalone frontend demo), provide clear deterministic demo response
    const modePool = LOCAL_DEMO_RESPONSES[mode] || LOCAL_DEMO_RESPONSES.LISTEN;
    const fallbackText = modePool[Math.floor(Math.random() * modePool.length)];

    return {
      response: `[DEMO MODE — Backend or OpenAI not connected]\n\n${fallbackText}`,
      isDemo: true,
    };
  },

  getHistory: async (): Promise<ChatMessage[]> => {
    return demoStorage.getMessages();
  },

  saveMessageLocally: (msg: Omit<ChatMessage, 'id' | 'created_at'>): ChatMessage => {
    return demoStorage.saveMessage(msg);
  },

  clearHistory: async () => {
    demoStorage.clearMessages();
  },
};
