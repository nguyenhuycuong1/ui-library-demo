import { Component, Input } from '@angular/core'
import { CalendarDay } from './models/calendar-day.model'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'ui-day-cell',
  template: `
    <div>{{ day.date | date: 'd' }}</div>
  `,
  styles: [
    ``,
  ],
  standalone: true,
  imports: [
    DatePipe,
  ],
})
export class DayCellComponent {
  @Input() day: CalendarDay = {
    date: new Date(),
    isCurrentMonth: true,
    isToday: false,
    isSelected: false,
    isDisabled: false,
  };
}