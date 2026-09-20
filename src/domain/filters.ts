import type { Club } from "../data/model";
import { weekday } from "./dates";

export type CourtFilters = {
  q: string;
  area: string;
  date: string;
  minPrice: number;
  maxPrice: number;
  courtType: "all" | "indoor" | "outdoor";
};

export function defaultFilters(date: string): CourtFilters {
  return { q: "", area: "", date, minPrice: 150, maxPrice: 800, courtType: "all" };
}

export function parseFilters(params: URLSearchParams, fallbackDate: string): CourtFilters {
  const defaults = defaultFilters(fallbackDate);
  const courtType = params.get("type");
  return {
    q: params.get("q") ?? defaults.q,
    area: params.get("area") ?? defaults.area,
    date: params.has("date") ? (params.get("date") === "all" ? "" : params.get("date") ?? "") : defaults.date,
    minPrice: Number(params.get("min")) || defaults.minPrice,
    maxPrice: Number(params.get("max")) || defaults.maxPrice,
    courtType: courtType === "indoor" || courtType === "outdoor" ? courtType : "all",
  };
}

export function filtersToParams(filters: CourtFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.area) params.set("area", filters.area);
  params.set("date", filters.date || "all");
  if (filters.minPrice !== 150) params.set("min", String(filters.minPrice));
  if (filters.maxPrice !== 800) params.set("max", String(filters.maxPrice));
  if (filters.courtType !== "all") params.set("type", filters.courtType);
  return params;
}

function normalize(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("ar");
}

export function filterClubs(clubs: Club[], filters: CourtFilters): Club[] {
  const query = normalize(filters.q);
  return clubs.filter((club) => {
    if (query && !normalize(`${club.name} ${club.area}`).includes(query)) return false;
    if (filters.area && club.area !== filters.area) return false;
    if (filters.courtType !== "all" && club.courtType !== filters.courtType) return false;
    if (club.hourlyRate < filters.minPrice || club.hourlyRate > filters.maxPrice) return false;
    if (filters.date && !club.workingDays.includes(weekday(filters.date))) return false;
    return true;
  });
}
