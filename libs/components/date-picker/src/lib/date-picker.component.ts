import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
  inject,
  Input,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormControl } from '@ui/core';
import type { DateFormat, DatePickerVariant } from './date-picker.types'
import { NgClass } from '@angular/common'
import { IconComponent } from '@ui/icon'
import { CalendarModalComponent } from './calendar-modal.component'
import { animate, style, transition, trigger } from '@angular/animations'
import { dateToStringWithFormat, stringToDateWithFormat } from '../../../../core/src/lib/time/time-parser'
import { DatePickerService } from './services/date-picker.service'
import { autoFormatDateInput, mapCursorToFormatted } from './ultils/date-picker.utils'

@Component({
  selector: 'ui-date-picker',
  standalone: true,
  imports: [
    NgClass,
    IconComponent,
    CalendarModalComponent,
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DatePickerService,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ],
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
})
export class DatePickerComponent extends BaseFormControl<Date | null> implements OnInit {

  @Input() format: DateFormat = 'DD/MM/YYYY';
  @Input() variant: DatePickerVariant = 'default';
  @Input() error: boolean = false;
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() placeholder: string = '';

  @ViewChild('inputEl') readonly inputEl?: ElementRef<HTMLInputElement>;

  private readonly datePickerService = inject(DatePickerService);

  protected readonly open = signal(false);
  protected readonly inputValue = signal('');

  protected override emptyValue(): Date | null { return null; }

  override writeValue(val: Date | null): void {
    super.writeValue(val);
    this.inputValue.set(val ? dateToStringWithFormat(val, this.format) : '');
  }

  override ngOnInit(): void {
    this.datePickerService.selectedDate$.subscribe(date => {
      if (date) {
        this.emitChange(date);
        this.inputValue.set(dateToStringWithFormat(date, this.format));
        this.open.set(false);
      }
    });
  }

  get fieldClasses(): Record<string, boolean> {
    return {
      field:      true,
      'is-error': !!this.error,
    };
  }

  handleFocus(): void {
    if (this.inputEl) {
      this.inputEl.nativeElement.focus();
    }
    this.open.set(true);
  }

  handleBlur(): void {
    this.open.set(false);
    const v = this._value();
    this.inputValue.set(v ? dateToStringWithFormat(v, this.format) : '');
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const raw = input.value;
    const cursorPos = input.selectionStart ?? raw.length;

    const formatted = autoFormatDateInput(raw, this.format);
    const newCursor = mapCursorToFormatted(raw, cursorPos, formatted);

    input.value = formatted;
    input.setSelectionRange(newCursor, newCursor);

    this.inputValue.set(formatted);

    if (!formatted) {
      this.emitChange(null);
      return;
    }
    const date = stringToDateWithFormat(formatted, this.format);
    if (date) {
      this.emitChange(date);
    }
  }
}