import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'lavender' | 'cream' | 'sage' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-3xl transition-all duration-200 border';

  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const variantStyles = {
    default: 'bg-white border-lavender-100/70 shadow-soft',
    lavender: 'bg-surface-lavender border-lavender-200/60 shadow-soft',
    cream: 'bg-surface-cream border-amber-100/60 shadow-soft',
    sage: 'bg-surface-sage border-sage-200/60 shadow-soft',
    flat: 'bg-white/60 border-lavender-100',
  };

  return (
    <div
      className={`${baseStyles} ${paddingStyles[padding]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
