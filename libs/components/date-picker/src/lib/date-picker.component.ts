import {
  ChangeDetectionStrategy,
  Component, ElementRef,
  forwardRef,
  Input, signal, ViewChild,
} from '@angular/core'
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFormControl } from '@ui/core';
import type { DatePickerVariant } from './date-picker.types';
import { NgClass } from '@angular/common'
import { IconComponent } from '@ui/icon'
import { CalendarModalComponent } from './calendar-modal.component'
import { animate, style, transition, trigger } from '@angular/animations'

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
export class DatePickerComponent extends BaseFormControl<string> {
  @Input() variant: DatePickerVariant = 'default';
  @Input() error: boolean = false;
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() readonly: boolean = false;
  @Input() placeholder: string = '';

  @ViewChild('inputEl') readonly inputEl?: ElementRef<HTMLInputElement>;

  protected readonly open = signal(false);

  protected override emptyValue(): string { return ''; }


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
  }

}
