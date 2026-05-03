# Agent Reference — Enterprise UI Library

> Read this file before starting any task. It is the single source of truth for architecture,
> conventions, and patterns in this Nx monorepo Angular UI library.

---

## 1. Project Identity

| Item | Value |
|------|-------|
| Type | Nx 18 monorepo — Angular 17 component library + demo app |
| Angular | 17.3.0, standalone components only, OnPush everywhere |
| TypeScript | 5.4.0 |
| SCSS + CSS custom properties | Sass 1.72.0 |
| Package manager | npm (workspaces: `["tools"]`) |
| Dev server | `npm start` → `nx serve demo` |

---

## 2. Folder Map

```
ui-angular/
├── apps/demo/src/              Demo/showcase application
│   ├── app/
│   │   ├── app.component.*     Root shell: sidebar nav, topbar (theme/density/brand controls)
│   │   ├── app.routes.ts       Lazy-loaded pages
│   │   └── pages/
│   │       ├── foundations/    Token showcase (colors, type, spacing)
│   │       ├── components-demo/ Button, Input, Badge, reactive form demo
│   │       ├── grid-demo/      Grid system showcase
│   │       └── overlay-demo/   OverlayService showcase
│   ├── styles.scss             Global: @use 'grid' + @import tokens.css + app layout
│   └── main.ts                 Bootstrap: provideRouter, provideAnimations
│
├── libs/
│   ├── tokens/src/lib/
│   │   ├── tokens.css          ALL CSS custom properties (:root, dark, density)  ← NEVER import component SCSS from here
│   │   ├── _grid.scss          12-col grid classes (.row, .col-*, .container, .g-*)
│   │   ├── _mixins.scss        SCSS mixins (focus-ring, truncate, sr-only, flex-center, backdrop)
│   │   ├── _colors.scss        SCSS color variables ($brand-600, etc.) — compile-time only
│   │   ├── _spacing.scss       SCSS spacing variables ($sp-6, etc.)
│   │   ├── _effects.scss       SCSS radius/shadow variables
│   │   ├── _typography.scss    SCSS font variables
│   │   └── _index.scss         @forward barrel for all above
│   │
│   ├── theme/src/lib/
│   │   ├── theme.service.ts    Signals-based theme/density/brand management
│   │   ├── brand-presets.ts    6 built-in brand scales + CustomBrandInput type
│   │   └── theme.types.ts      ThemeMode, DensityMode, BrandValue, ThemeState
│   │
│   ├── core/src/lib/
│   │   ├── form-control/base-form-control.ts   Abstract CVA base class
│   │   └── overlay/overlay.service.ts          Overlay stack + scroll lock
│   │
│   └── components/
│       ├── button/             <ui-button> — 6 variants, 3 sizes, loading, icon-only
│       ├── input/              <ui-input>  — label/error/hint/prefix/suffix, CVA
│       ├── badge/              <ui-badge>  — 8 variants, dot mode
│       └── select/             <ui-select> + <ui-option> — stub (in progress)
│
└── tools/
    ├── index.js                Plugin entry point (empty)
    ├── package.json            name: "@ui/workspace"
    ├── generators.json         Declares component generator
    └── generators/component/  Nx schematic: scaffolds libs/components/<name>
```

---

## 3. Path Aliases (tsconfig.base.json)

```
@ui/button    → libs/components/button/src/index.ts
@ui/input     → libs/components/input/src/index.ts
@ui/badge     → libs/components/badge/src/index.ts
@ui/select    → libs/components/select/src/index.ts
@ui/core      → libs/core/src/index.ts
@ui/theme     → libs/theme/src/index.ts
@ui/tokens    → libs/tokens/src/index.ts  (empty — CSS-only lib)
@ui/patterns  → libs/patterns/src/index.ts (empty stub)
```

---

## 4. Design Token Reference

All tokens are CSS custom properties on `:root` in `libs/tokens/src/lib/tokens.css`.
Components ONLY use `var(--token-name)` — never hardcode colors/sizes.

### Brand (runtime-switchable via ThemeService)
```
--brand-50 … --brand-900     Current brand color scale (blue by default)
```

### Surfaces
```
--bg-canvas      Page background (gray-50 / dark: #0B1220)
--bg-elevated    Cards, dropdowns (white / dark: #111827)
--bg-subtle      Subtle backgrounds (gray-75 / dark: #141C2B)
--bg-muted       Muted areas (gray-100 / dark: #1B2538)
--bg-hover       Hover state (rgba dark 4%)
--bg-active      Active/pressed state (rgba dark 8%)
--bg-selected    Selected row/item (brand-50)
--bg-overlay     Modal backdrop (rgba dark 45%)
```

