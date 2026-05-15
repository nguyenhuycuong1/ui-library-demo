import { Component, Input } from '@angular/core'
import { CalendarDay } from './models/calendar-day.model'
import { DayCellComponent } from './day-cell.component'

@Component({
  selector: 'ui-week-row',
  template: `
    <div style="display: flex; gap: 4px">
      @for (day of days; track day.date) {
        <ui-day-cell [day]="day"></ui-day-cell>
      }
    </div>
  `,
  styles: [
    ``,
  ],
  standalone: true,
  imports: [DayCellComponent]
})
export class WeekRowComponent {
  @Input() days: CalendarDay[] = [];
}