import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type StatCardVariant = 'default' | 'success' | 'warning' | 'danger' | 'critical' | 'high';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  isLoading?: boolean;
  variant?: StatCardVariant;
  className?: string;
}

const variantConfig: Record<StatCardVariant, { bg: string; text: string }> = {
  default: { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]' },
  success: { bg: 'bg-[#DCFCE7]', text: 'text-[#16A34A]' },
  warning: { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]' },
  danger: { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]' },
  critical: { bg: 'bg-[#FEE2E2]', text: 'text-[#DC2626]' },
  high: { bg: 'bg-[#FFF7ED]', text: 'text-[#EA580C]' },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  isLoading = false,
  variant = 'default',
  className = '',
}: StatCardProps): React.JSX.Element {
  const { bg, text } = variantConfig[variant];

  if (isLoading) {
    return (
      <div className={`card p-6 ${className}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Skeleton className="h-4 w-20 mb-3" />
            <Skeleton className="h-9 w-24 mb-2" />
            {description && <Skeleton className="h-3 w-32" />}
          </div>
          <Skeleton className="h-14 w-14 rounded-xl flex-shrink-0" />
        </div>
      </div>
    );
  }

  return (
    <div className={`card p-6 animate-fade-in ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="field-label">{title}</p>
          <p className="text-3xl font-bold text-[#0F172A] mt-2">{value}</p>
          {description && (
            <p className="text-xs text-[#64748B] mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${bg}`}>
          <Icon size={22} className={text} />
        </div>
      </div>
    </div>
  );
}
