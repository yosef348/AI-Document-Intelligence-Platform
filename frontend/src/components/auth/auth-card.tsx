import React from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  subtitle,
  children,
}: AuthCardProps): React.JSX.Element {
  return (
    <div className="w-full rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm p-8 space-y-6 shadow-2xl shadow-black/20 animate-fade-in">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Form content */}
      {children}
    </div>
  );
}
