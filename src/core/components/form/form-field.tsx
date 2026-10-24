import type { ReactNode } from 'react';
import { cn } from '@/core/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  children: ReactNode;
  error?: string;
  className?: string;
  hiddenLabel?: boolean;
}

export function FormField({
  id,
  label,
  required,
  children,
  error,
  className,
  hiddenLabel,
}: FormFieldProps) {
  return (
    <div className={cn('form-field min-w-0', className)}>
      <label
        htmlFor={id}
        className={cn('form-label', hiddenLabel && 'sr-only')}
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-required">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          className="mt-2 text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}
