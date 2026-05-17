import { Component, Input } from '@angular/core'
import { CalendarDay } from './models/calendar-day.model'
import { DayCellComponent } from './day-cell.component'

@Component({
  selector: 'ui-week-row',
  template: `
    <div class="week-row">
      @for (day of days; track day.date) {
        <ui-day-cell [day]="day"></ui-day-cell>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .week-row {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 2px;
    }
  `],
  standalone: true,
  imports: [DayCellComponent]
})
export class WeekRowComponent {
  @Input() days: CalendarDay[] = [];
}