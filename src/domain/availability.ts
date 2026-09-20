import type { Club, DemoState } from "../data/model";
import { addHour, isTimePast, minutesToTime, overlaps, timeToMinutes, weekday } from "./dates";

export type SlotOption = {
  time: string;
  endTime: string;
  available: boolean;
  courtId?: string;
  reason?: "closed" | "past" | "booked" | "blocked" | "duplicate";
};

function blockCoversSlot(
  state: DemoState,
  courtId: string,
  date: string,
  startTime: string,
  endTime: string,
): boolean {
  return state.availabilityBlocks.some((block) => {
    if (block.courtId !== courtId || date < block.startDate || date > block.endDate) return false;
    return block.allDay || (!!block.startTime && !!block.endTime && overlaps(startTime, endTime, block.startTime, block.endTime));
  });
}

function bookingCoversSlot(
  state: DemoState,
  courtId: string,
  date: string,
  startTime: string,
  endTime: string,
): boolean {
  return state.bookings.some(
    (booking) =>
      booking.status === "confirmed" &&
      booking.courtId === courtId &&
      booking.date === date &&
      overlaps(startTime, endTime, booking.startTime, booking.endTime),
  );
}

export function hasPlayerDuplicate(state: DemoState, clubId: string, date: string, startTime: string): boolean {
  return state.bookings.some(
    (booking) =>
      booking.status === "confirmed" &&
      booking.player.id === state.player.id &&
      booking.clubId === clubId &&
      booking.date === date &&
      booking.startTime === startTime,
  );
}

export function isCourtAvailable(
  state: DemoState,
  club: Club,
  courtId: string,
  date: string,
  startTime: string,
): boolean {
  const endTime = addHour(startTime);
  if (!club.workingDays.includes(weekday(date))) return false;
  if (timeToMinutes(startTime) < timeToMinutes(club.openingTime) || timeToMinutes(endTime) > timeToMinutes(club.closingTime)) return false;
  if (isTimePast(date, startTime)) return false;
  if (hasPlayerDuplicate(state, club.id, date, startTime)) return false;
  if (bookingCoversSlot(state, courtId, date, startTime, endTime)) return false;
  if (blockCoversSlot(state, courtId, date, startTime, endTime)) return false;
  return true;
}

export function getSlotOptions(state: DemoState, club: Club, date: string): SlotOption[] {
  const result: SlotOption[] = [];
  const start = timeToMinutes(club.openingTime);
  const end = timeToMinutes(club.closingTime);
  const activeCourtIds = club.activeCourtIds.filter((id) => state.courts.some((court) => court.id === id && court.active));
  const closed = !club.workingDays.includes(weekday(date));

  for (let value = start; value + 60 <= end; value += 60) {
    const time = minutesToTime(value);
    const endTime = minutesToTime(value + 60);
    if (closed) {
      result.push({ time, endTime, available: false, reason: "closed" });
      continue;
    }
    if (isTimePast(date, time)) {
      result.push({ time, endTime, available: false, reason: "past" });
      continue;
    }
    if (hasPlayerDuplicate(state, club.id, date, time)) {
      result.push({ time, endTime, available: false, reason: "duplicate" });
      continue;
    }
    const courtId = activeCourtIds.find((id) => !bookingCoversSlot(state, id, date, time, endTime) && !blockCoversSlot(state, id, date, time, endTime));
    result.push({ time, endTime, available: !!courtId, courtId, reason: courtId ? undefined : "booked" });
  }
  return result;
}

export function firstAvailableDate(state: DemoState, club: Club, dates: string[]): string {
  return dates.find((date) => getSlotOptions(state, club, date).some((slot) => slot.available)) ?? dates[0];
}

export function capacityForDate(state: DemoState, club: Club, date: string): number {
  if (!club.workingDays.includes(weekday(date))) return 0;
  let capacity = 0;
  const start = timeToMinutes(club.openingTime);
  const end = timeToMinutes(club.closingTime);
  for (const courtId of club.activeCourtIds) {
    for (let value = start; value + 60 <= end; value += 60) {
      const slotStart = minutesToTime(value);
      const slotEnd = minutesToTime(value + 60);
      if (!blockCoversSlot(state, courtId, date, slotStart, slotEnd)) capacity += 1;
    }
  }
  return capacity;
}
