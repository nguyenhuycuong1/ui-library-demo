import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-grid-demo',
  standalone: true,
  imports: [],
  templateUrl: './grid-demo.component.html',
  styles: [`
    .col-box {
      background: var(--brand-100);
      color: var(--brand-700);
      padding: var(--sp-3) var(--sp-2);
      border-radius: var(--r-sm);
      font-size: 11px;
      font-weight: var(--fw-semibold);
      text-align: center;
      font-family: var(--font-mono);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .col-box--muted {
      background: var(--bg-subtle);
      color: var(--text-tertiary);
    }
    .demo-card {
      background: var(--bg-elevated);
      border: 1px solid var(--border-default);
      border-radius: var(--r-lg);
      padding: var(--sp-7);
    }
    .demo-card__label {
      font-weight: var(--fw-semibold);
      font-size: var(--fs-md);
      margin-bottom: var(--sp-2);
    }
    .demo-card__sub {
      font-size: var(--fs-xs);
      color: var(--text-tertiary);
      font-family: var(--font-mono);
    }
    .demo-row { width: 100%; }
    .demo-row + .demo-row { margin-top: var(--sp-3); }
    .gap-label {
      font-size: var(--fs-xs);
      font-family: var(--font-mono);
      color: var(--text-secondary);
      margin: var(--sp-4) 0 var(--sp-2);
    }
    .gap-label:first-child { margin-top: 0; }
    .align-demo {
      min-height: 80px;
      background: var(--bg-subtle);
      border-radius: var(--r-md);
      border: 1px dashed var(--border-default);
    }
    .api-table { width: 100%; border-collapse: collapse; }
    .api-table th, .api-table td {
      padding: var(--sp-3) var(--sp-5);
      text-align: left;
      border-bottom: 1px solid var(--border-subtle);
      font-size: var(--fs-sm);
    }
    .api-table th {
      font-weight: var(--fw-semibold);
      color: var(--text-secondary);
      background: var(--bg-subtle);
      font-size: var(--fs-xs);
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .api-table code { font-family: var(--font-mono); font-size: 11px; color: var(--text-brand); }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridDemoComponent {
  protected readonly halfCols = [1, 2, 3, 4, 5, 6];

  protected readonly cards = [
    { label: 'Card A' }, { label: 'Card B' }, { label: 'Card C' },
    { label: 'Card D' }, { label: 'Card E' }, { label: 'Card F' },
  ];

  protected readonly gutters: { cls: string; size: string }[] = [
    { cls: 'g-0', size: '0px'  },
    { cls: 'g-1', size: '4px'  },
    { cls: 'g-2', size: '8px'  },
    { cls: 'g-3', size: '16px (default)' },
    { cls: 'g-4', size: '24px' },
    { cls: 'g-5', size: '32px' },
  ];

  protected readonly alignments = ['start', 'center', 'end'] as const;

  protected readonly tokenRows = [
    { token: '--grid-columns',  value: '12',              desc: 'Number of columns' },
    { token: '--grid-gutter',   value: 'var(--sp-6) → 16px', desc: 'Space between columns; override with .g-*' },
    { token: '--container-sm',  value: '540px',           desc: 'Container max-width at ≥ 576px' },
    { token: '--container-md',  value: '720px',           desc: 'Container max-width at ≥ 768px' },
    { token: '--container-lg',  value: '960px',           desc: 'Container max-width at ≥ 992px' },
    { token: '--container-xl',  value: '1140px',          desc: 'Container max-width at ≥ 1200px' },
    { token: '--container-2xl', value: '1320px',          desc: 'Container max-width at ≥ 1400px' },
  ];
}
