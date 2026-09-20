import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from "react";
import type { AvailabilityBlock, Booking, DemoState, NewBlockInput, NewBookingInput, OwnerSetupDraft } from "../data/model";
import { loadState, resetStoredState, saveState, STORAGE_KEY } from "../data/storage";
import { addHour } from "../domain/dates";
import { isCourtAvailable } from "../domain/availability";
import { calculatePrice } from "../domain/pricing";

type Action =
  | { type: "hydrate"; state: DemoState }
  | { type: "draft"; patch: Partial<OwnerSetupDraft> }
  | { type: "commit-setup" }
  | { type: "add-booking"; booking: Booking }
  | { type: "mark-paid"; bookingId: string }
  | { type: "cancel"; bookingId: string }
  | { type: "add-block"; block: AvailabilityBlock };

function reducer(state: DemoState, action: Action): DemoState {
  switch (action.type) {
    case "hydrate":
      return action.state;
    case "draft":
      return { ...state, onboardingDraft: { ...state.onboardingDraft, ...action.patch } };
    case "commit-setup": {
      const draft = state.onboardingDraft;
      const ownerClub = state.clubs.find((club) => club.ownerId === state.owner.id);
      if (!ownerClub) return state;
      const activeCourtIds = Array.from({ length: draft.courtCount }, (_, index) => `${ownerClub.id}-${index + 1}`);
      const knownIds = new Set(state.courts.filter((court) => court.clubId === ownerClub.id).map((court) => court.id));
      const addedCourts = activeCourtIds
        .filter((id) => !knownIds.has(id))
        .map((id, index) => ({ id, clubId: ownerClub.id, name: `ملعب ${Number(id.split("-").at(-1)) || index + 1}`, active: true }));
      const courts = [...state.courts, ...addedCourts].map((court) =>
        court.clubId === ownerClub.id ? { ...court, active: activeCourtIds.includes(court.id) } : court,
      );
      const clubs = state.clubs.map((club) =>
        club.id === ownerClub.id
          ? {
              ...club,
              name: draft.clubName.trim(),
              area: draft.area,
              courtType: draft.courtType,
              artwork: draft.courtType,
              hourlyRate: draft.hourlyRate,
              openingTime: draft.openingTime,
              closingTime: draft.closingTime,
              workingDays: [...draft.workingDays].sort(),
              activeCourtIds,
            }
          : club,
      );
      return { ...state, clubs, courts };
    }
    case "add-booking":
      return { ...state, bookings: [...state.bookings, action.booking] };
    case "mark-paid":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.bookingId ? { ...booking, clubPaidAmount: booking.courtSubtotal } : booking,
        ),
      };
    case "cancel":
      return {
        ...state,
        bookings: state.bookings.map((booking) =>
          booking.id === action.bookingId ? { ...booking, status: "cancelled" } : booking,
        ),
      };
    case "add-block":
      return { ...state, availabilityBlocks: [...state.availabilityBlocks, action.block] };
    default:
      return state;
  }
}

type DemoContextValue = {
  state: DemoState;
  toast: string | null;
  showToast: (message: string) => void;
  updateDraft: (patch: Partial<OwnerSetupDraft>) => void;
  commitOwnerSetup: () => void;
  createBooking: (input: NewBookingInput) => { booking?: Booking; error?: string };
  markBookingPaid: (bookingId: string) => void;
  cancelBooking: (bookingId: string) => void;
  addAvailabilityBlock: (input: NewBlockInput) => void;
  resetDemo: () => void;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) dispatch({ type: "hydrate", state: loadState() });
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const showToast = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  }, []);

  const updateDraft = useCallback((patch: Partial<OwnerSetupDraft>) => dispatch({ type: "draft", patch }), []);
  const commitOwnerSetup = useCallback(() => dispatch({ type: "commit-setup" }), []);

  const createBooking = useCallback(
    (input: NewBookingInput) => {
      const club = state.clubs.find((item) => item.id === input.clubId);
      const court = state.courts.find((item) => item.id === input.courtId && item.active);
      if (!club || !court || !isCourtAvailable(state, club, court.id, input.date, input.startTime)) {
        return { error: "المعاد ده مبقاش متاح. اختار معاد تاني." };
      }
      const price = calculatePrice(club.hourlyRate);
      const id = crypto.randomUUID();
      const digits = id.replace(/\D/g, "").padEnd(5, "7").slice(0, 5);
      const booking: Booking = {
        id,
        referenceCode: `PE-${digits}`,
        clubId: club.id,
        courtId: court.id,
        player: state.player,
        date: input.date,
        startTime: input.startTime,
        endTime: addHour(input.startTime),
        ...price,
        paymentMethod: input.paymentMethod,
        clubPaidAmount: input.paymentMethod === "card" ? price.courtSubtotal : 0,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: "add-booking", booking });
      return { booking };
    },
    [state],
  );

  const markBookingPaid = useCallback((bookingId: string) => dispatch({ type: "mark-paid", bookingId }), []);
  const cancelBooking = useCallback((bookingId: string) => dispatch({ type: "cancel", bookingId }), []);
  const addAvailabilityBlock = useCallback(
    (input: NewBlockInput) => {
      const ownerClub = state.clubs.find((club) => club.ownerId === state.owner.id);
      if (!ownerClub) return;
      dispatch({
        type: "add-block",
        block: { ...input, id: crypto.randomUUID(), clubId: ownerClub.id, createdAt: new Date().toISOString() },
      });
    },
    [state.clubs, state.owner.id],
  );
  const resetDemo = useCallback(() => dispatch({ type: "hydrate", state: resetStoredState() }), []);

  const value = useMemo(
    () => ({ state, toast, showToast, updateDraft, commitOwnerSetup, createBooking, markBookingPaid, cancelBooking, addAvailabilityBlock, resetDemo }),
    [state, toast, showToast, updateDraft, commitOwnerSetup, createBooking, markBookingPaid, cancelBooking, addAvailabilityBlock, resetDemo],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used inside DemoProvider");
  return value;
}
