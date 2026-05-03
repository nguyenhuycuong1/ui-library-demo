import { InjectionToken } from '@angular/core';

export type SelectVariant = 'default';

export interface SelectContext {
  selectOption(value: string, label: string): void;
  isSelected(value: string): boolean;
  isActive(value: string): boolean;
}

export const SELECT_CONTEXT = new InjectionToken<SelectContext>('SELECT_CONTEXT');
