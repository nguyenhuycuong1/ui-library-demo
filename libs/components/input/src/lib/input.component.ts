import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { BaseFormControl } from '@ui/core';
import type { InputSize, InputType } from './input.types';

/**
 * Form field with label, hint, and error message.
 * Integrates with Angular Reactive Forms and Template-driven Forms.
 *
 * Reactive Forms:
 *   <ui-input label="Email" formControlName="email" [error]="emailError" />
 *
 * Template-driven:
 *   <ui-input label="Name" [(ngModel)]="name" required />
 *
 * With prefix/suffix:
 *   <ui-input label="Amount" prefix="₫" suffix=".00" />
 */
@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent extends BaseFormControl<string> {
  @Input() label       = '';
  @Input() placeholder = '';
  @Input() type: InputType  = 'text';
  @Input() size: InputSize  = 'md';
  @Input() required    = false;
  @Input() readonly    = false;
  @Input() error       = '';
  @Input() hint        = '';
  @Input() prefix      = '';   // plain-text prefix shown inside the input wrapper
  @Input() suffix      = '';   // plain-text suffix shown inside the input wrapper
  @Input() autocomplete = 'off';

  @ViewChild('inputEl') readonly inputEl?: ElementRef<HTMLInputElement>;

  protected override emptyValue(): string { return ''; }

  get value(): string { return this._value(); }

  get fieldClasses(): Record<string, boolean> {
    return {
      field:      true,
      'is-error': !!this.error,
    };
  }

  get inputClasses(): Record<string, boolean> {
    return {
      input:        !this.prefix && !this.suffix,
      [`input--${this.size}`]: this.size !== 'md',
    };
  }

  handleInput(event: Event): void {
    this.emitChange((event.target as HTMLInputElement).value);
  }

  handleBlur(): void {
    this.emitTouched();
  }

  focus(): void {
    this.inputEl?.nativeElement.focus();
  }
}
