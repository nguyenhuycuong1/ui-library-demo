import {
  ChangeDetectorRef,
  Directive,
  inject,
  Input,
  OnInit,
  signal,
} from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

/**
 * Abstract base that wires up ControlValueAccessor boilerplate for any form
 * control component.  Extend this class and provide NG_VALUE_ACCESSOR in the
 * component's `providers` array using `forwardRef`.
 *
 * @example
 * providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MyInputComponent), multi: true }]
 */
@Directive()
export abstract class BaseFormControl<T = string> implements ControlValueAccessor, OnInit {
  @Input() disabled = false;

  protected readonly cdr = inject(ChangeDetectorRef);

  // Internal reactive value — components read this via signal
  protected readonly _value = signal<T>(this.emptyValue());

  // CVA callbacks registered by Angular forms
  private _onChange: (v: T) => void = () => {};
  private _onTouched: () => void    = () => {};

  ngOnInit(): void {}

  // ---- ControlValueAccessor implementation ----

  writeValue(val: T): void {
    this._value.set(val ?? this.emptyValue());
    this.cdr.markForCheck();
  }

  registerOnChange(fn: (v: T) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.cdr.markForCheck();
  }

  // ---- Helpers for subclasses ----

  protected emitChange(value: T): void {
    this._value.set(value);
    this._onChange(value);
  }

  protected emitTouched(): void {
    this._onTouched();
  }

  /** Override to provide a typed empty value (null, '', false, etc.) */
  protected abstract emptyValue(): T;
}
