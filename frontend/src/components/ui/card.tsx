import React from 'react';
import { cn } from '@/lib/utils';

export function Card({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div {...props} className={cn('rounded-lg border bg-card p-0', className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div {...props} className={cn('p-4', className)}>
      {children}
    </div>
  );
}

