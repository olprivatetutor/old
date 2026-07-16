import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string | undefined;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1">
      <input
        ref={ref}
        className={cn(
          'w-full rounded-lg border px-3 py-2 text-sm',
          'bg-surface text-foreground placeholder-muted-foreground/70',
          'border-border focus:border-primary focus:ring-primary/20 focus:ring-2 focus:outline-none',
          'transition-colors duration-150',
          'disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed',
          error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
          className,
        )}
        aria-invalid={!!error}
        {...props}
      />
      {error && (
        <p className="text-destructive text-xs" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
Input.displayName = 'Input';

export { Input };
