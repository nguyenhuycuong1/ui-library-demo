import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BadgeComponent } from '@ui/badge';

@Component({
  selector: 'app-foundations',
  standalone: true,
  imports: [BadgeComponent],
  templateUrl: './foundations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FoundationsComponent {
  protected readonly brandScale = [
    { step: '50',  hex: '#EFF6FF' },
    { step: '100', hex: '#DBEAFE' },
    { step: '200', hex: '#BFDBFE' },
    { step: '300', hex: '#93C5FD' },
    { step: '400', hex: '#60A5FA' },
    { step: '500', hex: '#3B82F6' },
    { step: '600', hex: '#2563EB' },
    { step: '700', hex: '#1D4ED8' },
    { step: '800', hex: '#1E40AF' },
    { step: '900', hex: '#1E3A8A' },
  ];

  protected readonly semanticTokens = [
    { name: '--success-600', label: 'Success',  bg: '#059669' },
    { name: '--warning-600', label: 'Warning',  bg: '#D97706' },
    { name: '--danger-600',  label: 'Danger',   bg: '#DC2626' },
    { name: '--info-600',    label: 'Info',     bg: '#2563EB' },
  ];

  protected readonly typeScale = [
    { token: '--fs-xs',   label: 'xs  / 11px', sample: 'The quick brown fox' },
    { token: '--fs-sm',   label: 'sm  / 12px', sample: 'The quick brown fox' },
    { token: '--fs-base', label: 'base/ 13px', sample: 'The quick brown fox' },
    { token: '--fs-md',   label: 'md  / 14px', sample: 'The quick brown fox' },
    { token: '--fs-lg',   label: 'lg  / 16px', sample: 'The quick brown fox' },
    { token: '--fs-xl',   label: 'xl  / 18px', sample: 'The quick brown fox' },
    { token: '--fs-2xl',  label: '2xl / 20px', sample: 'The quick brown fox' },
    { token: '--fs-3xl',  label: '3xl / 24px', sample: 'Heading' },
  ];
}
