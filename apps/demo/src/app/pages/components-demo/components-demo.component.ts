import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@ui/button';
import { InputComponent } from '@ui/input';
import { BadgeComponent } from '@ui/badge';

@Component({
  selector: 'app-components-demo',
  standalone: true,
  imports: [ButtonComponent, InputComponent, BadgeComponent, ReactiveFormsModule],
  templateUrl: './components-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComponentsDemoComponent {
  protected readonly saving  = signal(false);
  protected readonly loading = signal(false);

  protected readonly form = new FormBuilder().nonNullable.group({
    name:  ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.pattern(/^\d{10,11}$/)],
  });

  protected get nameError(): string {
    const c = this.form.controls.name;
    if (c.touched && c.hasError('required')) return 'Name is required';
    return '';
  }

  protected get emailError(): string {
    const c = this.form.controls.email;
    if (c.touched && c.hasError('required')) return 'Email is required';
    if (c.touched && c.hasError('email'))    return 'Enter a valid email address';
    return '';
  }

  protected simulateSave(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.saving.set(true);
    setTimeout(() => this.saving.set(false), 2000);
  }

  protected simulateLoad(): void {
    this.loading.update(v => !v);
  }
}
