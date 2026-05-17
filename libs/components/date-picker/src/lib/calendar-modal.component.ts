import { Component, computed, effect, inject, Input, OnInit, signal } from '@angular/core'
import { IconComponent } from '../../../icon/src'
import { CalendarGridComponent } from './calendar-grid.component'
import { DatePickerService } from './services/date-picker.service'
import { isSameDay } from '../../../../core/src'

@Component({
  selector: 'ui-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrl: './calendar-modal.component.scss',
  standalone: true,
  imports: [
    IconComponent,
    CalendarGridComponent,
  ],
})
export class CalendarModalComponent implements OnInit {
  private readonly datePickerService = inject(DatePickerService);

  @Input() viewDate: Date | null = null;

  protected readonly currentYear = signal(0);
  protected readonly currentMonth = signal(0);

  protected readonly currentMonthName = computed(() =>
    new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(new Date(2000, this.currentMonth(), 1))
  );

  constructor() {
    effect(() => {
      this.datePickerService.buildCalendarGrid(this.currentYear(), this.currentMonth());
      if (this.viewDate !== null) {
        this.datePickerService.selectDate(this.viewDate);
      }
    });
  }

  ngOnInit(): void {
    const d = this.viewDate ?? new Date();
    this.currentYear.set(d.getFullYear());
    this.currentMonth.set(d.getMonth());
  }

  handlePrevYear(): void {
    this.currentYear.update(v => v - 1);
  }

  handleNextYear(): void {
    this.currentYear.update(v => v + 1);
  }

  handlePrevMonth(): void {
    if (this.currentMonth() === 0) {
      this.currentMonth.set(11);
      this.currentYear.update(v => v - 1);
    } else {
      this.currentMonth.update(v => v - 1);
    }
  }

  handleNextMonth(): void {
    if (this.currentMonth() === 11) {
      this.currentMonth.set(0);
      this.currentYear.update(v => v + 1);
    } else {
      this.currentMonth.update(v => v + 1);
    }
  }

}