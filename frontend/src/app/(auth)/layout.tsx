import React from 'react';
import { Logo } from '@/components/shared/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-sidebar-gradient flex-col justify-between p-12 border-r border-border/50">
        <Logo size="lg" />

        <div className="space-y-6">
          {/* Quote */}
          <blockquote className="space-y-2">
            <p className="text-lg text-muted-foreground leading-relaxed">
              &quot;AI-powered document intelligence that detects risks
              before they become problems.&quot;
            </p>
          </blockquote>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">98%</p>
              <p className="text-xs text-muted-foreground">Detection accuracy</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">10x</p>
              <p className="text-xs text-muted-foreground">Faster review</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl font-bold text-primary">24/7</p>
              <p className="text-xs text-muted-foreground">Automated analysis</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          © 2026 DocIntel. All rights reserved.
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo shown only on mobile */}
          <div className="lg:hidden mb-8">
            <Logo size="lg" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
