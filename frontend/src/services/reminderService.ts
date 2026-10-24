import { PersonalReminder } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { demoStorage } from '../lib/storage';

export const reminderService = {
  getReminders: async (userId: string): Promise<PersonalReminder[]> => {
    if (isSupabaseConfigured && supabase && userId !== 'demo-user-id') {
      try {
        const { data, error } = await supabase
          .from('personal_reminders')
          .select('*')
          .order('is_pinned', { ascending: false })
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as PersonalReminder[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local demo reminders', e);
      }
    }
    return demoStorage.getReminders();
  },

  saveReminder: async (
    userId: string,
    reminder: { id?: string; title: string; message: string; category?: string; is_pinned?: boolean }
  ): Promise<PersonalReminder> => {
    if (isSupabaseConfigured && supabase && userId !== 'demo-user-id') {
      try {
        if (reminder.id) {
          const { data, error } = await supabase
            .from('personal_reminders')
            .update({
              title: reminder.title,
              message: reminder.message,
              category: reminder.category,
              is_pinned: reminder.is_pinned ?? false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', reminder.id)
            .select()
            .single();

          if (!error && data) return data as PersonalReminder;
        } else {
          const { data, error } = await supabase
            .from('personal_reminders')
            .insert({
              user_id: userId,
              title: reminder.title,
              message: reminder.message,
              category: reminder.category,
              is_pinned: reminder.is_pinned ?? false,
            })
            .select()
            .single();

          if (!error && data) return data as PersonalReminder;
        }
      } catch (e) {
        console.warn('Supabase save failed, storing locally', e);
      }
    }
    return demoStorage.saveReminder({
      user_id: userId,
      title: reminder.title,
      message: reminder.message,
      category: reminder.category,
      is_pinned: reminder.is_pinned ?? false,
      id: reminder.id,
    });
  },

  togglePin: async (id: string, userId: string, currentPinned: boolean): Promise<void> => {
    if (isSupabaseConfigured && supabase && userId !== 'demo-user-id') {
      try {
        await supabase
          .from('personal_reminders')
          .update({ is_pinned: !currentPinned })
          .eq('id', id);
        return;
      } catch (e) {
        console.warn('Supabase pin toggle failed', e);
      }
    }
    demoStorage.togglePinReminder(id);
  },

  deleteReminder: async (id: string, userId: string): Promise<void> => {
    if (isSupabaseConfigured && supabase && userId !== 'demo-user-id') {
      try {
        await supabase.from('personal_reminders').delete().eq('id', id);
        return;
      } catch (e) {
        console.warn('Supabase delete reminder failed', e);
      }
    }
    demoStorage.deleteReminder(id);
  },

  getRandomComfortReminder: (reminders: PersonalReminder[]): PersonalReminder | null => {
    if (!reminders || reminders.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * reminders.length);
    return reminders[randomIndex];
  },
};
