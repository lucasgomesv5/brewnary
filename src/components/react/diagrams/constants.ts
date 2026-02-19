// Diagram design tokens
export const COLORS = {
  bg: '#0f172a',
  grid: '#1e293b',
  text: '#e2e8f0',
  textMuted: '#94a3b8',
  border: '#334155',

  // Category colors
  orange: '#f97316',
  blue: '#3b82f6',
  green: '#22c55e',
  red: '#ef4444',
  amber: '#f59e0b',
  purple: '#a855f7',
  cyan: '#06b6d4',
  pink: '#ec4899',
} as const;

export const BADGE_COLORS = {
  spof: { bg: '#991b1b', text: '#fca5a5', border: '#ef4444' },
  fix: { bg: '#14532d', text: '#86efac', border: '#22c55e' },
  load: { bg: '#78350f', text: '#fcd34d', border: '#f59e0b' },
  info: { bg: '#1e3a5f', text: '#93c5fd', border: '#3b82f6' },
} as const;

export const NODE_DEFAULTS = {
  width: 140,
  height: 60,
  rx: 8,
  fontSize: 12,
  iconSize: 16,
} as const;
