import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Volume2, VolumeX, Menu, X, ShieldAlert, Sparkles, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { ambientSound } from '../../lib/audio';
import { DemoModeBadge } from '../common/DemoModeBadge';

export const Navbar: React.FC<{ onToggleMobileMenu: () => void; isMobileMenuOpen: boolean }> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
}) => {
  const { user } = useAuth();
  const { openEmergencyModal } = useApp();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [soundType, setSoundType] = useState<'rain' | 'ocean' | 'breeze'>('rain');
  const [showAudioPopover, setShowAudioPopover] = useState(false);
  const location = useLocation();

  const toggleSound = (type?: 'rain' | 'ocean' | 'breeze') => {
    const target = type || soundType;
    if (isPlayingAudio && (!type || type === soundType)) {
      ambientSound.stop();
      setIsPlayingAudio(false);
    } else {
      ambientSound.play(target);
      setSoundType(target);
      setIsPlayingAudio(true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-lavender-100/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Mobile hamburger & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-2xl text-content-secondary hover:bg-lavender-100/60"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-2xl bg-lavender-100 border border-lavender-200/80 flex items-center justify-center text-lavender-600 group-hover:scale-105 transition-transform shadow-soft">
              <Heart className="w-4 h-4 fill-lavender-500 text-lavender-600" />
            </div>
            <div>
              <span className="font-serif text-lg font-medium text-content-primary tracking-tight block">
                Her Safe Space
              </span>
              <span className="text-[10px] text-content-secondary hidden sm:block tracking-wide">
                You don't have to be okay all the time.
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <DemoModeBadge />

          {/* Ambient Sound Controller */}
          <div className="relative">
            <button
              onClick={() => toggleSound()}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowAudioPopover(!showAudioPopover);
              }}
              className={`p-2 rounded-full border transition-all flex items-center gap-1.5 text-xs font-medium ${
                isPlayingAudio
                  ? 'bg-lavender-200 text-lavender-900 border-lavender-300'
                  : 'bg-white text-content-secondary border-lavender-200/60 hover:bg-lavender-50'
              }`}
              title="Click to toggle ambient sound (Right-click or hold for sound options)"
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-4 h-4 text-lavender-700 animate-pulse" />
                  <span className="hidden md:inline capitalize">{soundType}</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-content-light" />
                  <span className="hidden md:inline">Ambient</span>
                </>
              )}
            </button>

            {/* Quick sound switcher modal/popover */}
            {showAudioPopover && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-soft-lg border border-lavender-100 p-2 text-xs z-50">
                <p className="text-[11px] font-semibold text-content-secondary px-2 py-1">Ambient Atmosphere</p>
                {(['rain', 'ocean', 'breeze'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      toggleSound(t);
                      setShowAudioPopover(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-xl capitalize transition-colors ${
                      soundType === t && isPlayingAudio
                        ? 'bg-lavender-100 text-lavender-800 font-semibold'
                        : 'hover:bg-surface-muted text-content-secondary'
                    }`}
                  >
                    {t === 'rain' && '🌧️ Gentle Rain'}
                    {t === 'ocean' && '🌊 Slow Waves'}
                    {t === 'breeze' && '🍃 Night Breeze'}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Crisis / Emergency Help Button */}
          <button
            onClick={openEmergencyModal}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-200/70 text-xs font-semibold transition-all shadow-soft"
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Get Help Now</span>
            <span className="sm:hidden">Help</span>
          </button>

          {/* User profile / auth */}
          {user ? (
            <Link
              to="/settings"
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-lavender-100/50 transition-colors"
              title="Account Settings"
            >
              <div className="w-7 h-7 rounded-full bg-lavender-200 border border-lavender-300 text-lavender-800 text-xs font-medium flex items-center justify-center">
                {user.display_name?.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
              </div>
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-xs font-medium text-lavender-700 hover:text-lavender-900 px-3 py-1.5 rounded-full hover:bg-lavender-100"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
