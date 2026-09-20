import type { Booking, Club, Court, DemoState } from "../data/model";
import { bookingDateTime, isBookingPast, todayISO } from "./dates";

export function bookingPaymentStatus(booking: Booking): "paid" | "partial" | "unpaid" {
  if (booking.clubPaidAmount >= booking.courtSubtotal) return "paid";
  if (booking.clubPaidAmount > 0) return "partial";
  return "unpaid";
}

export function findClub(state: DemoState, clubId: string | undefined): Club | undefined {
  return state.clubs.find((club) => club.id === clubId);
}

export function findCourt(state: DemoState, courtId: string | undefined): Court | undefined {
  return state.courts.find((court) => court.id === courtId);
}

export function playerBookings(state: DemoState): Booking[] {
  return state.bookings
    .filter((booking) => booking.player.id === state.player.id)
    .sort((a, b) => bookingDateTime(a.date, a.startTime).getTime() - bookingDateTime(b.date, b.startTime).getTime());
}

export function isUpcoming(booking: Booking): boolean {
  return !isBookingPast(booking.date, booking.endTime);
}

export function ownerBookingsForTab(state: DemoState, clubId: string, tab: "today" | "upcoming" | "past"): Booking[] {
  const today = todayISO();
  return state.bookings
    .filter((booking) => booking.clubId === clubId)
    .filter((booking) => {
      if (tab === "today") return booking.date === today;
      if (tab === "upcoming") return booking.date > today;
      return booking.date < today;
    })
    .sort((a, b) => {
      const delta = bookingDateTime(a.date, a.startTime).getTime() - bookingDateTime(b.date, b.startTime).getTime();
      return tab === "past" ? -delta : delta;
    });
}

export function monthlyMetrics(state: DemoState, clubId: string) {
  const month = todayISO().slice(0, 7);
  const bookings = state.bookings.filter((booking) => booking.clubId === clubId && booking.status === "confirmed" && booking.date.startsWith(month));
  return {
    revenue: bookings.reduce((sum, booking) => sum + booking.clubPaidAmount, 0),
    outstanding: bookings.reduce((sum, booking) => sum + Math.max(0, booking.courtSubtotal - booking.clubPaidAmount), 0),
  };
}
