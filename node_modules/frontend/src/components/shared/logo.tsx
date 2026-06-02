import React from 'react';
import { FileSearch } from 'lucide-react';

type LogoSize = 'sm' | 'md' | 'lg';

interface LogoProps {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
}

const sizeConfig: Record<LogoSize, { icon: number; text: string }> = {
  sm: { icon: 16, text: 'text-base' },
  md: { icon: 20, text: 'text-lg' },
  lg: { icon: 24, text: 'text-xl' },
};

export function Logo({
  size = 'md',
  showText = true,
  className = '',
}: LogoProps): React.JSX.Element {
  const config = sizeConfig[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-[#2563EB] rounded-lg p-1.5 flex-shrink-0">
        <FileSearch size={config.icon} className="text-white" />
      </div>
      {showText && (
        <span className={`font-bold ${config.text}`}>
          <span className="text-[#0F172A]">Doc</span>
          <span className="text-[#2563EB]">Intel</span>
        </span>
      )}
    </div>
  );
}
