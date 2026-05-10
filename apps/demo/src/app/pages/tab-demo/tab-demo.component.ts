import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TabsComponent, TabItemComponent } from '@ui/tab';

@Component({
  selector: 'app-tab-demo',
  standalone: true,
  imports: [TabsComponent, TabItemComponent],
  templateUrl: './tab-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabDemoComponent {
  readonly activeLine = signal(0);
  readonly activeBoxed = signal(0);
  readonly activePills = signal(0);
}
