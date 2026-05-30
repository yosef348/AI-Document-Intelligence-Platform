import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps): React.JSX.Element {
  return (
    <div className="rounded-lg border border-border/60 bg-card/80 p-6 shadow-sm">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      <div className="mt-2">{children}</div>
    </div>
  );
}
