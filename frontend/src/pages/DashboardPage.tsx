import React, { useState, useEffect } from 'react';
import { DailyMessageCard } from '../components/dashboard/DailyMessageCard';
import { MoodCheckInCard } from '../components/dashboard/MoodCheckInCard';
import { QuickActionsGrid } from '../components/dashboard/QuickActionsGrid';
import { RecentJournalSnippet } from '../components/dashboard/RecentJournalSnippet';
import { PinnedRemindersWidget } from '../components/dashboard/PinnedRemindersWidget';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';
import { journalService } from '../services/journalService';
import { reminderService } from '../services/reminderService';
import { useAuth } from '../context/AuthContext';
import { JournalEntry, PersonalReminder } from '../types';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [latestEntry, setLatestEntry] = useState<JournalEntry | null>(null);
  const [reminders, setReminders] = useState<PersonalReminder[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    try {
      const [entries, rems] = await Promise.all([
        journalService.getEntries(user.id),
        reminderService.getReminders(user.id),
      ]);
      setLatestEntry(entries.length > 0 ? entries[0] : null);
      setReminders(rems);
    } catch (e) {
      console.warn('Dashboard data fetch error', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Gentle Header & Greeting */}
      <DailyMessageCard />

      {/* Wellness & Non-Clinical Disclaimer */}
      <DisclaimerBanner compact />

      {/* Mood Check-In Widget */}
      <section>
        <MoodCheckInCard onMoodLogged={loadData} />
      </section>

      {/* Quick Sanctuary Pillars */}
      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-content-secondary px-1">
          Explore Your Spaces
        </h2>
        <QuickActionsGrid />
      </section>

      {/* Recent Reflections & Pinned Reminders */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentJournalSnippet latestEntry={latestEntry} loading={loading} />
        <PinnedRemindersWidget reminders={reminders} loading={loading} />
      </section>
    </div>
  );
};
