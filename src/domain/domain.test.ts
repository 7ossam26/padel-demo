import { describe, expect, it } from "vitest";
import { createSeed } from "../data/seed";
import { getSlotOptions, isCourtAvailable } from "./availability";
import { bookingPaymentStatus } from "./bookings";
import { addDays, overlaps, weekday } from "./dates";
import { calculatePrice } from "./pricing";

const ANCHOR = "2099-09-20";

describe("booking and availability domain", () => {
  it("calculates the captured court price and service fee", () => {
    expect(calculatePrice(350)).toEqual({
      courtSubtotal: 350,
      serviceFee: 20,
      customerTotal: 370,
    });
  });

  it("uses half-open time ranges for overlap checks", () => {
    expect(overlaps("13:00", "14:00", "13:30", "14:30")).toBe(true);
    expect(overlaps("13:00", "14:00", "14:00", "15:00")).toBe(false);
  });

  it("closes the seeded owner's omitted working day", () => {
    const state = createSeed(ANCHOR);
    const club = state.clubs.find((item) => item.id === "padel-zone")!;
    const tomorrow = addDays(ANCHOR, 1);

    expect(club.workingDays).not.toContain(weekday(tomorrow));
    expect(getSlotOptions(state, club, tomorrow).every((slot) => !slot.available && slot.reason === "closed")).toBe(true);
  });

  it("applies a partial block only to its court and hours", () => {
    const state = createSeed(ANCHOR);
    const club = state.clubs.find((item) => item.id === "padel-zone")!;
    const date = addDays(ANCHOR, 2);

    expect(isCourtAvailable(state, club, "padel-zone-1", date, "13:00")).toBe(false);
    expect(isCourtAvailable(state, club, "padel-zone-1", date, "14:00")).toBe(false);
    expect(isCourtAvailable(state, club, "padel-zone-1", date, "15:00")).toBe(true);
    expect(isCourtAvailable(state, club, "padel-zone-2", date, "13:00")).toBe(true);
  });

  it("applies a full-day block without affecting another court", () => {
    const state = createSeed(ANCHOR);
    const club = state.clubs.find((item) => item.id === "padel-zone")!;
    const date = addDays(ANCHOR, 3);
    state.availabilityBlocks.push({
      id: "test-full-day",
      clubId: club.id,
      courtId: "padel-zone-1",
      startDate: date,
      endDate: date,
      allDay: true,
      createdAt: `${ANCHOR}T10:00:00`,
    });

    expect(isCourtAvailable(state, club, "padel-zone-1", date, "12:00")).toBe(false);
    expect(isCourtAvailable(state, club, "padel-zone-2", date, "12:00")).toBe(true);
  });

  it("enforces the opening and closing hour boundaries", () => {
    const state = createSeed(ANCHOR);
    const club = state.clubs.find((item) => item.id === "padel-zone")!;
    const date = addDays(ANCHOR, 3);

    expect(isCourtAvailable(state, club, "padel-zone-1", date, "07:00")).toBe(false);
    expect(isCourtAvailable(state, club, "padel-zone-1", date, "22:00")).toBe(true);
    expect(isCourtAvailable(state, club, "padel-zone-1", date, "23:00")).toBe(false);
  });

  it("prevents the demo player from holding the same club slot twice", () => {
    const state = createSeed(ANCHOR);
    const club = state.clubs.find((item) => item.id === "smash-club")!;
    const date = addDays(ANCHOR, 3);

    expect(isCourtAvailable(state, club, "smash-club-2", date, "20:00")).toBe(false);
    expect(getSlotOptions(state, club, date).find((slot) => slot.time === "20:00")?.reason).toBe("duplicate");
  });

  it("releases a court when its booking is cancelled", () => {
    const state = createSeed(ANCHOR);
    const club = state.clubs.find((item) => item.id === "smash-club")!;
    const date = addDays(ANCHOR, 3);
    state.bookings = state.bookings.map((booking) =>
      booking.id === "seed-201" ? { ...booking, status: "cancelled" as const } : booking,
    );

    expect(isCourtAvailable(state, club, "smash-club-1", date, "20:00")).toBe(true);
  });

  it("derives unpaid, partial, and paid owner states", () => {
    const state = createSeed(ANCHOR);
    expect(bookingPaymentStatus(state.bookings.find((item) => item.id === "seed-104")!)).toBe("unpaid");
    expect(bookingPaymentStatus(state.bookings.find((item) => item.id === "seed-102")!)).toBe("partial");
    expect(bookingPaymentStatus(state.bookings.find((item) => item.id === "seed-101")!)).toBe("paid");
  });

  it("keeps an existing booking's captured price when club pricing changes", () => {
    const state = createSeed(ANCHOR);
    const booking = state.bookings.find((item) => item.id === "seed-201")!;
    state.clubs = state.clubs.map((club) => (club.id === "smash-club" ? { ...club, hourlyRate: 600 } : club));

    expect(booking.courtSubtotal).toBe(420);
    expect(booking.customerTotal).toBe(440);
  });
});
