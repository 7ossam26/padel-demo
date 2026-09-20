const ARABIC_DAYS = ["أحد", "اتنين", "تلات", "أربع", "خميس", "جمعة", "سبت"];

export function toLocalISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayISO(): string {
  return toLocalISO(new Date());
}

export function parseLocalDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(value: string | Date, amount: number): string {
  const date = typeof value === "string" ? parseLocalDate(value) : new Date(value);
  date.setDate(date.getDate() + amount);
  return toLocalISO(date);
}

export function weekday(value: string): number {
  return parseLocalDate(value).getDay();
}

export function shortWeekday(value: string): string {
  return ARABIC_DAYS[weekday(value)];
}

export function formatShortDate(value: string, includeYear = false): string {
  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    weekday: "long",
    day: "numeric",
    month: "long",
    ...(includeYear ? { year: "numeric" as const } : {}),
  }).format(parseLocalDate(value));
}

export function formatDayMonth(value: string): string {
  return new Intl.DateTimeFormat("ar-EG-u-nu-latn", {
    day: "numeric",
    month: "long",
  }).format(parseLocalDate(value));
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ar-EG-u-nu-latn").format(value);
}

export function timeToMinutes(value: string): number {
  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(value: number): string {
  const hours = Math.floor(value / 60);
  const minutes = value % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function addHour(time: string): string {
  return minutesToTime(timeToMinutes(time) + 60);
}

export function bookingDateTime(date: string, time: string): Date {
  const result = parseLocalDate(date);
  const [hours, minutes] = time.split(":").map(Number);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

export function isBookingPast(date: string, endTime: string, now = new Date()): boolean {
  return bookingDateTime(date, endTime).getTime() <= now.getTime();
}

export function isTimePast(date: string, startTime: string, now = new Date()): boolean {
  return bookingDateTime(date, startTime).getTime() <= now.getTime();
}

export function dateRangeLabel(startDate: string, endDate: string): string {
  return startDate === endDate
    ? formatDayMonth(startDate)
    : `${formatDayMonth(startDate)} لـ ${formatDayMonth(endDate)}`;
}

export function overlaps(startA: string, endA: string, startB: string, endB: string): boolean {
  return timeToMinutes(startA) < timeToMinutes(endB) && timeToMinutes(startB) < timeToMinutes(endA);
}
