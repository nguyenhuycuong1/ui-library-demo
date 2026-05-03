# JSX → Angular Template Mapping

Translation notes for the Enterprise UI design system.

---

## 1. Props → @Input / @Output

| React                          | Angular                                        |
|-------------------------------|------------------------------------------------|
| `<Btn variant="primary">`     | `<ui-button variant="primary">`                |
| `<Btn disabled>`              | `<ui-button [disabled]="true">`               |
| `<Btn onClick={fn}>`          | `<ui-button (clicked)="fn($event)">`          |
| `<Btn loading={saving}>`      | `<ui-button [loading]="saving()">`            |
| Render prop / children        | `<ng-content>` (default slot)                  |
| Named slots (`prefix`)        | `<ng-content select="[prefix]">`               |
| Conditional `className` logic | `[ngClass]` or `[class]` binding               |

---

## 2. State → Signals

React hooks map directly to Angular signals (v16+):

```tsx
// React
const [open, setOpen] = useState(false);
const toggle = () => setOpen(v => !v);
```

```ts
// Angular 17
protected readonly open = signal(false);
protected toggle() { this.open.update(v => !v); }
```

In templates, call the signal: `{{ open() }}`, `[class.is-open]="open()"`.

---

## 3. useEffect → effect()

```tsx
// React
useEffect(() => {
  document.documentElement.setAttribute('data-theme', theme);
}, [theme]);
```

```ts
// Angular (in constructor or ngOnInit, inside injection context)
effect(() => {
  this.doc.documentElement.setAttribute('data-theme', this.theme());
});
```

`effect()` re-runs whenever any signal it reads changes. No dependency array needed.

---

## 4. Context / Provider → Injectable Service

```tsx
// React
const ThemeContext = createContext({ theme: 'light', toggle: () => {} });
<ThemeContext.Provider value={...}><App /></ThemeContext.Provider>
```

```ts
// Angular
@Injectable({ providedIn: 'root' })
export class ThemeService { ... }

// Consumed anywhere via inject()
protected readonly theme = inject(ThemeService);
```

---

## 5. CSS Classes → Host Bindings

React adds classes to the root element via `className`.  
Angular uses `@HostBinding` or the `host` metadata:

```tsx
// React
<span className={`badge badge--${variant}`}>
```

```ts
// Angular (host as the element itself)
@Component({
  selector: 'ui-badge',
  host: { class: 'badge' },
})
export class BadgeComponent {
  @HostBinding('class')
  get hostClass() { return `badge--${this.variant}`; }
}
```

No wrapper `<span>` needed — the host element IS the badge.

---

## 6. Controlled Inputs → ControlValueAccessor

React controlled inputs use `value` + `onChange`.  
Angular uses `ControlValueAccessor` to integrate with both Reactive and Template Forms:

```tsx
// React controlled input
<input value={val} onChange={e => setVal(e.target.value)} />
```

```ts
// Angular CVA (simplified)
@Component({
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(...), multi: true }]
})
export class InputComponent extends BaseFormControl<string> {
  emptyValue() { return ''; }
  handleInput(e: Event) { this.emitChange((e.target as HTMLInputElement).value); }
}
```

Usage with Reactive Forms:
```html
<ui-input formControlName="email" label="Email" [error]="emailError" />
```

---

## 7. Conditional Rendering

```tsx
// React
{error && <span className="field__error">{error}</span>}
```

```html
<!-- Angular 17 control flow -->
@if (error) {
  <span class="field__error">{{ error }}</span>
}
```

---

## 8. List Rendering

```tsx
// React
{items.map(item => <li key={item.id}>{item.name}</li>)}
```

```html
<!-- Angular 17 control flow -->
@for (item of items; track item.id) {
  <li>{{ item.name }}</li>
}
```

---

## 9. Event Modifiers

```tsx
// React
<button onClick={e => { e.preventDefault(); doSomething(); }}>
```

```html
<!-- Angular -->
<button (click)="handleClick($event)">
<!-- Or with modifiers -->
<form (ngSubmit)="onSubmit()" (keydown.enter)="$event.preventDefault()">
```

---

## 10. CSS / SCSS

| React                      | Angular                                   |
|---------------------------|-------------------------------------------|
| Global CSS module         | `styles.scss` + token import              |
| Component-scoped CSS      | Component's `.scss` file (auto-scoped)    |
| `:root` variables         | Unchanged — CSS custom properties work    |
| `data-theme="dark"` on `<html>` | Same — `ThemeService` writes the attribute |
| Inline style              | Avoided; use `[class]` or `[style]` binding |

**Token usage in component SCSS:**
```scss
// No import needed — tokens.css is loaded globally
.btn--primary {
  background: var(--brand-600);     // ✓ CSS custom property (theme-aware)
  height: var(--ctrl-h-md);         // ✓ density-aware
  border-radius: var(--r-md);       // ✓
  transition: all var(--dur-fast) var(--ease-standard);  // ✓
}
```
