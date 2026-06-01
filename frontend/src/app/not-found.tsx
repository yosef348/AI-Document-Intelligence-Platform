import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/shared/logo';
import { Button } from '@/components/ui/button';

export default function NotFound(): React.JSX.Element {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-6">
        <Logo size="lg" />
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight">404</h1>
          <p className="text-xl text-muted-foreground">Page not found</p>
          <p className="text-sm text-muted-foreground max-w-md">
            The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
          </p>
        </div>
        <div>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

