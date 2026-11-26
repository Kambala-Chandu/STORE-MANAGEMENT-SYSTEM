/**
 * Minimal class-name joiner. No extra dependencies.
 * Usage: cn('base', condition && 'active', props.className)
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

export default cn;
