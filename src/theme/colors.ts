import { Platform, ViewStyle } from 'react-native';

export const colors = {
  bg: '#080B16',
  bgDeep: '#05070F',
  bgElevated: '#0F1426',
  card: '#141A2E',
  cardAlt: '#1B2342',
  cardHover: '#222B4D',
  border: '#222B49',
  borderStrong: '#2E3A63',
  hairline: 'rgba(255,255,255,0.06)',
  primary: '#FFCC00', // Jalur Gemilang gold
  primaryBright: '#FFD83B',
  primaryDark: '#E0A800',
  accent: '#E63946',
  blue: '#3A86FF',
  indigo: '#5E60CE',
  green: '#2ECC71',
  orange: '#F39C12',
  purple: '#9B59B6',
  text: '#F6F8FF',
  textMuted: '#9AA4C4',
  textFaint: '#69739A',
  white: '#FFFFFF',
  black: '#000000',
  success: '#2ECC71',
  danger: '#E63946',
  warning: '#F39C12',
};

export type Gradient = readonly [string, string, ...string[]];

// Gradient stop arrays for expo-linear-gradient
export const gradients = {
  gold: ['#FFE9A8', '#FFCC00', '#E0A000'] as const,
  goldSoft: ['#FFD93B', '#FFB800'] as const,
  pro: ['#FFE27A', '#FFC400', '#FF9500'] as const,
  screen: ['#0E1430', '#080B16', '#05070F'] as const,
  hero: ['#23306A', '#161E3D', '#10152B'] as const,
  heroGlow: ['#3A2E7A', '#1C2348', '#10152B'] as const,
  card: ['#1A2240', '#141A2E'] as const,
  blue: ['#3A86FF', '#5E60CE'] as const,
  danger: ['#FF6B6B', '#E63946'] as const,
  green: ['#3DDC84', '#1FA463'] as const,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  xl: 26,
  pill: 999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOpacity' | 'shadowRadius' | 'shadowOffset' | 'elevation'
>;

const make = (color: string, opacity: number, radiusPx: number, y: number, elevation: number): ShadowStyle =>
  Platform.OS === 'android'
    ? { elevation, shadowColor: color }
    : { shadowColor: color, shadowOpacity: opacity, shadowRadius: radiusPx, shadowOffset: { width: 0, height: y }, elevation };

export const shadow = {
  soft: make('#000000', 0.3, 14, 8, 6),
  medium: make('#000000', 0.4, 24, 14, 12),
  glow: make(colors.primary, 0.45, 22, 10, 14),
  glowBlue: make(colors.blue, 0.4, 22, 10, 14),
};

export const fonts = {
  black: '900' as const,
  heavy: '800' as const,
  bold: '700' as const,
  semibold: '600' as const,
};
