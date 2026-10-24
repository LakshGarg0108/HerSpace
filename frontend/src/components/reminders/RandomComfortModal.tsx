import React, { useState } from 'react';
import { Sparkles, RotateCw, Heart } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { PersonalReminder } from '../../types';

interface RandomComfortModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminders: PersonalReminder[];
}

export const RandomComfortModal: React.FC<RandomComfortModalProps> = ({
  isOpen,
  onClose,
  reminders,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (reminders.length <= 1) return;
    let nextIndex = Math.floor(Math.random() * reminders.length);
    if (nextIndex === currentIndex) {
      nextIndex = (currentIndex + 1) % reminders.length;
    }
    setCurrentIndex(nextIndex);
  };

  const currentReminder = reminders[currentIndex] || reminders[0];

  if (!currentReminder) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="A Little Message for You"
      subtitle="Close your eyes for three seconds, take a slow breath, then read this."
    >
      <div className="space-y-6 text-center">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-surface-cream to-lavender-50 border border-lavender-200/80 shadow-soft-lg space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-lavender-100 text-lavender-600 flex items-center justify-center mx-auto shadow-soft">
            <Heart className="w-6 h-6 fill-lavender-300" />
          </div>

          <div className="space-y-2">
            {currentReminder.category && (
              <span className="text-[11px] uppercase tracking-wider font-semibold text-lavender-700 bg-lavender-100/70 px-3 py-1 rounded-full">
                {currentReminder.category}
              </span>
            )}

            <h3 className="text-xl sm:text-2xl font-serif font-medium text-content-primary">
              {currentReminder.title}
            </h3>

            <p className="text-sm sm:text-base font-serif italic text-content-secondary leading-relaxed pt-2">
              "{currentReminder.message}"
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={handleNext}
            leftIcon={<RotateCw className="w-4 h-4" />}
          >
            Show me another note
          </Button>

          <Button variant="primary" size="md" onClick={onClose}>
            Keep this in my heart
          </Button>
        </div>
      </div>
    </Modal>
  );
};