### Text
```
--text-primary   Main text
--text-secondary Subdued text
--text-tertiary  Placeholders, captions
--text-disabled  Disabled state
--text-inverse   On dark/brand bg
--text-brand     Brand-colored text (brand-600)
```

### Borders
```
--border-subtle   Hairline (gray-100)
--border-default  Normal (gray-200)
--border-strong   Emphasis (gray-300)
--border-focus    Focus ring color (brand-500)
```

### Typography
```
--font-sans    Inter, system stack
--font-mono    JetBrains Mono, Fira Code

--fs-xs  11px   --fs-sm  12px   --fs-base 13px   --fs-md  14px
--fs-lg  16px   --fs-xl  18px   --fs-2xl  20px   --fs-3xl 24px
--fs-4xl 30px   --fs-5xl 36px   --fs-6xl  48px

--fw-regular 400   --fw-medium 500   --fw-semibold 600   --fw-bold 700
--lh-tight 1.2    --lh-snug 1.4    --lh-normal 1.5    --lh-relaxed 1.6
```

### Spacing (4px base grid)
```
--sp-0  0      --sp-1  2px    --sp-2  4px    --sp-3  6px
--sp-4  8px    --sp-5  12px   --sp-6  16px   --sp-7  20px
--sp-8  24px   --sp-9  32px   --sp-10 40px   --sp-11 48px
--sp-12 64px   --sp-13 80px   --sp-14 96px
```

### Radius
```
--r-xs 2px   --r-sm 4px   --r-md 6px   --r-lg 8px
--r-xl 12px  --r-2xl 16px --r-full 9999px
```

### Shadows & Focus
```
--shadow-xs … --shadow-xl    Drop shadows (xs to xl)
--shadow-focus               3px brand-colored focus ring (updates with brand)
```

### Density (auto by [data-density] attribute)
```
--ctrl-h-sm  28/24/32px   (comfortable/compact/spacious)
--ctrl-h-md  32/28/40px
--ctrl-h-lg  40/32/48px
--row-h      40/32/48px
--cell-px    12/8/16px
--cell-py    10/6/14px
--form-gap   16/12/20px
```

### Motion
```
--ease-standard   cubic-bezier(0.2,0,0.13,1)
--ease-accel      cubic-bezier(0.4,0,1,1)
--ease-decel      cubic-bezier(0,0,0.2,1)
--dur-fast 120ms   --dur-normal 200ms   --dur-slow 320ms
```

### Z-index Scale
```
--z-base 0   --z-dropdown 1000   --z-sticky 1100   --z-fixed 1200
--z-drawer 1300   --z-modal 1400   --z-popover 1500
--z-toast 1600    --z-tooltip 1700
```

### Grid
```
--grid-columns 12        --grid-gutter var(--sp-6)
--container-sm 540px     --container-md 720px     --container-lg 960px
--container-xl 1140px    --container-2xl 1320px
```

---

## 5. Component Conventions

### Anatomy (every component follows this pattern)

```
libs/components/<name>/
├── src/
│   ├── lib/
│   │   ├── <name>.component.ts     Decorator + class
│   │   ├── <name>.component.html   Template
│   │   ├── <name>.component.scss   Styles (CSS vars only, no SCSS imports unless needed)
│   │   └── <name>.types.ts         Union types only (no classes/logic)
│   └── index.ts                    Barrel — export component + types
└── project.json                    tags: scope:components, type:lib
```

### TypeScript template
```typescript
import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import type { MyVariant, MySize } from './my.types';

@Component({
  selector: 'ui-my-component',          // Always ui- prefix
  standalone: true,                      // Always standalone
  imports: [],
  templateUrl: './my.component.html',
  styleUrl: './my.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,  // Always OnPush
})
export class MyComponent {
  @Input() variant: MyVariant = 'default';
  @Input() size: MySize = 'md';
  @Input() disabled = false;
  @Output() readonly clicked = new EventEmitter<MouseEvent>();
}
```

### Types file template
```typescript
export type MyVariant = 'primary' | 'default' | 'subtle';
export type MySize = 'sm' | 'md' | 'lg';
```

### Barrel export template
```typescript
export { MyComponent } from './lib/my.component';
export type { MyVariant, MySize } from './lib/my.types';
```

### SCSS conventions
- **Always use CSS custom properties** — `var(--brand-600)`, `var(--ctrl-h-md)`, etc.
- **Never hardcode** colors, sizes, radii, shadows
- **No SCSS imports needed** unless using mixins; tokens.css is globally loaded
- **BEM naming**: `.btn`, `.btn__spinner`, `.btn--primary`, `.btn--loading`
- **Host element sizing**: Use `@HostBinding` for display/width on the host, not an inner wrapper
- If using mixins: `@use 'mixins' as t;` (short path works via stylePreprocessorOptions)

### CSS class naming
```
Block:    .btn         .field       .badge
Element:  .btn__icon   .field__label
Modifier: .btn--primary .btn--loading .field.is-error
```

