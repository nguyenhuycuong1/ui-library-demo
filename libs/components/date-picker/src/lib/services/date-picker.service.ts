import { Injectable } from '@angular/core'
import { CalendarDay } from '../models/calendar-day.model'
import { BehaviorSubject } from 'rxjs'
import { buildMonthGrid } from '../ultils/calendar.utils'

@Injectable()
export class DatePickerService {

  public calendarDaysSubject = new BehaviorSubject<CalendarDay[][]>([]);
  public calendarDays$ = this.calendarDaysSubject.asObservable();
  public selectedDateSubject = new BehaviorSubject<Date | null>(null);
  public selectedDate$ = this.selectedDateSubject.asObservable();

  public buildCalendarGrid(year: number, month: number) {
    this.calendarDaysSubject.next(buildMonthGrid(year, month));
  }

  public selectDate(date: Date): void {
    this.selectedDateSubject.next(date);
  }


}