import { JournalEntry, MoodType } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { demoStorage } from '../lib/storage';

export const journalService = {
  getEntries: async (userId: string): Promise<JournalEntry[]> => {
    if (isSupabaseConfigured && supabase && userId !== 'demo-user-id') {
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return data as JournalEntry[];
        }
      } catch (e) {
        console.warn('Supabase fetch failed, falling back to local storage', e);
      }
    }
    return demoStorage.getJournal();
  },

  getEntryById: async (id: string, userId: string): Promise<JournalEntry | null> => {
    if (isSupabaseConfigured && supabase && userId !== 'demo-user-id') {
      try {
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          return data as JournalEntry;
        }
      } catch (e) {
        console.warn('Supabase fetch failed', e);
      }
    }
    const entries = demoStorage.getJournal();
    return entries.find(e => e.id === id) || null;
  },

  saveEntry: async (entry: {
    id?: string;
    user_id: string;
    title?: string;
    content: string;
    mood?: MoodType;
  }): Promise<JournalEntry> => {
    if (isSupabaseConfigured && supabase && entry.user_id !== 'demo-user-id') {
      try {
        if (entry.id) {
          const { data, error } = await supabase
            .from('journal_entries')
            .update({
              title: entry.title,
              content: entry.content,
              mood: entry.mood,
              updated_at: new Date().toISOString(),
            })
            .eq('id', entry.id)
            .select()
            .single();

          if (!error && data) return data as JournalEntry;
        } else {
          const { data, error } = await supabase
            .from('journal_entries')
            .insert({
              user_id: entry.user_id,
              title: entry.title,
              content: entry.content,
              mood: entry.mood,
            })
            .select()
            .single();

          if (!error && data) return data as JournalEntry;
        }
      } catch (e) {
        console.warn('Supabase save failed, storing locally', e);
      }
    }
    return demoStorage.saveJournalEntry(entry);
  },

  deleteEntry: async (id: string, userId: string): Promise<void> => {
    if (isSupabaseConfigured && supabase && userId !== 'demo-user-id') {
      try {
        await supabase.from('journal_entries').delete().eq('id', id);
        return;
      } catch (e) {
        console.warn('Supabase delete failed', e);
      }
    }
    demoStorage.deleteJournalEntry(id);
  },

  exportEntriesAsJson: (entries: JournalEntry[]) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(entries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `her_safe_space_journal_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  exportEntriesAsText: (entries: JournalEntry[]) => {
    const lines = entries.map(e => {
      const date = new Date(e.created_at).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return `========================================\nDATE: ${date}\nTITLE: ${e.title || 'Untitled Entry'}\nMOOD: ${e.mood || 'None'}\n\n${e.content}\n\n`;
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `her_safe_space_journal_${new Date().toISOString().slice(0, 10)}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },
};
