'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Mail } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AuthCard } from '@/components/auth/auth-card';

export function SignupForm(): React.JSX.Element {
  const router = useRouter();
  const supabase = createClient();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      setSuccess(true);
      setIsLoading(false);
    } catch (err) {
      setError((err as Error).message ?? 'Sign up failed');
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <AuthCard title="Check your inbox" subtitle="We've sent a confirmation email">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="rounded-md bg-primary/10 p-3 text-primary">
              <Mail size={20} />
            </div>
            <div>
              <p className="font-medium">Confirm your email</p>
              <p className="text-sm text-muted-foreground">
                We sent a sign-up confirmation to <span className="font-medium text-foreground">{email}</span>. Please follow the instructions in the email to finish creating your account.
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="ghost" onClick={() => router.push('/login')}>
              Back to sign in
            </Button>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Create your account" subtitle="Start analyzing documents with AI">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {error && (
          <Alert className="mb-2">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={fullName}
            onChange={(ev) => setFullName(ev.target.value)}
            placeholder="Jane Doe"
            required
            className="mt-1"
          />
        </div>

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
              placeholder="Create a password"
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

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(ev) => setConfirmPassword(ev.target.value)}
            placeholder="Repeat your password"
            required
            className="mt-1"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs">
            <a href="/login" className="text-primary hover:underline">
              Already have an account?
            </a>
          </div>
        </div>

        <div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Create account
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
