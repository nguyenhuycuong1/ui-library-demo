import { Injectable, inject, signal, effect, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import type { ThemeMode, DensityMode, ThemeState } from './theme.types';
import { BRAND_STEPS, resolveScale, type BrandPreset, type BrandValue } from './brand-presets';

const STORAGE_THEME   = 'ui-theme';
const STORAGE_DENSITY = 'ui-density';
const STORAGE_BRAND   = 'ui-brand';

const VALID_BRANDS: BrandPreset[] = ['blue', 'indigo', 'violet', 'emerald', 'orange', 'rose'];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly doc        = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser  = isPlatformBrowser(this.platformId);

  readonly theme   = signal<ThemeMode>('light');
  readonly density = signal<DensityMode>('comfortable');
  readonly brand   = signal<BrandValue>('blue');

  constructor() {
    this.loadFromStorage();

    effect(() => {
      const t = this.theme();
      this.doc.documentElement.setAttribute('data-theme', t);
      if (this.isBrowser) localStorage.setItem(STORAGE_THEME, t);
    });

    effect(() => {
      const d = this.density();
      this.doc.documentElement.setAttribute('data-density', d);
      if (this.isBrowser) localStorage.setItem(STORAGE_DENSITY, d);
    });

    // Reads both brand() and theme() — re-runs when either changes so
    // dark-mode variants of brand-50 / brand-100 stay in sync.
    effect(() => {
      const v = this.brand();
      this.applyBrandToDOM(v, this.theme() === 'dark');
      if (this.isBrowser) localStorage.setItem(STORAGE_BRAND, JSON.stringify(v));
    });
  }

  setTheme(mode: ThemeMode): void   { this.theme.set(mode); }
  setDensity(mode: DensityMode): void { this.density.set(mode); }
  setBrand(value: BrandValue): void { this.brand.set(value); }

  toggleTheme(): void {
    this.theme.update(t => (t === 'light' ? 'dark' : 'light'));
  }

  cycleDensity(): void {
    const order: DensityMode[] = ['compact', 'comfortable', 'spacious'];
    this.density.update(d => order[(order.indexOf(d) + 1) % order.length]);
  }

  snapshot(): ThemeState {
    return { theme: this.theme(), density: this.density(), brand: this.brand() };
  }

  private applyBrandToDOM(preset: BrandValue, isDark: boolean): void {
    const scale = resolveScale(preset);
    const el    = this.doc.documentElement;

    BRAND_STEPS.forEach(step => {
      const value =
        isDark && step === '50'  ? scale.dark50  :
        isDark && step === '100' ? scale.dark100 :
        scale[step];
      el.style.setProperty(`--brand-${step}`, value);
    });

    el.style.setProperty('--shadow-focus', `0 0 0 3px ${scale.focusRing}`);
  }

  private loadFromStorage(): void {
    if (!this.isBrowser) return;

    const savedTheme   = localStorage.getItem(STORAGE_THEME)   as ThemeMode   | null;
    const savedDensity = localStorage.getItem(STORAGE_DENSITY) as DensityMode | null;
    const savedBrand   = localStorage.getItem(STORAGE_BRAND);

    if (savedTheme   && ['light', 'dark'].includes(savedTheme))                        this.theme.set(savedTheme);
    if (savedDensity && ['compact', 'comfortable', 'spacious'].includes(savedDensity)) this.density.set(savedDensity);
    if (savedBrand) {
      try {
        const parsed = JSON.parse(savedBrand) as BrandValue;
        // Preset string
        if (typeof parsed === 'string' && VALID_BRANDS.includes(parsed as BrandPreset)) {
          this.brand.set(parsed as BrandPreset);
        // Custom object — must have at least the '600' shade
        } else if (typeof parsed === 'object' && parsed !== null && '600' in parsed) {
          this.brand.set(parsed);
        }
      } catch { /* ignore malformed storage */ }
    }

    // Apply synchronously so the first render already has the correct brand tokens.
    this.applyBrandToDOM(this.brand(), this.theme() === 'dark');
  }
}
