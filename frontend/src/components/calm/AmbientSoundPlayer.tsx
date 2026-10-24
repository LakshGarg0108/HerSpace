import React, { useState, useEffect } from 'react';
import { Play, Pause, Volume2, CloudRain, Waves, Wind } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { ambientSound } from '../../lib/audio';

export const AmbientSoundPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundType, setSoundType] = useState<'rain' | 'ocean' | 'breeze'>('rain');
  const [volume, setVolume] = useState(0.4);

  const sounds = [
    { id: 'rain' as const, name: 'Gentle Rain', desc: 'Soft rainfall against a quiet window', icon: CloudRain },
    { id: 'ocean' as const, name: 'Slow Waves', desc: 'Rhythmic rolling swells on a calm shore', icon: Waves },
    { id: 'breeze' as const, name: 'Night Breeze', desc: 'Warm wind rustling through evening leaves', icon: Wind },
  ];

  const handleToggle = (typeToPlay?: 'rain' | 'ocean' | 'breeze') => {
    const target = typeToPlay || soundType;
    if (isPlaying && (!typeToPlay || typeToPlay === soundType)) {
      ambientSound.stop();
      setIsPlaying(false);
    } else {
      ambientSound.play(target);
      ambientSound.setVolume(volume);
      setSoundType(target);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    ambientSound.setVolume(v);
  };

  useEffect(() => {
    return () => {
      // Audio stops when leaving page if desired, or user can stop it
    };
  }, []);

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-lavender-100/70 pb-4">
        <div>
          <h3 className="font-serif font-medium text-lg text-content-primary">
            Soothing Ambient Landscapes
          </h3>
          <p className="text-xs text-content-secondary mt-0.5">
            Calming synthesized acoustics designed to drown out harsh household noise and racing thoughts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sounds.map((s) => {
          const Icon = s.icon;
          const isSelected = soundType === s.id && isPlaying;
          return (
            <button
              key={s.id}
              onClick={() => handleToggle(s.id)}
              className={`p-4 rounded-3xl border text-left transition-all flex flex-col justify-between gap-3 ${
                isSelected
                  ? 'bg-lavender-500 text-white border-lavender-600 shadow-soft ring-2 ring-lavender-200'
                  : 'bg-white hover:bg-surface-muted border-lavender-100/80 text-content-primary'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`p-2.5 rounded-2xl ${isSelected ? 'bg-white/20 text-white' : 'bg-lavender-100 text-lavender-600'}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="text-xs font-semibold">
                  {isSelected ? 'Playing' : 'Play'}
                </span>
              </div>

              <div>
                <h4 className="font-medium text-sm">{s.name}</h4>
                <p className={`text-[11px] leading-relaxed mt-0.5 ${isSelected ? 'text-lavender-100' : 'text-content-secondary'}`}>
                  {s.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Volume slider & Master Control */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-surface-muted border border-lavender-100">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Button
            size="sm"
            variant={isPlaying ? 'primary' : 'outline'}
            onClick={() => handleToggle()}
            leftIcon={isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
          >
            {isPlaying ? 'Pause Sound' : 'Play Selected Sound'}
          </Button>
          <span className="text-xs text-content-secondary font-medium">
            Status: {isPlaying ? `Playing ${soundType}` : 'Silent'}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-56">
          <Volume2 className="w-4 h-4 text-content-secondary shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            aria-label="Ambient volume"
            className="w-full accent-lavender-500 cursor-pointer"
          />
          <span className="text-xs text-content-secondary w-8 text-right font-mono">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>
    </Card>
  );
};
