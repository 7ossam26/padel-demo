import type { CourtType } from "../data/model";

export function CourtArtwork({ type, className = "" }: { type: CourtType; className?: string }) {
  const indoor = type === "indoor";
  return (
    <svg className={`court-artwork ${className}`.trim()} viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label={indoor ? "رسم ملعب بادل مغطى" : "رسم ملعب بادل مكشوف"}>
      <rect width="400" height="200" fill={indoor ? "#0F3468" : "#C7D9F5"} />
      {indoor ? (
        <>
          <path d="M0 22h400M0 42h400M0 62h400" stroke="#1F6FEB" strokeWidth="2" opacity=".55" />
          <rect x="86" y="14" width="64" height="7" rx="3.5" fill="#EAF1FD" opacity=".85" />
          <rect x="250" y="14" width="64" height="7" rx="3.5" fill="#EAF1FD" opacity=".85" />
        </>
      ) : (
        <>
          <circle cx="330" cy="34" r="16" fill="#EAF1FD" opacity=".75" />
          <path d="M22 46c0-6 5-10 11-10 3-7 13-8 17-2 6-1 11 3 11 8 0 2-1 4-2 4H24c-1 0-2-2-2-4Z" fill="#EAF1FD" opacity=".8" />
        </>
      )}
      <rect y="70" width="400" height="130" fill={indoor ? "#123F79" : "#17529E"} />
      <path d="M104 78V14M296 78V14" stroke="#0F3468" strokeWidth="3" opacity=".55" />
      <rect x="95" y="8" width="18" height="7" rx="2" fill="#EAF1FD" opacity=".7" />
      <rect x="287" y="8" width="18" height="7" rx="2" fill="#EAF1FD" opacity=".7" />
      <path d="M30 200 120 78h160l90 122Z" fill="#1F6FEB" />
      <rect x="120" y="26" width="160" height="52" fill="#FFF" fillOpacity=".16" stroke="#EAF1FD" strokeWidth="2" />
      <path d="M160 26v52M200 26v52M240 26v52" stroke="#EAF1FD" strokeWidth="1.4" opacity=".65" />
      <path d="M56.6 164h286.8M200 164v36M30 200 120 78M370 200 280 78" stroke="#EAF1FD" strokeWidth="2" opacity=".75" />
      <path d="M81 113h238v18H81Z" fill="#0F3468" fillOpacity=".42" />
      <path d="M81 113h238M81 113v20M319 113v20" stroke="#EAF1FD" strokeWidth="2.5" />
    </svg>
  );
}
