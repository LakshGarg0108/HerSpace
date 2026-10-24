import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Wind, Sparkles } from 'lucide-react';
import { Button } from '../common/Button';

export const BreathingCircle: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [selectedDuration, setSelectedDuration] = useState<number>(120); // 2 minutes default
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const INHALE_DURATION = 4;
  const EXHALE_DURATION = 6;

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds((prev) => {
          if (selectedDuration > 0 && prev + 1 >= selectedDuration) {
            setIsActive(false);
            return selectedDuration;
          }
          return prev + 1;
        });

        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            setPhase((prevPhase) => {
              if (prevPhase === 'inhale') {
                return 'exhale';
              } else {
                return 'inhale';
              }
            });
            return phase === 'inhale' ? EXHALE_DURATION : INHALE_DURATION;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, selectedDuration]);

  const handleToggle = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    setCountdown(INHALE_DURATION);
    setElapsedSeconds(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-10 rounded-4xl bg-white border border-lavender-100 shadow-soft text-center space-y-8">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-lavender-100 text-lavender-800 text-xs font-semibold">
          <Wind className="w-3.5 h-3.5" />
          <span>Gentle 4-6 Breath</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-medium text-content-primary">
          Unhurried Breathing Space
        </h2>
        <p className="text-xs sm:text-sm text-content-secondary max-w-md mx-auto">
          Inhale for 4 seconds, exhale softly for 6 seconds. No breath holding required. You can pause or stop whenever you want.
        </p>
      </div>

      {/* Visual Animated Breathing Circle */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
        {/* Outer ambient aura */}
        <div
          className={`absolute rounded-full transition-all duration-1000 ease-in-out pointer-events-none ${
            phase === 'inhale' && isActive
              ? 'w-64 h-64 sm:w-72 sm:h-72 bg-lavender-200/50 blur-xl scale-110'
              : 'w-40 h-40 bg-sage-100/40 blur-lg scale-90'
          }`}
        />

        {/* Dynamic Pulsing Circle */}
        <div
          className={`w-48 h-48 sm:w-56 sm:h-56 rounded-full flex flex-col items-center justify-center transition-all duration-1000 ease-in-out shadow-soft-lg border-2 ${
            phase === 'inhale' && isActive
              ? 'scale-110 bg-lavender-100/90 border-lavender-400 shadow-lavender-200/50'
              : 'scale-90 bg-sage-50/90 border-sage-300 shadow-sage-200/50'
          }`}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-content-secondary">
            {isActive ? (phase === 'inhale' ? 'Inhale gently' : 'Release slowly') : 'Ready to begin'}
          </span>

          <span className="font-serif text-5xl font-medium text-content-primary my-1">
            {isActive ? countdown : '4 : 6'}
          </span>

          <span className="text-[11px] text-content-light font-medium">
            {isActive ? (phase === 'inhale' ? 'Feel your chest expand' : 'Softly let go') : 'Tap start below'}
          </span>
        </div>
      </div>

      {/* Duration selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        <span className="text-content-secondary font-medium mr-1">Session:</span>
        {[
          { label: '1 min', val: 60 },
          { label: '2 min', val: 120 },
          { label: '5 min', val: 300 },
          { label: 'Free', val: 0 },
        ].map((d) => (
          <button
            key={d.val}
            onClick={() => {
              setSelectedDuration(d.val);
              handleReset();
            }}
            className={`px-3 py-1.5 rounded-full border transition-all ${
              selectedDuration === d.val
                ? 'bg-lavender-500 text-white border-lavender-600 shadow-soft'
                : 'bg-surface-muted text-content-secondary border-lavender-100 hover:bg-lavender-100'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant={isActive ? 'secondary' : 'primary'}
          size="lg"
          onClick={handleToggle}
          leftIcon={isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
          className="min-w-[140px]"
        >
          {isActive ? 'Pause' : elapsedSeconds > 0 ? 'Resume' : 'Start Breathing'}
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={handleReset}
          leftIcon={<RotateCcw className="w-4 h-4" />}
          title="Reset timer"
        >
          Reset
        </Button>
      </div>

      {/* Elapsed Counter */}
      {selectedDuration > 0 && (
        <p className="text-xs text-content-light">
          Progress: {formatTime(elapsedSeconds)} / {formatTime(selectedDuration)}
        </p>
      )}
    </div>
  );
};
