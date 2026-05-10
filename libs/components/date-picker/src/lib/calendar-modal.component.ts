import { Component, computed, signal } from '@angular/core'
import { IconComponent } from '../../../icon/src'

@Component({
  selector: 'ui-calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrl: './calendar-modal.component.scss',
  standalone: true,
  imports: [
    IconComponent
  ],
})
export class CalendarModalComponent {

  protected readonly currentYear = signal(new Date().getFullYear());
  protected readonly currentMonth = signal(new Date().getMonth());

  protected readonly currentMonthName = computed(() =>
    new Intl.DateTimeFormat('vi-VN', { month: 'long' }).format(new Date(2000, this.currentMonth(), 1))
  );

  handlePrevYear(): void {
    this.currentYear.update(v => v - 1);
  }

  handleNextYear(): void {
    this.currentYear.update(v => v + 1);
  }

  handlePrevMonth(): void {
    this.currentMonth.update(v => v === 0 ? 11 : v - 1);
    if (this.currentMonth() === 11) this.handlePrevYear();
  }

  handleNextMonth(): void {
    this.currentMonth.update(v => v === 11 ? 0 : v + 1);
    if (this.currentMonth() === 0) this.handleNextYear();
  }

}