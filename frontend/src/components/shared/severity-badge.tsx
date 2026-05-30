import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const severityConfig: Record<
  Severity,
  { label: string; className: string }
> = {
  critical: {
    label: 'Critical',
    className: 'severity-critical border',
  },
  high: {
    label: 'High',
    className: 'severity-high border',
  },
  medium: {
    label: 'Medium',
    className: 'severity-medium border',
  },
  low: {
    label: 'Low',
    className: 'severity-low border',
  },
  info: {
    label: 'Info',
    className: 'severity-info border',
  },
};

export function SeverityBadge({
  severity,
  className,
}: SeverityBadgeProps): React.JSX.Element {
  const config = severityConfig[severity];

  return (
    <Badge
      variant="outline"
      className={cn(
        'font-medium capitalize',
        config.className,
        className,
      )}
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-current" />
      {config.label}
    </Badge>
  );
}
