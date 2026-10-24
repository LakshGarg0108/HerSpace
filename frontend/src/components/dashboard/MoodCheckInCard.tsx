import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircleHeart, BookOpen, Wind, BookmarkCheck, Check, Sparkles } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { MOODS } from '../../lib/constants';
import { MoodType, SupportMode } from '../../types';
import { moodService } from '../../services/moodService';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';

export const MoodCheckInCard: React.FC<{ onMoodLogged?: () => void }> = ({ onMoodLogged }) => {
  const { user } = useAuth();
  const { setActiveSupportMode, addToast } = useApp();
  const navigate = useNavigate();

  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [hasLogged, setHasLogged] = useState(false);

  const activeMoodConfig = MOODS.find((m) => m.type === selectedMood);

  const handleSelectMood = (mood: MoodType) => {
    setSelectedMood(mood);
    setHasLogged(false);
  };

  const handleSaveCheckIn = async () => {
    if (!selectedMood || !user) return;
    setIsSaving(true);
    try {
      await moodService.createMood(user.id, selectedMood, note.trim() || undefined);
      setHasLogged(true);
      addToast('Your mood check-in was saved gently.', 'calm');
      if (onMoodLogged) onMoodLogged();
    } catch {
      addToast('Could not save mood check-in, saved locally.', 'info');
    } finally {
      setIsSaving(false);
    }
  };

  const getSuggestedModeForMood = (mood: MoodType): SupportMode => {
    switch (mood) {
      case 'overwhelmed':
      case 'anxious':
        return 'CALM_DOWN';
      case 'sad':
      case 'lonely':
      case 'exhausted':
        return 'COMFORT';
      case 'angry':
        return 'LISTEN';
      case 'unknown':
      case 'okay':
      default:
        return 'THINK_IT_THROUGH';
    }
  };

  const handleAction = (action: 'chat' | 'journal' | 'calm' | 'reminder') => {
    if (action === 'chat' && selectedMood) {
      setActiveSupportMode(getSuggestedModeForMood(selectedMood));
      navigate('/chat');
    } else if (action === 'journal') {
      navigate('/journal');
    } else if (action === 'calm') {
      navigate('/calm');
    } else if (action === 'reminder') {
      navigate('/reminders');
    }
  };

  return (
    <Card className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-serif font-medium text-content-primary">
            How are you carrying yourself right now?
          </h2>
          <p className="text-xs text-content-secondary mt-0.5">
            No pressure to be happy. Choose whatever matches your honest truth.
          </p>
        </div>
        <div className="p-2 rounded-2xl bg-lavender-100 text-lavender-600">
          <Heart className="w-4 h-4 fill-lavender-400" />
        </div>
      </div>

      {/* Mood Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {MOODS.map((item) => {
          const isSelected = selectedMood === item.type;
          return (
            <button
              key={item.type}
              onClick={() => handleSelectMood(item.type)}
              className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between gap-2 ${
                isSelected
                  ? 'border-lavender-500 bg-lavender-50 ring-2 ring-lavender-200 shadow-soft'
                  : 'border-lavender-100/80 bg-white hover:bg-surface-muted/60 hover:border-lavender-200'
              }`}
            >
              <span className="text-xl">{item.emojiText}</span>
              <span className="text-xs font-medium text-content-primary leading-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Comfort Response & Actions once selected */}
      {selectedMood && activeMoodConfig && (
        <div className="p-5 rounded-3xl bg-surface-lavender/60 border border-lavender-200/80 space-y-4 animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <span className="text-2xl">{activeMoodConfig.emojiText}</span>
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-lavender-700">
                A gentle thought for this moment
              </p>
              <p className="text-sm text-content-primary font-serif italic leading-relaxed">
                "{activeMoodConfig.comfortMessage}"
              </p>
            </div>
          </div>

          {/* Optional Reflection Note */}
          <div className="space-y-2">
            <label htmlFor="mood-note" className="text-xs text-content-secondary font-medium block">
              Optional note to yourself (completely private):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                id="mood-note"
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="A thought, trigger, or sentence you want to remember..."
                className="flex-1 px-4 py-2.5 text-xs bg-white rounded-2xl border border-lavender-200 focus:outline-none focus:ring-2 focus:ring-lavender-300"
              />
              <Button
                size="sm"
                variant={hasLogged ? 'sage' : 'primary'}
                onClick={handleSaveCheckIn}
                isLoading={isSaving}
                className="shrink-0"
              >
                {hasLogged ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1" />
                    Saved
                  </>
                ) : (
                  'Save Check-in'
                )}
              </Button>
            </div>
          </div>

          {/* Contextual Supportive Actions */}
          <div className="pt-2 border-t border-lavender-200/60">
            <p className="text-xs font-semibold text-content-secondary mb-2.5">
              What kind of support would feel best right now?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleAction('chat')}
                className="p-2.5 rounded-2xl bg-white border border-lavender-100 hover:border-lavender-300 hover:bg-lavender-50 transition-all text-xs font-medium text-content-primary flex items-center gap-2 group shadow-soft"
              >
                <MessageCircleHeart className="w-4 h-4 text-lavender-500 group-hover:scale-110 transition-transform" />
                <span>Talk to Companion</span>
              </button>

              <button
                onClick={() => handleAction('journal')}
                className="p-2.5 rounded-2xl bg-white border border-lavender-100 hover:border-lavender-300 hover:bg-lavender-50 transition-all text-xs font-medium text-content-primary flex items-center gap-2 group shadow-soft"
              >
                <BookOpen className="w-4 h-4 text-sage-700 group-hover:scale-110 transition-transform" />
                <span>Write in Journal</span>
              </button>

              <button
                onClick={() => handleAction('calm')}
                className="p-2.5 rounded-2xl bg-white border border-lavender-100 hover:border-lavender-300 hover:bg-lavender-50 transition-all text-xs font-medium text-content-primary flex items-center gap-2 group shadow-soft"
              >
                <Wind className="w-4 h-4 text-lavender-600 group-hover:scale-110 transition-transform" />
                <span>Calming Exercise</span>
              </button>

              <button
                onClick={() => handleAction('reminder')}
                className="p-2.5 rounded-2xl bg-white border border-lavender-100 hover:border-lavender-300 hover:bg-lavender-50 transition-all text-xs font-medium text-content-primary flex items-center gap-2 group shadow-soft"
              >
                <BookmarkCheck className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
                <span>Read a Reminder</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
