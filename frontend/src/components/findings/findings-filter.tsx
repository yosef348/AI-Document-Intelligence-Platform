'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface FindingsFilterProps {
  filters: { severity: string; status: string; search: string };
  onChange: (filters: { severity: string; status: string; search: string }) => void;
  totalCount: number;
}

export function FindingsFilter({ filters, onChange, totalCount }: FindingsFilterProps): React.JSX.Element {
  const hasActiveFilters = filters.severity !== 'all' || filters.status !== 'all' || filters.search !== '';

  const handleClearFilters = (): void => {
    onChange({ severity: 'all', status: 'all', search: '' });
  };

  return (
    <div className="flex flex-col gap-4 bg-card p-4 rounded-lg border border-border/50">
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search findings..."
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-9"
          />
        </div>

        {/* Severity filter */}
        <Select value={filters.severity} onValueChange={(val: string) => onChange({ ...filters, severity: val })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select value={filters.status} onValueChange={(val: string) => onChange({ ...filters, status: val })}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="dismissed">Dismissed</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={handleClearFilters}>
            <X size={16} className="mr-1" />
            Clear
          </Button>
        )}

        {/* Count */}
        <div className="text-sm text-muted-foreground ml-2 whitespace-nowrap">
          {totalCount} finding{totalCount !== 1 ? 's' : ''}
        </div>
      </div>
    </div>
  );
}



