import { DateFormat } from '@ui/date-picker'

export function isSameDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

export function parseTimeString(timeStr: string): Date | null {
  const timePattern = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;
  const match = timeStr.match(timePattern);
  if (!match) {
    return null;
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const seconds = match[3] ? parseInt(match[3], 10) : 0;

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59 || seconds < 0 || seconds > 59) {
    return null;
  }

  const date = new Date();
  date.setHours(hours, minutes, seconds, 0);
  return date;
}

export function dateToStringWithFormat(date: Date, format: DateFormat): string {
  const map: Record<string, string> = {
    DD: String(date.getDate()).padStart(2, '0'),
    MM: String(date.getMonth() + 1).padStart(2, '0'),
    YYYY: String(date.getFullYear()),
  };
  return format.replace(/DD|MM|YYYY/g, (token) => map[token]);
}

export function stringToDateWithFormat(dateStr: string, format: DateFormat): Date | null {
  const separator = format.includes('/') ? '/' : '-';
  const formatParts = format.split(separator);
  const dateParts = dateStr.split(separator);

  if (dateParts.length !== 3) return null;

  const map: Record<string, number> = {};
  formatParts.forEach((token, i) => (map[token] = Number(dateParts[i])));

  const { DD, MM, YYYY } = map;
  if (!DD || !MM || !YYYY || isNaN(DD) || isNaN(MM) || isNaN(YYYY)) return null;

  const date = new Date(YYYY, MM - 1, DD);
  if (date.getFullYear() !== YYYY || date.getMonth() + 1 !== MM || date.getDate() !== DD) {
    return null;
  }

  return date;
}
