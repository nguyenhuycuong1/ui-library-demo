import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
} from '@angular/core';
import type { BadgeVariant } from './badge.types';

/**
 * Inline status badge / tag.
 * The badge IS the host element — no inner wrapper, minimal DOM.
 *
 * Usage:
 *   <ui-badge variant="success">Active</ui-badge>
 *   <ui-badge variant="danger" [dot]="true">Failed</ui-badge>
 *   <ui-badge variant="neutral">Draft</ui-badge>
 */
@Component({
  selector: 'ui-badge',
  standalone: true,
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'badge' },
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'neutral';
  @Input() dot = false;

  @HostBinding('class')
  get hostClass(): string {
    const classes = [`badge--${this.variant}`];
    if (this.dot) classes.push('badge--dot');
    return classes.join(' ');
  }

  @HostBinding('attr.role') readonly role = 'status';
}
