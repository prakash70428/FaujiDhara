type ClassValue = string | false | null | undefined;

/**
 * Joins className strings and skips falsy values, so conditions stay readable:
 *   cn('px-4', isActive && 'bg-primary-600', disabled && 'opacity-50')
 *
 * Note: it does not resolve conflicts ('px-2' + 'px-4' keeps both).
 * Put the override last and avoid passing two values for the same property.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}
