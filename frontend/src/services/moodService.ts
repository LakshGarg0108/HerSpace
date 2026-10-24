import { MoodEntry, MoodType } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { demoStorage } from '../lib/storage';

export const moodService = {
  getMoods: async (userId: string): Promise<MoodEntry[]> => {
    if (isSupabaseConfigured && supabase && userId !== 'demo-user-id') {
      try {
        const { data, error } = await supabase
          .from('mood_entries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as MoodEntry[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local storage', e);
      }
    }
    return demoStorage.getMoods();
  },

  createMood: async (userId: string, mood: MoodType, note?: string): Promise<MoodEntry> => {
    if (isSupabaseConfigured && supabase && userId !== 'demo-user-id') {
      try {
        const { data, error } = await supabase
          .from('mood_entries')
          .insert({ user_id: userId, mood, note })
          .select()
          .single();

        if (!error && data) {
          return data as MoodEntry;
        }
      } catch (e) {
        console.warn('Supabase insert failed, storing locally', e);
      }
    }
    return demoStorage.saveMood({ user_id: userId, mood, note });
  },

  deleteMood: async (id: string, userId: string): Promise<void> => {
    if (isSupabaseConfigured && supabase && userId !== 'demo-user-id') {
      try {
        await supabase.from('mood_entries').delete().eq('id', id);
        return;
      } catch (e) {
        console.warn('Supabase delete failed', e);
      }
    }
    demoStorage.deleteMood(id);
  },
};
