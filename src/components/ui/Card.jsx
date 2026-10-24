import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

const Card = forwardRef(({ className, children, hover = false, padding = 'p-6', ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'card',
        hover && 'card-hover',
        padding,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

const CardHeader = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('mb-4', className)} {...props}>
    {children}
  </div>
));

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-xl font-semibold text-gray-900 dark:text-gray-100', className)} {...props}>
    {children}
  </h3>
));

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef(({ className, children, ...props }, ref) => (
  <p ref={ref} className={cn('mt-1 text-sm text-gray-500 dark:text-gray-400', className)} {...props}>
    {children}
  </p>
));

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props}>
    {children}
  </div>
));

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2', className)} {...props}>
    {children}
  </div>
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };