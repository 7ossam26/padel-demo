export type CourtType = "indoor" | "outdoor";
export type PaymentMethod = "card" | "venue";
export type BookingStatus = "confirmed" | "cancelled";

export type Person = {
  id: string;
  name: string;
  phone: string;
};

export type OwnerSetupDraft = {
  clubName: string;
  area: string;
  courtType: CourtType;
  courtCount: number;
  hourlyRate: number;
  openingTime: string;
  closingTime: string;
  workingDays: number[];
};

export type Club = {
  id: string;
  ownerId?: string;
  name: string;
  area: string;
  courtType: CourtType;
  hourlyRate: number;
  openingTime: string;
  closingTime: string;
  workingDays: number[];
  activeCourtIds: string[];
  distanceKm: number;
  rating: number;
  reviewCount: number;
  amenities: string[];
  description: string;
  artwork: CourtType;
};

export type Court = {
  id: string;
  clubId: string;
  name: string;
  active: boolean;
};

export type Booking = {
  id: string;
  referenceCode: string;
  clubId: string;
  courtId: string;
  player: Person;
  date: string;
  startTime: string;
  endTime: string;
  courtSubtotal: number;
  serviceFee: number;
  customerTotal: number;
  paymentMethod: PaymentMethod;
  clubPaidAmount: number;
  status: BookingStatus;
  createdAt: string;
};

export type AvailabilityBlock = {
  id: string;
  clubId: string;
  courtId: string;
  startDate: string;
  endDate: string;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  reason?: string;
  createdAt: string;
};

export type DemoState = {
  schemaVersion: 1;
  seedAnchorDate: string;
  owner: Person;
  player: Person;
  clubs: Club[];
  courts: Court[];
  bookings: Booking[];
  availabilityBlocks: AvailabilityBlock[];
  onboardingDraft: OwnerSetupDraft;
};

export type NewBookingInput = {
  clubId: string;
  courtId: string;
  date: string;
  startTime: string;
  paymentMethod: PaymentMethod;
};

export type NewBlockInput = Omit<AvailabilityBlock, "id" | "createdAt" | "clubId">;
