export type IconName = "back" | "search" | "pin" | "chevron" | "calendar" | "clock" | "racket" | "home" | "bookings" | "block" | "plus" | "minus" | "check" | "info" | "star" | "light" | "car" | "drop" | "cup";

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (name) {
    case "back": return <svg {...common}><path d="M9.5 5.5 16 12l-6.5 6.5" /></svg>;
    case "search": return <svg {...common}><circle cx="11" cy="11" r="6.8" /><path d="m20 20-4.2-4.2" /></svg>;
    case "pin": return <svg {...common}><path d="M12 21s6.5-5.4 6.5-10.6a6.5 6.5 0 0 0-13 0C5.5 15.6 12 21 12 21Z" /><circle cx="12" cy="10.2" r="2.4" /></svg>;
    case "chevron": return <svg {...common}><path d="m6.5 9.5 5.5 5.5 5.5-5.5" /></svg>;
    case "calendar": return <svg {...common}><path d="M4.2 9.2h15.6M7.8 3.6v3M16.2 3.6v3" /><rect x="4.2" y="5.4" width="15.6" height="14.4" rx="2.6" /></svg>;
    case "clock": return <svg {...common}><circle cx="12" cy="12" r="8.4" /><path d="M12 7.7v4.8l3.2 2" /></svg>;
    case "racket": return <svg {...common}><path d="M10.6 3.2c3.4 0 6 2.9 6 6.4s-2.6 6.4-6 6.4-6-2.9-6-6.4 2.6-6.4 6-6.4Z" /><path d="m14.9 14.4 4.7 5.6M12.6 15.6l1.6 1.9" /></svg>;
    case "home": return <svg {...common}><path d="m4 10 8-6.5 8 6.5v9.2H7V10" /><path d="M10 19v-5h4v5" /></svg>;
    case "bookings": return <svg {...common}><rect x="4" y="5.5" width="16" height="14" rx="2.5" /><path d="M8 3.5v4M16 3.5v4M4 10h16M8 14h3" /></svg>;
    case "block": return <svg {...common}><circle cx="12" cy="12" r="8.4" /><path d="m6.1 17.9 11.8-11.8" /></svg>;
    case "plus": return <svg {...common}><path d="M12 5.6v12.8M5.6 12h12.8" /></svg>;
    case "minus": return <svg {...common}><path d="M5.6 12h12.8" /></svg>;
    case "check": return <svg {...common}><path d="m5.5 12.6 4.4 4.4 8.6-9.6" /></svg>;
    case "info": return <svg {...common}><circle cx="12" cy="12" r="8.6" /><path d="M12 11.2v5M12 7.9v.3" /></svg>;
    case "star": return <svg {...common} fill="currentColor" stroke="none"><path d="m12 3.6 2.66 5.39 5.95.87-4.3 4.19 1.01 5.93L12 17.18l-5.32 2.8 1.02-5.93-4.31-4.19 5.95-.87Z" /></svg>;
    case "light": return <svg {...common}><path d="M9.4 18.4h5.2M10.4 21h3.2M12 3a6 6 0 0 0-3.4 10.9c.5.4.8 1 .8 1.6v.4h5.2v-.4c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3Z" /></svg>;
    case "car": return <svg {...common}><path d="m4.2 13.2 1.6-4.4a2 2 0 0 1 1.9-1.4h8.6a2 2 0 0 1 1.9 1.4l1.6 4.4v3.6H4.2v-3.6ZM4.2 13.2h15.6M6.6 16.8v1.8M17.4 16.8v1.8" /></svg>;
    case "drop": return <svg {...common}><path d="M12 3.4s5.4 5.5 5.4 9.1a5.4 5.4 0 0 1-10.8 0C6.6 8.9 12 3.4 12 3.4Z" /></svg>;
    case "cup": return <svg {...common}><path d="M6 4h12l-1.3 10H7.3L6 4ZM9 18h6M10 14v4M14 14v4" /></svg>;
  }
}
