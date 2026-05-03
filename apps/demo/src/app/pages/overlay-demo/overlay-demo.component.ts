import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  inject,
  signal,
} from '@angular/core';
import { OverlayRef, OverlayService } from '@ui/core';
import { ButtonComponent } from '@ui/button';

interface Panel {
  id: string;
  title: string;
  offset: number;
}

let _seq = 0;

@Component({
  selector: 'app-overlay-demo',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './overlay-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverlayDemoComponent {
  protected readonly overlay = inject(OverlayService);
  protected readonly panels  = signal<Panel[]>([]);

  protected readonly apiRows = [
    { member: 'register(ref)',   type: 'void',   desc: 'Add a ref to the stack; locks scroll on first open.' },
    { member: 'deregister(id)',  type: 'void',   desc: 'Remove a ref by id; unlocks scroll when stack is empty.' },
    { member: 'closeTop()',      type: 'void',   desc: 'Calls close() on the last-registered overlay ref.' },
    { member: 'openCount',       type: 'number', desc: 'Current stack depth (getter, not a signal).' },
  ];

  @HostListener('document:keydown.escape')
  protected onEsc(): void {
    this.overlay.closeTop();
  }

  protected openPanel(title = 'Overlay'): void {
    const id = `panel-${++_seq}`;
    const offset = this.panels().length * 32;
    const ref: OverlayRef = { id, close: () => this.closePanel(id) };
    this.overlay.register(ref);
    this.panels.update(ps => [...ps, { id, title, offset }]);
  }

  protected closePanel(id: string): void {
    this.overlay.deregister(id);
    this.panels.update(ps => ps.filter(p => p.id !== id));
  }

  protected closeAll(): void {
    this.panels().forEach(p => this.overlay.deregister(p.id));
    this.panels.set([]);
  }
}
