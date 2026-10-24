export type MoodType =
  | 'okay'
  | 'sad'
  | 'overwhelmed'
  | 'anxious'
  | 'angry'
  | 'exhausted'
  | 'lonely'
  | 'unknown';

export interface MoodConfig {
  type: MoodType;
  label: string;
  emojiText: string;
  gentleColor: string;
  comfortMessage: string;
}

export interface MoodEntry {
  id: string;
  user_id: string;
  mood: MoodType;
  note?: string;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title?: string;
  content: string;
  mood?: MoodType;
  created_at: string;
  updated_at: string;
}

export type SupportMode = 'LISTEN' | 'COMFORT' | 'CALM_DOWN' | 'THINK_IT_THROUGH';

export interface SupportModeDetails {
  id: SupportMode;
  name: string;
  description: string;
  intention: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  is_demo?: boolean;
}

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string;
  support_mode?: SupportMode;
  created_at: string;
  updated_at: string;
}

export interface PersonalReminder {
  id: string;
  user_id: string;
  title: string;
  message: string;
  category?: string;
  is_pinned: boolean;
  author_type?: 'creator' | 'personal';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name?: string;
  created_at: string;
  updated_at?: string;
}

export interface EmergencyHelpline {
  id: string;
  name: string;
  contact: string;
  description: string;
  available: string;
  region: 'India' | 'Global' | 'US/Canada' | 'UK';
  link?: string;
}
