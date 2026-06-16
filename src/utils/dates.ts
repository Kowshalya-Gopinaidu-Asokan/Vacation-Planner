export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(dateStr: string): string {
  return parseDate(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function isUpcoming(endDate: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parseDate(endDate) >= today;
}

export function isCompleted(endDate: string): boolean {
  return !isUpcoming(endDate);
}

export function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = parseDate(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function tripDuration(startDate: string, endDate: string): number {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
}

export function sortTripsByStartDate<T extends { startDate: string }>(trips: T[]): T[] {
  return [...trips].sort(
    (a, b) => parseDate(a.startDate).getTime() - parseDate(b.startDate).getTime(),
  );
}
