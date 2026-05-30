"use client";

import { useAuthStore } from '@/store/auth.store';

export function useOrganization() {
  const organization = useAuthStore((s) => s.organization);
  const organizationId = organization?.id ?? '';

  return {
    organization,
    organizationId,
    hasOrganization: Boolean(organization),
  };
}

