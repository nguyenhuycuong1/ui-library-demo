import { TitleCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { BRAND_SCALES, ThemeService, type BrandValue, type CustomBrandInput } from '@ui/theme';
import { ButtonComponent } from '@ui/button';
import { IconComponent } from '@ui/icon';
// Example custom brand — an enterprise app defines this once and calls
// inject(ThemeService).setBrand(fuchsia) during bootstrap or app init.
const fuchsia: CustomBrandInput = {
  50:  '#fdf4ff',
  100: '#fae8ff',
  200: '#f5d0fe',
  300: '#f0abfc',
  400: '#e879f9',
  500: '#d946ef',
  600: '#c026d3',
  700: '#a21caf',
  800: '#86198f',
  900: '#701a75',
  // focusRing / dark50 / dark100 omitted — auto-derived from 500 / 600
};

type BrandSwatch = { id: string; value: BrandValue; color: string; label: string };

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TitleCasePipe, ButtonComponent, IconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly theme = inject(ThemeService);

  protected readonly activeSwatch = signal<string>('blue');

  protected readonly brandSwatches: BrandSwatch[] = [
    { id: 'blue',    value: 'blue',    color: BRAND_SCALES.blue['600'],    label: 'Blue'    },
    { id: 'indigo',  value: 'indigo',  color: BRAND_SCALES.indigo['600'],  label: 'Indigo'  },
    { id: 'violet',  value: 'violet',  color: BRAND_SCALES.violet['600'],  label: 'Violet'  },
    { id: 'emerald', value: 'emerald', color: BRAND_SCALES.emerald['600'], label: 'Emerald' },
    { id: 'orange',  value: 'orange',  color: BRAND_SCALES.orange['600'],  label: 'Orange'  },
    { id: 'rose',    value: 'rose',    color: BRAND_SCALES.rose['600'],    label: 'Rose'    },
    // ↓ Custom object — same setBrand() API, just pass the scale directly
    { id: 'fuchsia', value: fuchsia,   color: fuchsia['600'],              label: 'Custom'  },
  ];

  protected switchBrand(swatch: BrandSwatch): void {
    this.theme.setBrand(swatch.value);
    this.activeSwatch.set(swatch.id);
  }

  protected readonly nav = [
    { group: 'Getting started', items: [
      { label: 'Foundations', route: '/foundations' },
    ]},
    { group: 'General', items: [
      { label: 'Icons',        route: '/icons' },
    ]},
    { group: 'Layout', items: [
      { label: 'Grid',        route: '/grid' },
    ]},
    { group: 'Components', items: [
      { label: 'Controls',    route: '/components' },
      { label: 'Pagination',  route: '/pagination' },
      { label: 'Tabs',        route: '/tabs' },
    ]},
    { group: 'Services', items: [
      { label: 'Overlay',    route: '/overlay' },
    ]},
  ];
}
