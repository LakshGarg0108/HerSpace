import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'lavender' | 'sage' | 'rose' | 'cream' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'lavender',
  size = 'md',
  className = '',
  icon,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs px-3 py-1 font-medium',
  };

  const variantClasses = {
    lavender: 'bg-lavender-100 text-lavender-800 border border-lavender-200/60',
    sage: 'bg-sage-100 text-sage-700 border border-sage-200',
    rose: 'bg-rose-100 text-rose-500 border border-rose-200',
    cream: 'bg-cream-300 text-content-primary border border-cream-200',
    gray: 'bg-gray-100 text-content-secondary border border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
};
