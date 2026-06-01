"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useAuthStore } from '@/store/auth.store';
import type { Organization } from '@/types';

export function CreateOrgPrompt(): React.JSX.Element {
  const router = useRouter();
  const { session } = useAuth();
  const setOrganization = useAuthStore((s) => s.setOrganization);

  const [name, setName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) {
      setSlug('');
      return;
    }

    const generated = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    // only update if differs to avoid cascading renders
    setSlug((prev) => (prev === generated ? prev : generated));
  }, [name]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (!session) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ name, slug }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to create organization');
      }

      const org: Organization = await res.json();
      setOrganization(org);
      router.refresh();
    } catch (err) {
      setError((err as Error).message ?? 'Failed to create organization');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-card p-6 rounded-lg">
        <div className="flex items-center space-x-3 mb-4">
          <div className="rounded-md bg-primary/10 p-2 text-primary">
            <Building size={20} />
          </div>
          <div>
            <h3 className="text-lg font-medium">Set up your organization</h3>
            <p className="text-sm text-muted-foreground">Create an organization to start analyzing documents</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="org-name">Organization name</Label>
            <Input id="org-name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1" />
          </div>

          <div>
            <Label htmlFor="org-slug">Slug</Label>
            <Input id="org-slug" value={slug} onChange={(e) => setSlug(e.target.value)} required className="mt-1" />
          </div>

          {error && <div className="text-sm text-destructive">{error}</div>}

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>{isLoading ? 'Creating…' : 'Create organization'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

