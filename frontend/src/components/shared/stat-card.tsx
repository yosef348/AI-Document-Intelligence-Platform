import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  trend?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
  variant?: 'default' | 'critical' | 'warning' | 'success';
  className?: string;
}

const variantStyles = {
  default: 'border-border',
  critical: 'border-red-500/30 bg-red-500/5',
  warning: 'border-orange-500/30 bg-orange-500/5',
  success: 'border-emerald-500/30 bg-emerald-500/5',
};

const iconVariantStyles = {
  default: 'text-primary bg-primary/10',
  critical: 'text-red-500 bg-red-500/10',
  warning: 'text-orange-500 bg-orange-500/10',
  success: 'text-emerald-500 bg-emerald-500/10',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  isLoading = false,
  variant = 'default',
  className,
}: StatCardProps): React.JSX.Element {
  if (isLoading) {
    return (
      <Card className={cn('border', variantStyles[variant], className)}>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-10 w-10 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('border transition-colors hover:border-primary/30', variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className={cn('rounded-lg p-2.5', iconVariantStyles[variant])}>
            <Icon size={20} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
