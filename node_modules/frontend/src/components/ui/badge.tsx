import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'secondary';
}

export function Badge({ className, children, variant = 'default', ...props }: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-2 py-0.5 text-sm font-medium';
  const variants: Record<string, string> = {
    default: 'bg-gray-100 text-gray-900',
    outline: 'bg-transparent',
    secondary: 'bg-gray-50 text-gray-700',
  };

  return (
    <span {...props} className={cn(base, variants[variant] ?? '', className)}>
      {children}
    </span>
  );
}

