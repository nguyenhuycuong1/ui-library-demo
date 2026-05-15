import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CalendarDay } from './models/calendar-day.model'
import { buildMonthGrid } from './ultils/calendar.utils'
import { WeekRowComponent } from './week-row.component'

@Component({
  selector: 'ui-calendar-grid',
  template: `
    <div>
      <div style="display: flex; gap: 4px">
        @for (weekDay of weekDays; track weekDay) {
          <div>{{weekDay}}</div>
        }
      </div>
      @for (week of calendarDays; track week[0].date) {
        <ui-week-row [days]="week"></ui-week-row>
      }
    </div>
  `,
  styles: [
    ``,
  ],
  standalone: true,
  imports: [CommonModule, WeekRowComponent],
})
export class CalendarGridComponent {
  protected readonly weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  protected calendarDays: CalendarDay[][] = [];

  ngOnInit(): void {
    this.calendarDays = buildMonthGrid(new Date().getFullYear(), new Date().getMonth());
  }

}