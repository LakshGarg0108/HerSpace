import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, Lock, Mail, User, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const AuthPage: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { signIn, signUp, enableDemoUser, isSupabaseConnected } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both your email and a password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('For your safety, password should be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        const res = await signUp(email, password, displayName.trim() || undefined);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          addToast('Welcome to your sanctuary.', 'success');
          navigate('/dashboard');
        }
      } else {
        const res = await signIn(email, password);
        if (res.error) {
          setErrorMsg(res.error);
        } else {
          addToast('Welcome back, gentle soul.', 'calm');
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setErrorMsg('Something went wrong during sign-in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = () => {
    enableDemoUser('Friend');
    addToast('Entered in Local Demo Mode. Your reflections will stay in this browser.', 'calm');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-16 space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-3xl bg-lavender-100 text-lavender-600 flex items-center justify-center mx-auto shadow-soft">
          <Heart className="w-6 h-6 fill-lavender-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-content-primary">
          {isSignUp ? 'Create Your Safe Space' : 'Welcome to Your Sanctuary'}
        </h1>
        <p className="text-xs sm:text-sm text-content-secondary">
          "You don't have to be okay all the time."
        </p>
      </div>

      <Card className="p-6 sm:p-8 space-y-6">
        {/* Toggle tabs */}
        <div className="flex rounded-2xl bg-surface-muted p-1 border border-lavender-100">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(false);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              !isSignUp ? 'bg-white text-content-primary shadow-soft' : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(true);
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
              isSignUp ? 'bg-white text-content-primary shadow-soft' : 'text-content-secondary hover:text-content-primary'
            }`}
          >
            Create Account
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-500 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <Input
              label="What should we call you? (Optional)"
              type="text"
              placeholder="e.g. Maya, Friend, Star"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          )}

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            {isSignUp ? 'Enter Safe Harbor' : 'Sign In Peacefully'}
          </Button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-lavender-100" />
          <span className="flex-shrink mx-4 text-[11px] uppercase tracking-wider text-content-light font-medium">
            Or explore immediately
          </span>
          <div className="flex-grow border-t border-lavender-100" />
        </div>

        <Button
          type="button"
          variant="secondary"
          size="md"
          onClick={handleDemoSignIn}
          className="w-full"
          leftIcon={<Sparkles className="w-4 h-4 text-lavender-600" />}
        >
          Continue as Guest (Demo Mode)
        </Button>

        <div className="text-center pt-2">
          <p className="text-[11px] text-content-light leading-relaxed">
            Your privacy is strictly guarded. We never sell data or connect your thoughts to public feeds.
          </p>
        </div>
      </Card>
    </div>
  );
};