---

## 6. Form Control Convention (CVA)

Use `BaseFormControl<T>` from `@ui/core` for any form field component.

```typescript
import { BaseFormControl } from '@ui/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { forwardRef } from '@angular/core';

@Component({
  // ...
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => MyInputComponent),
    multi: true,
  }],
})
export class MyInputComponent extends BaseFormControl<string> {
  protected override emptyValue(): string { return ''; }

  handleInput(event: Event): void {
    this.emitChange((event.target as HTMLInputElement).value);
  }

  handleBlur(): void {
    this.emitTouched();
  }
}
```

Read current value: `this._value()`  
Emit to Angular forms: `this.emitChange(newValue)` + `this.emitTouched()`

---

## 7. ThemeService API

```typescript
protected readonly theme = inject(ThemeService);

// Signals (read in templates or computed)
theme.theme()    // 'light' | 'dark'
theme.density()  // 'compact' | 'comfortable' | 'spacious'
theme.brand()    // BrandValue

// Setters
theme.setTheme('dark')
theme.setDensity('compact')
theme.setBrand('indigo')                // Built-in preset
theme.setBrand({ 50: '#...', ... })     // Custom brand (10 shades required)
theme.toggleTheme()
theme.cycleDensity()                    // compact → comfortable → spacious
theme.snapshot()                        // { theme, density, brand }
```

**How brand switching works**: ThemeService writes inline `style.setProperty('--brand-*', value)` on `<html>`, which overrides stylesheet values. All `var(--brand-*)` usages throughout the UI update automatically.

**Built-in brands**: `'blue'` | `'indigo'` | `'violet'` | `'emerald'` | `'orange'` | `'rose'`

**Custom brand**: Provide a `CustomBrandInput` object with shades 50–900 as hex strings.
Optional fields (`focusRing`, `dark50`, `dark100`) are auto-derived from shade 500/600 if omitted.

---

## 8. OverlayService API

```typescript
protected readonly overlay = inject(OverlayService);

// Register opens an overlay and locks body scroll on first open
overlay.register({ id: 'my-panel', close: () => this.closePanel() });

// Deregister removes from stack; unlocks scroll when stack is empty
overlay.deregister('my-panel');

// Close the topmost overlay
overlay.closeTop();

// Read count reactively
overlay.openCount  // number (getter)
```

**Z-index pattern for overlays**: Backdrop at `--z-modal - 10` (1390), panels at `--z-modal + offset` (1400+).

**ESC key**: Components should `@HostListener('document:keydown.escape')` → `overlay.closeTop()`.

---

## 9. Grid System Classes

Defined in `libs/tokens/src/lib/_grid.scss`, loaded globally via `@use 'grid'` in `styles.scss`.

```html
<!-- Container -->
<div class="container">...</div>           <!-- max-width at breakpoints -->
<div class="container-fluid">...</div>     <!-- always full width -->

<!-- Basic row + columns -->
<div class="row">
  <div class="col">equal fill</div>
  <div class="col-auto">shrink-wrap</div>
  <div class="col-8">8 of 12</div>
</div>

<!-- Responsive -->
<div class="col-12 col-md-6 col-lg-4">    <!-- 1 → 2 → 3 col -->

<!-- Gutters on .row -->
<div class="row g-0">  <!-- 0px gap  -->
<div class="row g-2">  <!-- 8px gap  -->
<div class="row g-4">  <!-- 24px gap -->

<!-- Offset at breakpoint -->
<div class="col-6 offset-md-3">centered</div>

<!-- Alignment on .row -->
<div class="row align-items-center justify-content-between">

<!-- Order -->
<div class="col order-first">  <!-- rendered first regardless of DOM position -->
```

**Breakpoints**: sm 576px / md 768px / lg 992px / xl 1200px / 2xl 1400px

---

## 10. Demo App Patterns

### Adding a new demo page
1. Create `apps/demo/src/app/pages/<name>-demo/<name>-demo.component.ts` + `.html`
2. Add route in `app.routes.ts` (lazy-loaded)
3. Add nav item in `app.component.ts` `nav` array

### Page structure
```html
<span class="section-kicker">Category</span>
<h1 class="section-title">Page Title</h1>
<p class="section-desc">Description text, max 640px wide.</p>

<h2 style="font-size: var(--fs-lg); font-weight: var(--fw-semibold); margin: var(--sp-7) 0 var(--sp-3);">
  Section heading
</h2>
<div class="ex ex--col" style="margin-bottom: var(--sp-5);">
  <!-- demo content -->
</div>
```

