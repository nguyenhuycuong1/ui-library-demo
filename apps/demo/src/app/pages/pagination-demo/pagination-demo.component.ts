import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PaginationComponent } from '@ui/pagination';

@Component({
  selector: 'app-pagination-demo',
  standalone: true,
  imports: [PaginationComponent],
  templateUrl: './pagination-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationDemoComponent {
  readonly page1 = signal(1);
  readonly page2 = signal(1);
  readonly page3 = signal(3);
  readonly page4 = signal(5);
  readonly page5 = signal(1);
}
