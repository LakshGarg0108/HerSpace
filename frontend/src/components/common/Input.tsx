import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-content-secondary">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-3 rounded-2xl bg-surface-muted/60 border border-lavender-200/80 text-content-primary placeholder:text-content-light focus:bg-white focus:border-lavender-500 focus:ring-2 focus:ring-lavender-200 transition-all outline-none text-sm ${
          error ? 'border-rose-300 ring-rose-100' : ''
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-content-secondary">{hint}</p>}
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  hint,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-content-secondary">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={`w-full px-4 py-3.5 rounded-2xl bg-surface-muted/60 border border-lavender-200/80 text-content-primary placeholder:text-content-light focus:bg-white focus:border-lavender-500 focus:ring-2 focus:ring-lavender-200 transition-all outline-none text-sm resize-none ${
          error ? 'border-rose-300 ring-rose-100' : ''
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-content-secondary">{hint}</p>}
      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}
    </div>
  );
};
