import React, { useState } from 'react';
import { Eye, Hand, Volume2, Flower2, Coffee, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

const STEPS = [
  {
    count: 5,
    sense: 'SEE',
    title: '5 Things You Can See',
    prompt: 'Look slowly around the room. Notice five distinct items—a pattern in the curtains, the edge of a chair, light falling across a wall.',
    icon: Eye,
    color: 'text-lavender-600 bg-lavender-100',
  },
  {
    count: 4,
    sense: 'FEEL',
    title: '4 Things You Can Feel',
    prompt: 'Notice four physical sensations—the fabric of your clothes against your arms, your feet pressed gently into your shoes or the rug, the temperature of the air on your cheeks.',
    icon: Hand,
    color: 'text-sage-700 bg-sage-100',
  },
  {
    count: 3,
    sense: 'HEAR',
    title: '3 Things You Can Hear',
    prompt: 'Close your eyes for three seconds and listen. Listen beyond the immediate space—distant traffic, a soft fan, birds outside, or your own breath.',
    icon: Volume2,
    color: 'text-amber-700 bg-amber-100',
  },
  {
    count: 2,
    sense: 'SMELL',
    title: '2 Things You Can Smell',
    prompt: 'Take a gentle breath through your nose. Notice two subtle scents—clean laundry, a cup of tea, wood, rain, or simply fresh neutral air.',
    icon: Flower2,
    color: 'text-rose-500 bg-rose-100',
  },
  {
    count: 1,
    sense: 'TASTE',
    title: '1 Thing You Can Taste',
    prompt: 'Notice the current taste in your mouth—a sip of water, toothpaste, coffee, or run your tongue gently over your teeth and notice the sensation.',
    icon: Coffee,
    color: 'text-lavender-700 bg-lavender-200',
  },
];

export const FiveSensesGrounding: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const step = STEPS[currentStepIndex];
  const Icon = step.icon;

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsCompleted(false);
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-lavender-100/70 pb-4">
        <div>
          <h3 className="font-serif font-medium text-lg text-content-primary">
            5-4-3-2-1 Sensory Grounding
          </h3>
          <p className="text-xs text-content-secondary mt-0.5">
            Gently re-anchoring your mind into your physical body and this safe room.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="text-xs text-content-secondary hover:text-content-primary p-1.5 rounded-xl hover:bg-lavender-50 inline-flex items-center gap-1"
          title="Restart grounding"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restart</span>
        </button>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Progress indicators */}
          <div className="flex items-center justify-center gap-2">
            {STEPS.map((s, idx) => (
              <div
                key={s.count}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentStepIndex
                    ? 'w-10 bg-lavender-500'
                    : idx < currentStepIndex
                    ? 'w-6 bg-lavender-200'
                    : 'w-6 bg-surface-muted'
                }`}
              />
            ))}
          </div>

          {/* Active Step Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-surface-lavender/30 border border-lavender-200/70 space-y-4 text-center max-w-xl mx-auto animate-in fade-in duration-200">
            <div className={`w-14 h-14 rounded-3xl mx-auto flex items-center justify-center ${step.color} shadow-soft`}>
              <Icon className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-lavender-700">
                Step {currentStepIndex + 1} of 5
              </span>
              <h4 className="text-xl font-serif font-medium text-content-primary">
                {step.title}
              </h4>
            </div>

            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed font-sans">
              {step.prompt}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              Skip this step
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {currentStepIndex === STEPS.length - 1 ? 'Finish Grounding' : 'I noticed them → Next'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-3xl bg-sage-50 border border-sage-200/70 text-center space-y-4 max-w-lg mx-auto animate-in zoom-in-95 duration-200">
          <div className="w-12 h-12 rounded-full bg-sage-200 text-sage-800 flex items-center justify-center mx-auto shadow-soft">
            <Check className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-serif font-medium text-content-primary">
              You are here. You are grounded.
            </h4>
            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
              Whatever turbulent thoughts were rushing before, your feet are on the floor and this room is quiet. Take this gentle stillness with you.
            </p>
          </div>

          <Button variant="outline" size="sm" onClick={handleReset}>
            Do another round
          </Button>
        </div>
      )}
    </Card>
  );
};
