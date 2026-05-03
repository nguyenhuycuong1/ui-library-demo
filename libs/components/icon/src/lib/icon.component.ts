import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import type { IconName, IconSize, IconVariant } from './icon.types';
import { ICON_REGISTRY } from './icon-registry';

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  @Input() name!: IconName;
  @Input() size: IconSize = 'md';
  @Input() variant: IconVariant = 'default';
  @Input() label?: string;

  @HostBinding('class')
  get hostClasses(): string {
    return [
      'icon',
      `icon--${this.size}`,
      `icon--${this.variant}`,
    ].join(' ');
  }

  @HostBinding('attr.aria-hidden')
  get ariaHidden(): string | null {
    return this.label ? null : 'true';
  }

  @HostBinding('attr.aria-label')
  get ariaLabel(): string | null {
    return this.label ?? null;
  }

  @HostBinding('attr.role')
  get role(): string | null {
    return this.label ? 'img' : null;
  }

  getIconSizeMapping(size: IconSize): number {
    switch (size) {
      case 'xs': return 12;
      case 'sm': return 16;
      case 'md': return 24;
      case 'lg': return 30;
      case 'xl': return 32;
    }
  }

  constructor(private readonly sanitizer: DomSanitizer) {}

  get svgIcon(): SafeHtml {
    const inner = ICON_REGISTRY[this.name] ?? '';
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ` +
      `stroke="currentColor" width="${this.getIconSizeMapping(this.size)}" height="${this.getIconSizeMapping(this.size)}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">` +
      `${inner}</svg>`
    );
  }
}
