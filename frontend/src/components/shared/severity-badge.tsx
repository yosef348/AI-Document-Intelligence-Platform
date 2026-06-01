import React from 'react';

type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

interface SeverityBadgeProps {
  severity: Severity;
  className?: string;
}

const severityLabels: Record<Severity, string> = {
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  info: 'Info',
};

const severityClasses: Record<Severity, string> = {
  critical: 'severity-critical',
  high: 'severity-high',
  medium: 'severity-medium',
  low: 'severity-low',
  info: 'severity-info',
};

export function SeverityBadge({
  severity,
  className = '',
}: SeverityBadgeProps): React.JSX.Element {
  const label = severityLabels[severity];
  const badgeClass = severityClasses[severity];

  return (
    <span className={`badge ${badgeClass} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
      {label}
    </span>
  );
}
