import type { DemoState } from "./model";
import { createSeed } from "./seed";

export const STORAGE_KEY = "padel-egypt-demo:v1";

function isDemoState(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") return false;
  const state = value as Partial<DemoState>;
  return (
    state.schemaVersion === 1 &&
    typeof state.seedAnchorDate === "string" &&
    !!state.owner?.id &&
    !!state.player?.id &&
    !!state.onboardingDraft &&
    Array.isArray(state.clubs) &&
    Array.isArray(state.courts) &&
    Array.isArray(state.bookings) &&
    Array.isArray(state.availabilityBlocks)
  );
}

export function loadState(): DemoState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeed();
    const parsed: unknown = JSON.parse(raw);
    return isDemoState(parsed) ? parsed : createSeed();
  } catch {
    return createSeed();
  }
}

export function saveState(state: DemoState): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetStoredState(): DemoState {
  window.localStorage.removeItem(STORAGE_KEY);
  const state = createSeed();
  saveState(state);
  return state;
}
