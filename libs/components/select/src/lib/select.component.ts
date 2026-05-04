import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  ElementRef,
  Input,
  QueryList,
  ViewChild,
  forwardRef,
  inject,
  signal,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgClass } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
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
  animations: [
    trigger('dropdown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-6px)' }),
        animate('150ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('120ms ease-in', style({ opacity: 0, transform: 'translateY(-6px)' })),
      ]),
    ]),
  ],
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
  @ViewChild('searchInput') private searchInputRef?: ElementRef<HTMLInputElement>;

  private readonly hostEl = inject(ElementRef<HTMLElement>);

  @Input() variant: SelectVariant = 'default';
  @Input() label = '';
  @Input() placeholder = '';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readonly = false;
  @Input() error = '';
  @Input() hint = '';
  @Input() allowClear = false;
  @Input() allowSearch = false;

  protected readonly open          = signal(false);
  protected readonly _label        = signal('');
  protected readonly hovered       = signal(false);
  private   readonly activeIndex   = signal(0);
  private   readonly _visibleCount = signal(-1); // -1 = not filtering

  protected get hasVisibleOptions(): boolean {
    const c = this._visibleCount();
    return c === -1 || c > 0;
  }

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
    this.resetSearch();
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

  clearValue(event?: MouseEvent): void {
    event?.stopPropagation();
    this.emitChange('');
    this._label.set('');
    this.resetSearch();
    this.open.set(false);
    this.activeIndex.set(-1);
  }

  toggleOpen(): void {
    if (this.disabled || this.readonly) return;
    if (this.open()) {
      this.resetSearch();
      this.open.set(false);
      this.activeIndex.set(-1);
    } else {
      this.open.set(true);
      if (this.allowSearch) {
        setTimeout(() => this.searchInputRef?.nativeElement.focus());
      }
    }
  }

  handleBlur(event: FocusEvent): void {
    const related = event.relatedTarget as HTMLElement | null;
    if (related && this.hostEl.nativeElement.contains(related)) return;
    this.resetSearch();
    this.open.set(false);
    this.activeIndex.set(-1);
    this.emitTouched();
  }

  handleKeydown(event: KeyboardEvent): void {
    const { key } = event;

    if (key === 'Escape') {
      this.resetSearch();
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

    if (key === 'Enter') {
      event.preventDefault();
      if (!this.open()) {
        this.toggleOpen();
      } else if (this.activeIndex() >= 0) {
        this.selectActiveOption();
      } else if (this._visibleCount() === 1) {
        this.selectSingleVisible();
      }
      // open + no active + 0 or multiple results → do nothing
    }
  }

  handleInputClick(event: MouseEvent): void {
    event.stopPropagation();
    if (!this.open()) {
      this.toggleOpen();
    }
  }

  handleSearch(event: Event): void {
    const text = (event.target as HTMLInputElement).value.toLowerCase().trim();
    if (text === '') {
      this.resetSearch();
      this.clearValue();
      return;
    }
    this.filterOptions(text);
    this.activeIndex.set(-1);
  }

  // ---- Private ----

  private openWithFocus(): void {
    if (this.disabled || this.readonly) return;
    this.open.set(true);
    if (this.allowSearch) {
      setTimeout(() => this.searchInputRef?.nativeElement.focus());
      return;
    }
    const opts = this.options?.toArray() ?? [];
    const selectedIdx = opts.findIndex(o => o.value === this._value());
    if (selectedIdx >= 0) {
      this.activeIndex.set(selectedIdx);
      opts[selectedIdx].scrollIntoView();
    }
  }

  private moveActive(direction: 1 | -1): void {
    const opts = this.options?.toArray() ?? [];
    const navItems = opts.map(o => ({ disabled: o.disabled || o.isHidden }));
    const next = navigateListIndex(navItems, this.activeIndex(), direction);
    if (next !== this.activeIndex()) {
      this.activeIndex.set(next);
      opts[next].scrollIntoView();
    }
  }

  private moveActiveToEdge(which: 'first' | 'last'): void {
    const opts = this.options?.toArray() ?? [];
    const navItems = opts.map(o => ({ disabled: o.disabled || o.isHidden }));
    const idx = which === 'first' ? firstEnabledIndex(navItems) : lastEnabledIndex(navItems);
    if (idx >= 0) { this.activeIndex.set(idx); opts[idx].scrollIntoView(); }
  }

  private selectActiveOption(): void {
    const opts = this.options?.toArray() ?? [];
    const opt = opts[this.activeIndex()];
    if (opt && !opt.disabled && !opt.isHidden) this.selectOption(opt.value, opt.getLabel());
  }

  private selectSingleVisible(): void {
    const opt = this.options?.toArray().find(o => !o.isHidden && !o.disabled);
    if (opt) this.selectOption(opt.value, opt.getLabel());
  }

  private filterOptions(text: string): void {
    let visible = 0;
    this.options?.toArray().forEach(opt => {
      const hidden = !!text && !opt.getLabel().toLowerCase().includes(text);
      opt.setHidden(hidden);
      if (!hidden) visible++;
    });
    this._visibleCount.set(text ? visible : -1);
  }

  private resetSearch(): void {
    this._visibleCount.set(-1);
    this.options?.toArray().forEach(opt => opt.setHidden(false));
    if (this.searchInputRef) {
      this.searchInputRef.nativeElement.value = this.displayLabel;
    }
  }

  private syncLabel(value: string): void {
    if (!this.options || !value) return;
    const match = this.options.find(o => o.value === value);
    if (match) this._label.set(match.getLabel());
  }
}
