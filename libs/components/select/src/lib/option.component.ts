import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  inject,
  signal,
} from '@angular/core';
import { SELECT_CONTEXT } from './select.types';

@Component({
  selector: 'ui-option',
  templateUrl: './option.component.html',
  styleUrl: './option.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  host: { class: 'select__option' },
})
export class OptionComponent {
  private readonly selectCtx= inject(SELECT_CONTEXT, { optional: true });
  private readonly el     = inject(ElementRef<HTMLElement>);

  @Input() value    = '';
  @Input() disabled = false;

  private readonly _hidden = signal(false);

  @HostBinding('class.is-hidden')
  get isHidden(): boolean { return this._hidden(); }

  setHidden(v: boolean): void { this._hidden.set(v); }

  @HostBinding('class.is-selected')
  get isSelected(): boolean {
    return this.selectCtx?.isSelected(this.value) ?? false;
  }

  @HostBinding('class.is-active')
  get isActive(): boolean {
    return this.selectCtx?.isActive(this.value) ?? false;
  }

  @HostBinding('class.is-disabled')
  get isDisabled(): boolean { return this.disabled; }

  getLabel(): string {
    return this.el.nativeElement.textContent?.trim() ?? '';
  }

  scrollIntoView(): void {
    this.el.nativeElement.scrollIntoView({ block: 'nearest' });
  }

  @HostListener('click')
  handleClick(): void {
    if (this.disabled || !this.selectCtx) return;
    this.selectCtx.selectOption(this.value, this.getLabel());
  }
}
