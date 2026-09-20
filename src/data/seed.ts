import type { AvailabilityBlock, Booking, Club, Court, DemoState, Person } from "./model";
import { addDays, addHour, parseLocalDate, todayISO } from "../domain/dates";

const SERVICE_FEE = 20;

function booking(
  id: string,
  clubId: string,
  courtId: string,
  player: Person,
  date: string,
  startTime: string,
  price: number,
  paid: number,
  method: "card" | "venue" = "venue",
): Booking {
  return {
    id,
    referenceCode: `PE-${id.replace(/\D/g, "").padStart(5, "4").slice(-5)}`,
    clubId,
    courtId,
    player,
    date,
    startTime,
    endTime: addHour(startTime),
    courtSubtotal: price,
    serviceFee: SERVICE_FEE,
    customerTotal: price + SERVICE_FEE,
    paymentMethod: method,
    clubPaidAmount: paid,
    status: "confirmed",
    createdAt: `${date}T09:00:00`,
  };
}

export function createSeed(anchor = todayISO()): DemoState {
  const owner: Person = { id: "owner-karim", name: "كريم", phone: "+20 100 222 1133" };
  const player: Person = { id: "player-noor", name: "نور عبدالرحمن", phone: "+20 100 482 6631" };
  const players: Person[] = [
    { id: "p-youssef", name: "يوسف هاني", phone: "+20 101 202 1133" },
    player,
    { id: "p-mariam", name: "مريم فؤاد", phone: "+20 112 551 8044" },
    { id: "p-omar", name: "عمر الليثي", phone: "+20 106 775 2291" },
    { id: "p-hesham", name: "هشام نبيل", phone: "+20 109 434 8080" },
    { id: "p-salma", name: "سلمى عزت", phone: "+20 111 314 2200" },
  ];

  const tomorrowWeekday = (parseLocalDate(anchor).getDay() + 1) % 7;
  const workingDays = [0, 1, 2, 3, 4, 5, 6].filter((day) => day !== tomorrowWeekday);

  const clubs: Club[] = [
    {
      id: "padel-zone",
      ownerId: owner.id,
      name: "بادل زون – التجمع الخامس",
      area: "التجمع الخامس",
      courtType: "outdoor",
      hourlyRate: 350,
      openingTime: "08:00",
      closingTime: "23:00",
      workingDays,
      activeCourtIds: ["padel-zone-1", "padel-zone-2"],
      distanceKm: 2.4,
      rating: 4.8,
      reviewCount: 124,
      amenities: ["إضاءة", "باركينج", "دشّات", "مضارب"],
      description: "ملعبين مكشوفين بجدران زجاج، على بعد 5 دقايق من كايرو فستيفال سيتي. الإضاءة شغالة لحد 12 بالليل، والمضارب والكور موجودة في الاستقبال.",
      artwork: "outdoor",
    },
    {
      id: "smash-club",
      name: "سماش كلوب – الشيخ زايد",
      area: "الشيخ زايد",
      courtType: "indoor",
      hourlyRate: 420,
      openingTime: "08:00",
      closingTime: "24:00",
      workingDays: [0, 1, 2, 3, 4, 5, 6],
      activeCourtIds: ["smash-club-1", "smash-club-2"],
      distanceKm: 11.8,
      rating: 4.6,
      reviewCount: 89,
      amenities: ["إضاءة", "باركينج", "كافيه", "مضارب"],
      description: "ملاعب مغطاة ومكيّفة في قلب الشيخ زايد، مع باركينج واسع وكافيه ومعدات للإيجار.",
      artwork: "indoor",
    },
    {
      id: "court-6",
      name: "كورت 6 بادل – المعادي",
      area: "المعادي",
      courtType: "outdoor",
      hourlyRate: 300,
      openingTime: "09:00",
      closingTime: "23:00",
      workingDays: [0, 1, 2, 3, 4, 5, 6],
      activeCourtIds: ["court-6-1", "court-6-2"],
      distanceKm: 5.1,
      rating: 4.7,
      reviewCount: 76,
      amenities: ["إضاءة", "باركينج", "مياه", "مضارب"],
      description: "ملعب بادل مكشوف وهادئ في المعادي، مناسب للمباريات الودية والتدريب ومتاح يومياً لحد 11 بالليل.",
      artwork: "outdoor",
    },
  ];

  const courts: Court[] = clubs.flatMap((club) =>
    club.activeCourtIds.map((id, index) => ({ id, clubId: club.id, name: `ملعب ${index + 1}`, active: true })),
  );

  const todayBookings = [
    booking("seed-101", "padel-zone", "padel-zone-1", players[0], anchor, "17:00", 350, 350, "card"),
    booking("seed-102", "padel-zone", "padel-zone-2", players[1], anchor, "18:00", 350, 175),
    booking("seed-103", "padel-zone", "padel-zone-1", players[2], anchor, "19:00", 350, 350, "card"),
    booking("seed-104", "padel-zone", "padel-zone-2", players[3], anchor, "20:00", 350, 0),
    booking("seed-105", "padel-zone", "padel-zone-1", players[4], anchor, "21:00", 350, 350, "card"),
    booking("seed-106", "padel-zone", "padel-zone-2", players[5], anchor, "22:00", 350, 350, "card"),
  ];

  const playerSamples = [
    booking("seed-201", "smash-club", "smash-club-1", player, addDays(anchor, 3), "20:00", 420, 420, "card"),
    booking("seed-202", "court-6", "court-6-1", player, addDays(anchor, 5), "19:00", 300, 0),
    booking("seed-203", "padel-zone", "padel-zone-1", player, addDays(anchor, -4), "18:00", 350, 350, "card"),
  ];

  const historyPlayers = players.filter((item) => item.id !== player.id);
  const history: Booking[] = Array.from({ length: 12 }, (_, index) => {
    const date = addDays(anchor, -(index + 1));
    const person = historyPlayers[index % historyPlayers.length];
    const courtId = index % 2 === 0 ? "padel-zone-1" : "padel-zone-2";
    const time = `${String(10 + (index % 6)).padStart(2, "0")}:00`;
    const paid = index % 4 === 0 ? 175 : 350;
    return booking(`seed-3${String(index).padStart(2, "0")}`, "padel-zone", courtId, person, date, time, 350, paid, paid === 350 ? "card" : "venue");
  });

  const availabilityBlocks: AvailabilityBlock[] = [
    {
      id: "block-seed-1",
      clubId: "padel-zone",
      courtId: "padel-zone-1",
      startDate: addDays(anchor, 2),
      endDate: addDays(anchor, 2),
      allDay: false,
      startTime: "13:00",
      endTime: "15:00",
      reason: "صيانة دورية",
      createdAt: `${anchor}T08:00:00`,
    },
  ];

  return {
    schemaVersion: 1,
    seedAnchorDate: anchor,
    owner,
    player,
    clubs,
    courts,
    bookings: [...todayBookings, ...playerSamples, ...history],
    availabilityBlocks,
    onboardingDraft: {
      clubName: clubs[0].name,
      area: clubs[0].area,
      courtType: clubs[0].courtType,
      courtCount: clubs[0].activeCourtIds.length,
      hourlyRate: clubs[0].hourlyRate,
      openingTime: clubs[0].openingTime,
      closingTime: clubs[0].closingTime,
      workingDays: clubs[0].workingDays,
    },
  };
}
