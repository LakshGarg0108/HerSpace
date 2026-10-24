/**
 * Local Browser Storage Demo Fallback
 * 
 * IMPORTANT PRIVACY NOTICE:
 * Browser local storage is used ONLY when Supabase cloud database credentials 
 * are not configured or when explicitly operating in offline/demo mode. 
 * Browser storage is NOT equivalent to encrypted private cloud storage and 
 * must not be described as secure against someone with physical access to the device 
 * or browser profile.
 */

import { MoodEntry, JournalEntry, ChatMessage, PersonalReminder, UserProfile } from '../types';
import { INITIAL_REMINDERS } from './constants';

const KEYS = {
  USER: 'hss_demo_user',
  MOODS: 'hss_demo_moods',
  JOURNAL: 'hss_demo_journal',
  MESSAGES: 'hss_demo_messages',
  REMINDERS: 'hss_demo_reminders',
  SETTINGS: 'hss_demo_settings',
};

const DEFAULT_USER: UserProfile = {
  id: 'demo-user-id',
  email: 'companion@hersafespace.app',
  display_name: 'Friend',
  created_at: new Date().toISOString(),
};

export const demoStorage = {
  getUser: (): UserProfile => {
    try {
      const data = localStorage.getItem(KEYS.USER);
      return data ? JSON.parse(data) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  setUser: (user: UserProfile) => {
    try {
      localStorage.setItem(KEYS.USER, JSON.stringify(user));
    } catch (e) {
      console.warn('Unable to persist user to local storage', e);
    }
  },

  getMoods: (): MoodEntry[] => {
    try {
      const data = localStorage.getItem(KEYS.MOODS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMood: (entry: Omit<MoodEntry, 'id' | 'created_at'>): MoodEntry => {
    const moods = demoStorage.getMoods();
    const newEntry: MoodEntry = {
      ...entry,
      id: 'mood-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    const updated = [newEntry, ...moods];
    try {
      localStorage.setItem(KEYS.MOODS, JSON.stringify(updated));
    } catch (e) {
      console.warn('Storage quota exceeded for moods', e);
    }
    return newEntry;
  },

  deleteMood: (id: string) => {
    const moods = demoStorage.getMoods().filter(m => m.id !== id);
    localStorage.setItem(KEYS.MOODS, JSON.stringify(moods));
  },

  getJournal: (): JournalEntry[] => {
    try {
      const data = localStorage.getItem(KEYS.JOURNAL);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveJournalEntry: (entry: { title?: string; content: string; mood?: any; id?: string; user_id: string }): JournalEntry => {
    const entries = demoStorage.getJournal();
    const now = new Date().toISOString();
    
    if (entry.id) {
      const index = entries.findIndex(e => e.id === entry.id);
      if (index !== -1) {
        entries[index] = {
          ...entries[index],
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          updated_at: now,
        };
        localStorage.setItem(KEYS.JOURNAL, JSON.stringify(entries));
        return entries[index];
      }
    }

    const newEntry: JournalEntry = {
      id: 'journal-' + Date.now(),
      user_id: entry.user_id,
      title: entry.title || '',
      content: entry.content,
      mood: entry.mood,
      created_at: now,
      updated_at: now,
    };
    const updated = [newEntry, ...entries];
    localStorage.setItem(KEYS.JOURNAL, JSON.stringify(updated));
    return newEntry;
  },

  deleteJournalEntry: (id: string) => {
    const entries = demoStorage.getJournal().filter(e => e.id !== id);
    localStorage.setItem(KEYS.JOURNAL, JSON.stringify(entries));
  },

  getMessages: (): ChatMessage[] => {
    try {
      const data = localStorage.getItem(KEYS.MESSAGES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMessage: (msg: Omit<ChatMessage, 'id' | 'created_at'>): ChatMessage => {
    const messages = demoStorage.getMessages();
    const newMsg: ChatMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    const updated = [...messages, newMsg];
    localStorage.setItem(KEYS.MESSAGES, JSON.stringify(updated));
    return newMsg;
  },

  clearMessages: () => {
    localStorage.removeItem(KEYS.MESSAGES);
  },

  getReminders: (): PersonalReminder[] => {
    try {
      const data = localStorage.getItem(KEYS.REMINDERS);
      if (data) return JSON.parse(data);

      // Seed with initial gentle reminders
      const seeded: PersonalReminder[] = INITIAL_REMINDERS.map((r, i) => ({
        ...r,
        id: 'reminder-init-' + (i + 1),
        user_id: DEFAULT_USER.id,
        created_at: new Date(Date.now() - (i * 3600000)).toISOString(),
        updated_at: new Date().toISOString(),
      }));
      localStorage.setItem(KEYS.REMINDERS, JSON.stringify(seeded));
      return seeded;
    } catch {
      return [];
    }
  },

  saveReminder: (reminder: Omit<PersonalReminder, 'id' | 'created_at' | 'updated_at'> & { id?: string }): PersonalReminder => {
    const list = demoStorage.getReminders();
    const now = new Date().toISOString();

    if (reminder.id) {
      const idx = list.findIndex(r => r.id === reminder.id);
      if (idx !== -1) {
        list[idx] = {
          ...list[idx],
          ...reminder,
          updated_at: now,
        };
        localStorage.setItem(KEYS.REMINDERS, JSON.stringify(list));
        return list[idx];
      }
    }

    const newReminder: PersonalReminder = {
      ...reminder,
      id: 'rem-' + Date.now(),
      author_type: 'personal',
      created_at: now,
      updated_at: now,
    };
    const updated = [newReminder, ...list];
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(updated));
    return newReminder;
  },

  togglePinReminder: (id: string): PersonalReminder | null => {
    const list = demoStorage.getReminders();
    const item = list.find(r => r.id === id);
    if (!item) return null;
    item.is_pinned = !item.is_pinned;
    item.updated_at = new Date().toISOString();
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(list));
    return item;
  },

  deleteReminder: (id: string) => {
    const list = demoStorage.getReminders().filter(r => r.id !== id);
    localStorage.setItem(KEYS.REMINDERS, JSON.stringify(list));
  },

  clearAllDemoData: () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.values(KEYS).forEach((k) => window.localStorage.removeItem(k));
      }
    } catch (e) {
      console.warn('Could not clear local demo data', e);
    }
  },
};