### Available demo layout helpers (styles.scss)
```
.ex          Demo card (white bg, border, radius, padding, flex-wrap)
.ex--col     Stacks children vertically
.ex__label   Full-width label line inside .ex
.grid-3      3-col CSS grid
.grid-4      4-col CSS grid
.stack       Flex column with gap
.flex-row    Flex row with gap (for inline demos, NOT Bootstrap grid)
.section-kicker   Uppercase brand label
.section-title    Large h1
.section-desc     Subdued paragraph, max-width 640px
```

### Curly brace escaping in templates
Angular 17 block syntax treats `{` as special. In template text, always escape:
```html
{{ '{' }}n{{ '}' }}    →  renders as  {n}
```

---

## 11. Create a New Component

### Using the generator (recommended)
```bash
npx nx generate @ui/workspace:component <name> --withCva=true
```
- Creates `libs/components/<name>/` with all 5 files
- Registers path alias in `tsconfig.base.json`
- `--withCva` adds `BaseFormControl` extension and CVA provider

### Manually
1. Create `libs/components/<name>/` following the anatomy in §5
2. Add to `tsconfig.base.json` paths: `"@ui/<name>": ["libs/components/<name>/src/index.ts"]`
3. Create `libs/components/<name>/project.json` (copy from `button/project.json`, change name)

### When to use withCva
- Text/number inputs, selects, checkboxes, radio groups, date pickers → `withCva: true`
- Buttons, badges, tooltips, modals, tabs → `withCva: false`

---

## 12. SCSS Mixin Usage

```scss
@use 'mixins' as t;   // Short path works because of stylePreprocessorOptions

.my-element {
  @include t.focus-ring();         // 3px brand focus ring
  @include t.focus-ring-danger();  // 3px red focus ring
  @include t.transition(color);    // Standard duration/easing
  @include t.truncate();           // Overflow ellipsis
  @include t.sr-only();            // Visually hidden, accessible
  @include t.flex-center();        // display:flex; align+justify center
  @include t.backdrop();           // position:fixed; inset:0; bg:var(--bg-overlay); z:modal
}
```

---

## 13. Nx Commands

```bash
npm start                              # Serve demo app
npx nx build demo                      # Build demo app
npx nx run-many --target=build --projects=button,input,badge   # Build libs

# Generate new component
npx nx generate @ui/workspace:component <name>
npx nx generate @ui/workspace:component <name> --withCva=true
```

---

## 14. Key Constraints & Gotchas

| Constraint | Detail |
|-----------|--------|
| No `ngModule` | Everything is standalone. Never add NgModule. |
| OnPush always | Every component uses `ChangeDetectionStrategy.OnPush`. |
| CSS vars only | Components never hardcode colors/sizes. Always `var(--token)`. |
| No SCSS in tokens.css | `tokens.css` is plain CSS; SCSS partials are separate files. |
| `@use` before `@import` | SCSS rule: `@use` must precede `@import` in the same file. |
| `@use 'grid'` not full path | `stylePreprocessorOptions.includePaths` = `libs/tokens/src/lib`, so use short names. |
| Curly braces in templates | Escape with `{{ '{' }}` / `{{ '}' }}`. Angular 17 block syntax treats `{` as special. |
| `[class]` vs `class` | Don't mix `[class]="expr"` and `class="static"` on the same element — `[class]` replaces all. Use `[class]="'static ' + dynamic"` instead. |
| Brand tokens on `<html>` inline style | `applyBrandToDOM` writes inline styles to `documentElement`. Inline styles beat stylesheet rules, enabling runtime brand switching without a rebuild. |
| Dark mode brand variants | ThemeService's brand effect reads both `brand()` and `theme()` signals. When theme changes to dark, `--brand-50` and `--brand-100` switch to semi-transparent values. |
| Overlay z-index | Backdrop: 1390 (`--z-modal - 10`). Panels: `1400 + (index * offset)`. Topbar is at `--z-sticky` (1100). |
| `.row` in global styles | `styles.scss` defines `.flex-row` (old layout helper). Bootstrap-like `.row` comes from `_grid.scss`. Don't confuse them. |

---

## 15. File Creation Checklist

When creating a new UI component:
- [ ] `<name>.component.ts` — standalone, OnPush, `ui-` selector
- [ ] `<name>.component.html` — template
- [ ] `<name>.component.scss` — styles using `var(--token)` only
- [ ] `<name>.types.ts` — exported union types
- [ ] `src/index.ts` — barrel export of component + types
- [ ] `project.json` — Nx project config with correct tags
- [ ] `tsconfig.base.json` — add path alias `@ui/<name>`
- [ ] If CVA: extend `BaseFormControl<T>`, add `NG_VALUE_ACCESSOR` provider

When adding a demo page:
- [ ] `pages/<name>-demo/<name>-demo.component.ts`
- [ ] `pages/<name>-demo/<name>-demo.component.html`
- [ ] Route in `app.routes.ts`
- [ ] Nav entry in `app.component.ts`
