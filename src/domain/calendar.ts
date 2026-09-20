import type { Booking, Club, Court } from "../data/model";
import { bookingDateTime } from "./dates";

function icsDate(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeIcs(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export function downloadBookingCalendar(booking: Booking, club: Club, court: Court): void {
  const start = bookingDateTime(booking.date, booking.startTime);
  const end = bookingDateTime(booking.date, booking.endTime);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Padel Egypt//Demo//AR",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${booking.id}@padel-egypt.demo`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${escapeIcs(`حجز بادل — ${club.name}`)}`,
    `LOCATION:${escapeIcs(club.area)}`,
    `DESCRIPTION:${escapeIcs(`${court.name} · رقم الحجز ${booking.referenceCode}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `padel-egypt-${booking.referenceCode}.ics`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
