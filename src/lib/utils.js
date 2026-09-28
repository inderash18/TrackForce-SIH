import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines multiple class names or conditional class objects and merges Tailwind CSS classes cleanly.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
