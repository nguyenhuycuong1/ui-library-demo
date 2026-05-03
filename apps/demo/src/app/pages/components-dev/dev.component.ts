import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { SelectComponent, OptionComponent } from '@ui/select';
import { ButtonComponent } from '@ui/button';

@Component({
  selector: 'dev-page',
  standalone: true,
  templateUrl: './dev.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SelectComponent, OptionComponent, ButtonComponent, ReactiveFormsModule, JsonPipe, FormsModule],
})
export class DevComponent {
  protected readonly selected = signal('');
  protected readonly submitted = signal(false);

  protected readonly form = new FormBuilder().nonNullable.group({
    role:  ['', Validators.required],
    level: [''],
  });

  protected get roleError(): string {
    const c = this.form.controls.role;
    if (c.touched && c.hasError('required')) return 'Role is required';
    return '';
  }

  protected submit(): void {
    console.log(this.selected());
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    this.submitted.set(true);
  }

  protected reset(): void {
    this.form.reset();
    this.submitted.set(false);
  }
}
