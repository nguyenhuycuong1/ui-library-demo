# Extending the UI Library

How to add a new component to the library.

---

## Option A — Use the Nx Generator (recommended)

```bash
# After npm install (requires Node 18+)
npx nx generate @ui/workspace:component select
npx nx generate @ui/workspace:component date-picker --withCva=true
```

The generator creates the full scaffold under `libs/components/<name>/`:
```
libs/components/select/
├── project.json
└── src/
    ├── index.ts                  ← public API
    └── lib/
        ├── select.types.ts       ← exported types
        ├── select.component.ts   ← @Component class
        ├── select.component.html ← template
        └── select.component.scss ← scoped styles
```

It also registers `@ui/select` in `tsconfig.base.json` paths automatically.

---

## Option B — Manual Steps

### 1. Create the library folder

```
libs/components/alert/
├── project.json
└── src/
    ├── index.ts
    └── lib/
        ├── alert.types.ts
        ├── alert.component.ts
        ├── alert.component.html
        └── alert.component.scss
```

### 2. `project.json`

```json
{
  "name": "alert",
  "$schema": "../../../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "libs/components/alert/src",
  "projectType": "library",
  "targets": {},
  "tags": ["scope:components", "type:lib"]
}
```

### 3. Types file

```ts
// alert.types.ts
export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';
```

### 4. Component class

```ts
// alert.component.ts
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import type { AlertVariant } from './alert.types';

@Component({
  selector: 'ui-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  @Input() variant: AlertVariant = 'info';
  @Input() title  = '';
  @Input() dismissible = false;
}
```

### 5. Template

```html
<!-- alert.component.html -->
<div class="alert" [class]="'alert--' + variant" role="alert">
  <div class="alert__body">
    @if (title) {
      <div class="alert__title">{{ title }}</div>
    }
    <div class="alert__desc">
      <ng-content></ng-content>
    </div>
  </div>
</div>
```

### 6. Styles

```scss
// alert.component.scss
// Use CSS custom properties — no token import needed.
:host { display: block; }

.alert {
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--r-md);
  border: 1px solid;
  font-size: var(--fs-base);
}

.alert--info    { background: var(--info-50);    border-color: var(--info-100);    color: var(--info-600); }
.alert--success { background: var(--success-50); border-color: var(--success-100); color: var(--success-700); }
.alert--warning { background: var(--warning-50); border-color: var(--warning-100); color: var(--warning-700); }
.alert--danger  { background: var(--danger-50);  border-color: var(--danger-100);  color: var(--danger-700); }
```

### 7. Public API

```ts
// index.ts
export { AlertComponent } from './lib/alert.component';
export type { AlertVariant } from './lib/alert.types';
```

### 8. Register path

In `tsconfig.base.json` add:
```json
"@ui/alert": ["libs/components/alert/src/index.ts"]
```

### 9. Use it

```ts
// In any standalone component or app:
import { AlertComponent } from '@ui/alert';

@Component({
  imports: [AlertComponent],
  template: `<ui-alert variant="success" title="Saved!">Your changes have been saved.</ui-alert>`
})
```

---

## Checklist for Every New Component

- [ ] `ChangeDetectionStrategy.OnPush`
- [ ] `standalone: true` (no NgModule)
- [ ] No inline styles (`[style]` bindings are fine for dynamic values)
- [ ] All colors/sizes use CSS custom properties (`var(--token)`)
- [ ] Public API exports type aliases alongside the component class
- [ ] `@Input()` for all configurable properties with sensible defaults
- [ ] `@Output()` for all user-initiated events
- [ ] ARIA attributes on the template (`role`, `aria-*`)
- [ ] `project.json` with correct `tags` for Nx enforcement

---

## Form Components (CVA)

For any component that participates in forms, extend `BaseFormControl`:

```ts
import { BaseFormControl } from '@ui/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectComponent),
    multi: true,
  }],
})
export class SelectComponent extends BaseFormControl<string | null> {
  protected override emptyValue(): string | null { return null; }

  // When the user picks a value:
  protected select(value: string) {
    this.emitChange(value);   // updates ngModel / formControl
  }

  // On blur:
  protected blur() {
    this.emitTouched();       // marks the control as touched
  }
}
```

---

## Adding SCSS Mixins

Add reusable patterns to `libs/tokens/src/lib/_mixins.scss`, then use in any
component SCSS file:

```scss
@use 'libs/tokens/src/lib/mixins' as t;

.my-control:focus-visible {
  @include t.focus-ring();
}
```

The `stylePreprocessorOptions.includePaths` in `apps/demo/project.json` is
already configured so you can shorten the import to:
```scss
@use 'mixins' as t;
```
