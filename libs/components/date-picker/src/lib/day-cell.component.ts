import { Component, inject, Input, OnInit } from '@angular/core'
import { CalendarDay } from './models/calendar-day.model'
import { DatePipe } from '@angular/common'
import { DatePickerService } from './services/date-picker.service'
import { isSameDay } from '../../../../core/src'

@Component({
  selector: 'ui-day-cell',
  template: `
    <button
      type="button"
      class="day-cell"
      [class.is-today]="day.isToday"
      [class.is-selected]="day.isSelected"
      [class.is-disabled]="day.isDisabled"
      [class.is-other-month]="!day.isCurrentMonth"
      [disabled]="day.isDisabled"
      (click)="handleChooseDate(day.date)"
    >
      {{ day.date | date: 'd' }}
    </button>
  `,
  styles: [`
    :host { display: block; }

    .day-cell {
      position: relative;
      width: 100%;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--fs-sm);
      font-family: inherit;
      color: var(--text-primary);
      background: transparent;
      border: none;
      border-radius: var(--r-sm);
      cursor: pointer;
      padding: 0;
      line-height: 1;
      transition:
        color var(--dur-fast) var(--ease-standard),
        background var(--dur-fast) var(--ease-standard);

      &:hover:not(.is-selected):not(.is-disabled) {
        background: var(--bg-subtle);
      }

      &:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px var(--brand-500);
      }

      &.is-today {
        color: var(--brand-600);
        font-weight: var(--fw-semibold);

        &::after {
          content: '';
          position: absolute;
          bottom: 3px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          border-radius: var(--r-full);
          background: var(--brand-500);
        }
      }

      &.is-selected {
        background: var(--brand-500);
        color: var(--text-inverse);
        font-weight: var(--fw-medium);
        border-radius: var(--r-sm);

        &:hover { background: var(--brand-600); }

        &.is-today::after { background: var(--text-inverse); }
      }

      &.is-disabled {
        color: var(--text-disabled);
        cursor: not-allowed;
        pointer-events: none;
      }

      &.is-other-month:not(.is-selected) {
        color: var(--text-tertiary);
      }
    }
  `],
  standalone: true,
  imports: [
    DatePipe,
  ],
})
export class DayCellComponent implements OnInit {
  private readonly datePickerService = inject(DatePickerService);

  @Input() day: CalendarDay = {
    date: new Date(),
    isCurrentMonth: true,
    isToday: false,
    isSelected: false,
    isDisabled: false,
  };

  ngOnInit() {
    this.datePickerService.selectedDate$.subscribe(date => {
      this.day.isSelected = !!date && isSameDay(date, this.day.date);
    });
  }

  handleChooseDate(date: Date): void {
    this.datePickerService.selectDate(date);
  }
}