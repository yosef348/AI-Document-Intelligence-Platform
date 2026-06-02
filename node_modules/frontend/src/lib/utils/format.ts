/**
 * Format bytes to human-readable file size
 * @param bytes - Number of bytes
 * @returns Formatted string (e.g., "1.2 MB")
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes: string[] = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

/**
 * Alias for formatBytes
 * @param bytes - Number of bytes
 * @returns Formatted string
 */
export function formatFileSize(bytes: number): string {
  return formatBytes(bytes);
}

/**
 * Format date string to relative time
 * @param dateString - ISO date string
 * @returns Relative time string (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return formatDate(dateString);
  } catch {
    return dateString;
  }
}

/**
 * Format date to readable format
 * @param dateString - ISO date string
 * @returns Formatted date (e.g., "May 29, 2026")
 */
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

/**
 * Format confidence score to percentage
 * @param confidence - Confidence value as string or number (0-1 or 0-100)
 * @returns Percentage string (e.g., "94%")
 */
export function formatConfidence(confidence: string | number): string {
  try {
    const num = typeof confidence === 'string' ? parseFloat(confidence) : confidence;

    // If value is between 0-1, multiply by 100
    if (num >= 0 && num <= 1) {
      return `${Math.round(num * 100)}%`;
    }

    // If value is already 0-100
    if (num > 1 && num <= 100) {
      return `${Math.round(num)}%`;
    }

    return `${Math.round(num)}%`;
  } catch {
    return `${confidence}%`;
  }
}

/**
 * Format snake_case string to Title Case
 * @param type - Snake case string (e.g., "short_termination_clause")
 * @returns Title case string (e.g., "Short Termination Clause")
 */
export function formatFindingType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
