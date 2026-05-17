import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core'
import { CalendarDay } from './models/calendar-day.model'
import { WeekRowComponent } from './week-row.component'
import { DatePickerService } from './services/date-picker.service'

@Component({
  selector: 'ui-calendar-grid',
  template: `
    <div class="calendar-grid">
      <div class="calendar-grid__weekdays">
        @for (weekDay of weekDays; track weekDay) {
          <div class="calendar-grid__weekday">{{weekDay}}</div>
        }
      </div>
      <div class="calendar-grid__weeks">
        @for (week of calendarDays; track week[0].date) {
          <ui-week-row [days]="week"></ui-week-row>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .calendar-grid {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .calendar-grid__weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    .calendar-grid__weekday {
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--fs-xs);
      font-weight: var(--fw-medium);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .calendar-grid__weeks {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
  `],
  standalone: true,
  imports: [WeekRowComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarGridComponent {
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly datePickerService = inject(DatePickerService);
  protected readonly weekDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  protected calendarDays: CalendarDay[][] = [];

  ngOnInit(): void {
    this.datePickerService.calendarDays$.subscribe(grid => {
      this.calendarDays = grid;
      this.cdr.markForCheck();
    });
  }

}