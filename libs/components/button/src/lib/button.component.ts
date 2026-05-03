import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';
import { NgClass } from '@angular/common';
import type { ButtonSize, ButtonType, ButtonVariant } from './button.types';

/**
 * Enterprise button component.
 *
 * Usage:
 *   <ui-button variant="primary" size="md">Save</ui-button>
 *   <ui-button variant="default" [loading]="saving">
 *     <ui-icon name="download" prefix />  Download
 *   </ui-button>
 *
 * Slots:
 *   default  — label text / content
 *   [prefix] — icon/content placed before the label
 *   [suffix] — icon/content placed after the label
 */
@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [NgClass],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'default';
  @Input() size: ButtonSize       = 'md';
  @Input() type: ButtonType       = 'button';
  @Input() disabled               = false;
  @Input() loading                = false;
  @Input() block                  = false;
  @Input() iconOnly               = false;

  @Output() readonly clicked = new EventEmitter<MouseEvent>();

  @HostBinding('style.display')
  get hostDisplay(): string {
    return this.block ? 'flex' : 'inline-flex';
  }

  @HostBinding('style.width')
  get hostWidth(): string {
    return this.block ? '100%' : '';
  }

  get buttonClasses(): Record<string, boolean> {
    return {
      btn: true,
      [`btn--${this.variant}`]: true,
      'btn--sm':      this.size === 'sm',
      'btn--lg':      this.size === 'lg',
      'btn--icon':    this.iconOnly,
      'btn--block':   this.block,
      'btn--loading': this.loading,
    };
  }

  handleClick(event: MouseEvent): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.clicked.emit(event);
  }
}
