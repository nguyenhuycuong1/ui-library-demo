import { Injectable, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export interface OverlayRef {
  id: string;
  close: () => void;
}

/**
 * Lightweight overlay manager.  Tracks which overlays are open so
 * ESC key and backdrop click can target the topmost one.
 *
 * For complex scenarios (portals, scroll blocking) prefer Angular CDK's
 * OverlayModule — this service covers simple cases without the CDK dependency.
 */
@Injectable({ providedIn: 'root' })
export class OverlayService {
  private readonly doc   = inject(DOCUMENT);
  private readonly stack = signal<OverlayRef[]>([]);

  get openCount(): number {
    return this.stack().length;
  }

  register(ref: OverlayRef): void {
    this.stack.update(s => [...s, ref]);
    if (this.stack().length === 1) this.lockScroll();
  }

  deregister(id: string): void {
    this.stack.update(s => s.filter(r => r.id !== id));
    if (this.stack().length === 0) this.unlockScroll();
  }

  closeTop(): void {
    const top = this.stack().at(-1);
    top?.close();
  }

  private lockScroll(): void {
    this.doc.body.style.overflow = 'hidden';
  }

  private unlockScroll(): void {
    this.doc.body.style.overflow = '';
  }
}
