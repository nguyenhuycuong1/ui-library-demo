export type BrandPreset = 'blue' | 'indigo' | 'violet' | 'emerald' | 'orange' | 'rose';

/** Full resolved scale used internally. */
export interface BrandScale {
  readonly 50:  string;
  readonly 100: string;
  readonly 200: string;
  readonly 300: string;
  readonly 400: string;
  readonly 500: string;
  readonly 600: string;
  readonly 700: string;
  readonly 800: string;
  readonly 900: string;
  readonly focusRing: string;
  readonly dark50:  string;
  readonly dark100: string;
}

/**
 * Custom brand scale provided by the consuming app.
 * All 10 shades are required. focusRing / dark50 / dark100 are optional
 * and auto-derived from the 500 / 600 hex values when omitted.
 */
export interface CustomBrandInput {
  50: string; 100: string; 200: string; 300: string; 400: string;
  500: string; 600: string; 700: string; 800: string; 900: string;
  focusRing?: string;
  dark50?:    string;
  dark100?:   string;
}

/** Accepted by ThemeService.setBrand() */
export type BrandValue = BrandPreset | CustomBrandInput;

function hexToRgb(hex: string): string {
  const h = hex.replace('#', '');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)).join(',');
}

/** Resolves a BrandValue to a full BrandScale (fills in optional fields). */
export function resolveScale(value: BrandValue): BrandScale {
  if (typeof value === 'string') return BRAND_SCALES[value];
  const rgb500 = hexToRgb(value['500']);
  const rgb600 = hexToRgb(value['600']);
  return {
    ...value,
    focusRing: value.focusRing ?? `rgba(${rgb600},0.22)`,
    dark50:    value.dark50    ?? `rgba(${rgb500},0.10)`,
    dark100:   value.dark100   ?? `rgba(${rgb500},0.18)`,
  };
}

export const BRAND_SCALES: Record<BrandPreset, BrandScale> = {
  blue: {
    50: '#EFF6FF', 100: '#DBEAFE', 200: '#BFDBFE', 300: '#93C5FD', 400: '#60A5FA',
    500: '#3B82F6', 600: '#2563EB', 700: '#1D4ED8', 800: '#1E40AF', 900: '#1E3A8A',
    focusRing: 'rgba(37,99,235,0.22)',
    dark50:  'rgba(59,130,246,0.10)',
    dark100: 'rgba(59,130,246,0.18)',
  },
  indigo: {
    50: '#EEF2FF', 100: '#E0E7FF', 200: '#C7D2FE', 300: '#A5B4FC', 400: '#818CF8',
    500: '#6366F1', 600: '#4F46E5', 700: '#4338CA', 800: '#3730A3', 900: '#312E81',
    focusRing: 'rgba(79,70,229,0.22)',
    dark50:  'rgba(99,102,241,0.10)',
    dark100: 'rgba(99,102,241,0.18)',
  },
  violet: {
    50: '#F5F3FF', 100: '#EDE9FE', 200: '#DDD6FE', 300: '#C4B5FD', 400: '#A78BFA',
    500: '#8B5CF6', 600: '#7C3AED', 700: '#6D28D9', 800: '#5B21B6', 900: '#4C1D95',
    focusRing: 'rgba(124,58,237,0.22)',
    dark50:  'rgba(139,92,246,0.10)',
    dark100: 'rgba(139,92,246,0.18)',
  },
  emerald: {
    50: '#ECFDF5', 100: '#D1FAE5', 200: '#A7F3D0', 300: '#6EE7B7', 400: '#34D399',
    500: '#10B981', 600: '#059669', 700: '#047857', 800: '#065F46', 900: '#064E3B',
    focusRing: 'rgba(5,150,105,0.22)',
    dark50:  'rgba(16,185,129,0.10)',
    dark100: 'rgba(16,185,129,0.18)',
  },
  orange: {
    50: '#FFF7ED', 100: '#FFEDD5', 200: '#FED7AA', 300: '#FDBA74', 400: '#FB923C',
    500: '#F97316', 600: '#EA580C', 700: '#C2410C', 800: '#9A3412', 900: '#7C2D12',
    focusRing: 'rgba(234,88,12,0.22)',
    dark50:  'rgba(249,115,22,0.10)',
    dark100: 'rgba(249,115,22,0.18)',
  },
  rose: {
    50: '#FFF1F2', 100: '#FFE4E6', 200: '#FECDD3', 300: '#FDA4AF', 400: '#FB7185',
    500: '#F43F5E', 600: '#E11D48', 700: '#BE123C', 800: '#9F1239', 900: '#881337',
    focusRing: 'rgba(225,29,72,0.22)',
    dark50:  'rgba(244,63,94,0.10)',
    dark100: 'rgba(244,63,94,0.18)',
  },
};

export const BRAND_STEPS = ['50','100','200','300','400','500','600','700','800','900'] as const;
