import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';

const RESET_STEPS = [
  {
    step: 1,
    title: 'Put your feet somewhere comfortable.',
    detail: 'Uncross your legs if they are crossed. Feel the solid floor supporting you without needing any effort.',
  },
  {
    step: 2,
    title: 'Relax your shoulders if that feels comfortable.',
    detail: 'Drop them gently away from your ears. Let your chest soften. Release any tension in your jaw or forehead.',
  },
  {
    step: 3,
    title: 'Notice your surroundings.',
    detail: 'Look around the room without judging anything. Notice the light, the silence, the space you are occupying.',
  },
  {
    step: 4,
    title: 'Take a comfortable, unforced breath.',
    detail: 'Not a performance breath. Just a natural, deep breath in and a quiet sigh out.',
  },
  {
    step: 5,
    title: 'Decide what you need next.',
    detail: 'Do you need a glass of cool water? A warm blanket? A few minutes of quiet? A walk outside? Whatever it is, honor it.',
  },
];

export const ShortReset: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [done, setDone] = useState(false);

  const current = RESET_STEPS[activeStep];

  const handleNext = () => {
    if (activeStep < RESET_STEPS.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      setDone(true);
    }
  };

  const handleReset = () => {
    setActiveStep(0);
    setDone(false);
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-lavender-100/70 pb-4">
        <div>
          <h3 className="font-serif font-medium text-lg text-content-primary">
            60-Second Reset
          </h3>
          <p className="text-xs text-content-secondary mt-0.5">
            A quick five-step micro-pause whenever you feel overwhelmed by a situation.
          </p>
        </div>
      </div>

      {!done ? (
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream-200 text-amber-900 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Step {current.step} of 5</span>
          </div>

          <div className="p-6 rounded-3xl bg-surface-cream/90 border border-amber-100 space-y-2">
            <h4 className="text-xl font-serif font-medium text-content-primary">
              {current.title}
            </h4>
            <p className="text-xs sm:text-sm text-content-secondary leading-relaxed font-sans">
              {current.detail}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <Button
              variant="cream"
              size="md"
              onClick={handleNext}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {activeStep === RESET_STEPS.length - 1 ? 'Complete Reset' : 'Next Step'}
            </Button>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto p-6 rounded-3xl bg-surface-lavender border border-lavender-200 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-lavender-200 text-lavender-800 flex items-center justify-center mx-auto">
            <Check className="w-5 h-5" />
          </div>
          <h4 className="font-serif font-medium text-base text-content-primary">
            Micro-reset finished.
          </h4>
          <p className="text-xs text-content-secondary leading-relaxed">
            Drink that water or close your eyes for five minutes. You are allowed to take up space and take your time.
          </p>
          <Button variant="outline" size="sm" onClick={handleReset}>
            Reset again if needed
          </Button>
        </div>
      )}
    </Card>
  );
};
