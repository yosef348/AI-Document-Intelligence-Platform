'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AuthCard } from '@/components/auth/auth-card';

export function LoginForm(): React.JSX.Element {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setIsLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError((err as Error).message ?? 'Sign in failed');
      setIsLoading(false);
    }
  }

  return (
    <AuthCard title="Welcome back" subtitle="Sign in to your DocIntel account">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <Alert className="mb-2">
            <AlertTitle>Authentication error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            placeholder="you@company.com"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground pointer-events-none opacity-70">Forgot password?</div>
          <div className="text-xs">
            <a href="/signup" className="text-primary hover:underline">
              Don&apos;t have an account?
            </a>
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Sign in
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
