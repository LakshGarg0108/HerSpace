import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Sparkles, MessageCircleHeart, BookOpen, Wind, BookmarkCheck, ArrowRight, Lock } from 'lucide-react';
import { Button } from '../components/common/Button';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { DisclaimerBanner } from '../components/common/DisclaimerBanner';

export const LandingPage: React.FC = () => {
  const { user, enableDemoUser } = useAuth();
  const { openEmergencyModal } = useApp();

  return (
    <div className="space-y-16 py-6 sm:py-12 animate-in fade-in duration-300">
      {/* Disclaimer Banner on Landing */}
      <DisclaimerBanner />

      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-lavender-100 text-lavender-800 text-xs font-semibold shadow-soft">
          <Heart className="w-3.5 h-3.5 fill-lavender-400" />
          <span>A safe, gentle harbor for your mind</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-content-primary tracking-tight leading-[1.15]">
          You don't have to be okay all the time.
        </h1>

        <p className="text-base sm:text-lg text-content-secondary max-w-2xl mx-auto font-sans leading-relaxed">
          A private, warm sanctuary designed for girls and young women processing family tension, quiet overwhelm, and exhausting days. An empathetic companion that listens, without judgment or unsolicited advice.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          {user ? (
            <Link to="/dashboard">
              <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Enter Your Sanctuary
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button size="lg" variant="primary" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Create Safe Account
                </Button>
              </Link>
              <Link to="/dashboard" onClick={() => enableDemoUser('Friend')}>
                <Button size="lg" variant="secondary">
                  Explore in Demo Mode
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-content-light pt-2">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-sage-700" />
            <span>Private & confidential</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-sage-700" />
            <span>No third-party ad tracking</span>
          </span>
        </div>
      </section>

      {/* Core Sanctuary Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-lavender-100 shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-lavender-100 text-lavender-600 flex items-center justify-center shadow-soft">
            <MessageCircleHeart className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-medium text-lg text-content-primary">
            AI Emotional Companion
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Choose how you want to be met: Just Listen, Comfort, Calm Down, or Think It Through. Never medical, never preachy.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-lavender-100 shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-sage-100 text-sage-700 flex items-center justify-center shadow-soft">
            <BookOpen className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-medium text-lg text-content-primary">
            Private Journal
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Write unhurriedly with gentle prompts. Locked to your user profile and never sent to AI providers or external logs.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-lavender-100 shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cream-200 text-amber-800 flex items-center justify-center shadow-soft">
            <Wind className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-medium text-lg text-content-primary">
            Calm Corner
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Gentle 4-6 breathing circles, 5-4-3-2-1 sensory grounding, and soothing synthesized rain and wave soundscapes.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-lavender-100 shadow-soft space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center shadow-soft">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <h2 className="font-serif font-medium text-lg text-content-primary">
            Little Reminders
          </h2>
          <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
            Curated comfort notes and your own pinned anchors for moments when heavy family atmospheres feel too hard to carry.
          </p>
        </div>
      </section>

      {/* Gentle Philosophy Banner */}
      <section className="p-8 sm:p-12 rounded-4xl bg-gradient-to-r from-surface-lavender via-white to-surface-cream border border-lavender-200/60 shadow-soft text-center space-y-4 max-w-4xl mx-auto">
        <Sparkles className="w-6 h-6 text-lavender-500 mx-auto" />
        <h2 className="text-2xl sm:text-3xl font-serif font-medium text-content-primary">
          A space where you don't have to explain yourself.
        </h2>
        <p className="text-sm sm:text-base text-content-secondary max-w-2xl mx-auto font-sans leading-relaxed">
          "Family expectations and daily stresses can make you feel like you are constantly failing someone. You are allowed to take off your armor here."
        </p>
        <div className="pt-2">
          <Link to="/dashboard">
            <Button size="md" variant="primary">
              Step Inside
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};
