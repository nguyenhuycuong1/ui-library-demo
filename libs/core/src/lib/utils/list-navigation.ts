export type ListItem = { disabled?: boolean };

/**
 * Returns the next non-disabled index in a circular list, wrapping at both ends.
 * Returns `current` unchanged when all items are disabled.
 */
export function navigateListIndex(
  items: readonly ListItem[],
  current: number,
  direction: 1 | -1,
): number {
  const len = items.length;
  if (!len) return current;
  const start = current < 0 ? (direction === 1 ? -1 : len) : current;
  for (let i = 1; i <= len; i++) {
    const next = ((start + direction * i) % len + len) % len;
    if (!items[next].disabled) return next;
  }
  return current;
}

/** Returns the index of the first non-disabled item, or -1 if none. */
export function firstEnabledIndex(items: readonly ListItem[]): number {
  return items.findIndex(o => !o.disabled);
}

/** Returns the index of the last non-disabled item, or -1 if none. */
export function lastEnabledIndex(items: readonly ListItem[]): number {
  for (let i = items.length - 1; i >= 0; i--) {
    if (!items[i].disabled) return i;
  }
  return -1;
}
