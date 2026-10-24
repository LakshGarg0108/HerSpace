import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Home, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto py-16 text-center space-y-6 animate-in fade-in duration-200">
      <Card className="p-8 sm:p-10 space-y-4">
        <div className="w-12 h-12 rounded-3xl bg-lavender-100 text-lavender-600 flex items-center justify-center mx-auto shadow-soft">
          <Heart className="w-6 h-6 fill-lavender-400" />
        </div>

        <h1 className="text-2xl font-serif font-medium text-content-primary">
          You wandered into a quiet corner.
        </h1>

        <p className="text-xs sm:text-sm text-content-secondary leading-relaxed">
          The page you are looking for doesn't exist, but you are always safe to head back home.
        </p>

        <div className="pt-2">
          <Link to="/dashboard">
            <Button variant="primary" size="md" leftIcon={<Home className="w-4 h-4" />}>
              Return to Sanctuary
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};
