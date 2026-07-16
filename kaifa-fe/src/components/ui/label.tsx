import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, children, required, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('text-foreground block text-sm font-medium', className)}
        {...props}
      >
        {children}
        {required && (
          <span className="text-destructive ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
    );
  },
);
Label.displayName = 'Label';

export { Label };
