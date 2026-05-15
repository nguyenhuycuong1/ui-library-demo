import { CalendarDay } from '../models/calendar-day.model'
import { isSameDay } from '@ui/core'

export function buildMonthGrid(year: number, month: number): CalendarDay[][] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDate = new Date(firstDay);
  const dayOfWeek = (firstDay.getDay() + 6) % 7;
  startDate.setDate(startDate.getDate() - dayOfWeek);

  const weeks: CalendarDay[][] = [];
  const cursor = new Date(startDate);

  while(cursor <= lastDay || weeks.length < 6) {
    const week: CalendarDay[] = [];
    for (let i = 0; i < 7; i++) {
      week.push({
        date: new Date(cursor),
        isCurrentMonth: cursor.getMonth() === month,
        isToday: isSameDay(cursor, new Date()),
        isSelected: false,
        isDisabled: false,
      })
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
    if (cursor > lastDay && weeks.length >= 4) break;
  }

  return weeks;
}
