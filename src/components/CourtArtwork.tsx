import type { CourtType } from "../data/model";

const courtImages: Record<string, string> = {
  "padel-zone": "/assets/courts/padel-zone.webp",
  "smash-club": "/assets/courts/smash-club.webp",
  "court-6": "/assets/courts/court-6.webp",
};

const fallbackImages: Record<CourtType, string> = {
  indoor: courtImages["smash-club"],
  outdoor: courtImages["padel-zone"],
};

type CourtArtworkProps = {
  type: CourtType;
  clubId?: string;
  className?: string;
  priority?: boolean;
};

export function CourtArtwork({ type, clubId, className = "", priority = false }: CourtArtworkProps) {
  const src = (clubId && courtImages[clubId]) || fallbackImages[type];
  const courtLabel = type === "indoor" ? "مغطى" : "مكشوف";

  return (
    <img
      className={`court-artwork ${className}`.trim()}
      src={src}
      alt={`صورة ملعب بادل ${courtLabel}`}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
    />
  );
}
