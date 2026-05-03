export type ThemeMode = 'light' | 'dark';
export type DensityMode = 'compact' | 'comfortable' | 'spacious';

export type { BrandPreset, BrandScale, CustomBrandInput, BrandValue } from './brand-presets';

export interface ThemeState {
  theme: ThemeMode;
  density: DensityMode;
  brand: import('./brand-presets').BrandValue;
}
