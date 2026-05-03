import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  forwardRef,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';
import { BaseFormControl, firstEnabledIndex, lastEnabledIndex, navigateListIndex } from '@ui/core';
import { SELECT_CONTEXT, SelectContext, SelectVariant } from './select.types';
import { OptionComponent } from './option.component';
import { IconComponent } from '@ui/icon';

@Component({
  selector: 'ui-select',
  standalone: true,
  imports: [NgClass, IconComponent],
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
    {
      provide: SELECT_CONTEXT,
      useExisting: forwardRef(() => SelectComponent),
    },
  ],
})
export class SelectComponent extends BaseFormControl<string>
    implements SelectContext, AfterContentInit {

  @ContentChildren(OptionComponent) private options!: QueryList<OptionComponent>;

  @Input() variant: SelectVariant = 'default';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() error = '';
  @Input() allowClear = false;

  protected readonly open        = signal(false);
  protected readonly _label      = signal('');
  protected readonly hovered     = signal(false);
  private   readonly activeIndex = signal(0);

  protected get showClearBtn(): boolean {
    return this.allowClear && !!this._value() && this.hovered() && !this.disabled && !this.readonly;
  }

  get fieldClasses(): Record<string, boolean> {
    return {
      field:      true,
      'is-error': !!this.error,
    };
  }

  // What to show in the trigger: label (click-selected) → raw value (programmatic) → empty
  protected get displayLabel(): string {
    return this._label() || this._value();
  }

  protected override emptyValue(): string { return ''; }

  ngAfterContentInit(): void {
    // Sync label when value was set programmatically before options were available
    if (this._value() && !this._label()) {
      this.syncLabel(this._value());
    }
  }

  override writeValue(val: string): void {
    super.writeValue(val);
    this._label.set('');
    // Sync label if options are already rendered (e.g. reactive form patch)
    this.syncLabel(val);
  }

  // ---- SelectContext ----

  selectOption(value: string, label: string): void {
    this.emitChange(value);
    this._label.set(label);
    this.open.set(false);
    this.activeIndex.set(-1);
  }

  isSelected(value: string): boolean {
    return this._value() === value;
  }

  isActive(value: string): boolean {
    const idx = this.activeIndex();
    if (idx < 0) return false;
    return this.options?.toArray()[idx]?.value === value;
  }

  // ---- Event handlers ----

  clearValue(event: MouseEvent): void {
    event.stopPropagation();
    this.emitChange('');
    this._label.set('');
    this.open.set(false);
    this.activeIndex.set(-1);
  }

  toggleOpen(): void {
    if (this.disabled || this.readonly) return;
    if (this.open()) {
      this.open.set(false);
      this.activeIndex.set(-1);
    } else {
      this.open.set(true);
    }
  }

  handleBlur(): void {
    this.open.set(false);
    this.activeIndex.set(-1);
    this.emitTouched();
  }

  handleKeydown(event: KeyboardEvent): void {
    const { key } = event;

    if (key === 'Escape') {
      this.open.set(false);
      this.activeIndex.set(-1);
      return;
    }

    if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault();
      if (!this.open()) {
        this.openWithFocus();
      } else {
        this.moveActive(key === 'ArrowDown' ? 1 : -1);
      }
      return;
    }

    if (key === 'Home' || key === 'End') {
      event.preventDefault();
      if (!this.open()) this.openWithFocus();
      this.moveActiveToEdge(key === 'Home' ? 'first' : 'last');
      return;
    }

    if (key === 'Enter' || key === ' ') {
      event.preventDefault();
      if (this.open() && this.activeIndex() >= 0) {
        this.selectActiveOption();
      } else {
        this.toggleOpen();
      }
    }
  }

  // ---- Private ----

  private openWithFocus(): void {
    if (this.disabled || this.readonly) return;
    this.open.set(true);
    const opts = this.options?.toArray() ?? [];
    const selectedIdx = opts.findIndex(o => o.value === this._value());
    if (selectedIdx >= 0) {
      this.activeIndex.set(selectedIdx);
      opts[selectedIdx].scrollIntoView();
    }
  }

  private moveActive(direction: 1 | -1): void {
    const opts = this.options?.toArray() ?? [];
    const next = navigateListIndex(opts, this.activeIndex(), direction);
    if (next !== this.activeIndex()) {
      this.activeIndex.set(next);
      opts[next].scrollIntoView();
    }
  }

  private moveActiveToEdge(which: 'first' | 'last'): void {
    const opts = this.options?.toArray() ?? [];
    const idx = which === 'first' ? firstEnabledIndex(opts) : lastEnabledIndex(opts);
    if (idx >= 0) { this.activeIndex.set(idx); opts[idx].scrollIntoView(); }
  }

  private selectActiveOption(): void {
    const opts = this.options?.toArray() ?? [];
    const opt = opts[this.activeIndex()];
    if (opt && !opt.disabled) this.selectOption(opt.value, opt.getLabel());
  }

  private syncLabel(value: string): void {
    if (!this.options || !value) return;
    const match = this.options.find(o => o.value === value);
    if (match) this._label.set(match.getLabel());
  }
}
