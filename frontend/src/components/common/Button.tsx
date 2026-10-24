import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'sage' | 'rose' | 'cream';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-full disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-lavender-500 hover:bg-lavender-600 text-white shadow-soft hover:shadow-soft-md',
    secondary:
      'bg-lavender-100 hover:bg-lavender-200 text-lavender-900 border border-lavender-200/60',
    outline:
      'bg-transparent hover:bg-lavender-50 text-lavender-700 border border-lavender-300',
    ghost:
      'bg-transparent hover:bg-lavender-50 text-content-secondary hover:text-content-primary',
    sage:
      'bg-sage-200 hover:bg-sage-300 text-sage-700 border border-sage-300/60',
    rose:
      'bg-rose-100 hover:bg-rose-200 text-rose-500 border border-rose-200',
    cream:
      'bg-cream-200 hover:bg-cream-300 text-content-primary border border-cream-300/80',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
