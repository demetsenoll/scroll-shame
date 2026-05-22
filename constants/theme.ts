export const Colors = {
  background: '#0a0a0a',
  surface: '#111111',
  surfaceElevated: '#1a1a1a',
  border: '#2a2a2a',
  borderLight: '#333333',

  primary: '#FF3B3B',
  primaryDark: '#CC1C1C',
  primaryGlow: 'rgba(255,59,59,0.25)',
  orange: '#FF6B1A',
  orangeGlow: 'rgba(255,107,26,0.25)',

  recovery: '#22C55E',
  recoveryDark: '#16A34A',
  recoveryGlow: 'rgba(34,197,94,0.2)',
  recoveryMuted: '#166534',

  text: '#FFFFFF',
  textSecondary: '#A3A3A3',
  textMuted: '#525252',
  textDim: '#737373',

  gold: '#F59E0B',
  purple: '#8B5CF6',
  blue: '#3B82F6',

  gradientShame: ['#FF3B3B', '#FF6B1A'] as const,
  gradientDark: ['#1a0a0a', '#0a0a0a'] as const,
  gradientCard: ['#1f1f1f', '#141414'] as const,
  gradientRecovery: ['#022c22', '#0a0a0a'] as const,
  gradientHero: ['#2d0a0a', '#0a0a0a'] as const,
};

export const Typography = {
  hero: { fontSize: 48, fontWeight: '800' as const, letterSpacing: -1.5 },
  h1: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -1 },
  h2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.5 },
  h3: { fontSize: 20, fontWeight: '700' as const },
  h4: { fontSize: 17, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  caption: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5 },
  label: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 1 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
