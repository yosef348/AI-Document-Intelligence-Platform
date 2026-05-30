import { FileSearch } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeMap = {
  sm: { icon: 16, text: 'text-sm', container: 'gap-1.5' },
  md: { icon: 20, text: 'text-lg', container: 'gap-2' },
  lg: { icon: 28, text: 'text-2xl', container: 'gap-2.5' },
};

export function Logo({
  size = 'md',
  showText = true,
  className,
}: LogoProps): React.JSX.Element {
  const s = sizeMap[size];

  return (
    <div className={cn('flex items-center', s.container, className)}>
      <div className="flex items-center justify-center rounded-lg bg-primary p-1.5">
        <FileSearch size={s.icon} className="text-primary-foreground" />
      </div>
      {showText && (
        <span className={cn('font-semibold tracking-tight', s.text)}>
          Doc<span className="text-primary">Intel</span>
        </span>
      )}
    </div>
  );
}
