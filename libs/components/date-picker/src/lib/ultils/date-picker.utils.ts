import type { DateFormat } from '../date-picker.types'

const TOKEN_LENGTH: Record<string, number> = { DD: 2, MM: 2, YYYY: 4 };

/**
 * Strips non-digit characters and re-applies date separators according to the format.
 * e.g. "12052026" with "DD/MM/YYYY" → "12/05/2026"
 */
export function autoFormatDateInput(raw: string, format: DateFormat): string {
  const digits = raw.replace(/\D/g, '');
  const separator = format.includes('/') ? '/' : '-';
  const tokens = format.split(separator);

  let result = '';
  let offset = 0;

  for (let i = 0; i < tokens.length; i++) {
    const len = TOKEN_LENGTH[tokens[i]];
    const part = digits.slice(offset, offset + len);
    if (!part) break;
    if (i > 0) result += separator;
    result += part;
    offset += len;
  }

  return result;
}

/**
 * Given the cursor position in the raw (pre-format) string,
 * returns the equivalent cursor position in the formatted string.
 */
export function mapCursorToFormatted(raw: string, cursorPos: number, formatted: string): number {
  const digitsBeforeCursor = raw.slice(0, cursorPos).replace(/\D/g, '').length;
  let digitCount = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i])) {
      digitCount++;
      if (digitCount === digitsBeforeCursor) return i + 1;
    }
  }
  return formatted.length;
}
