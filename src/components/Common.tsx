import { Link } from "react-router-dom";
import type { Booking, Club, Court } from "../data/model";
import { bookingPaymentStatus } from "../domain/bookings";
import { formatNumber, formatShortDate } from "../domain/dates";
import { CourtArtwork } from "./CourtArtwork";
import { Icon } from "./Icon";

export function BackButton({ to, label = "رجوع" }: { to: string; label?: string }) {
  return <Link className="icon-button" to={to} aria-label={label}><Icon name="back" /></Link>;
}

export function BrandMark() {
  return <span className="brand-mark"><span className="brand-icon"><Icon name="racket" size={17} /></span><span>بادل مصر</span></span>;
}

export function StatusBadge({ booking, player = false }: { booking: Booking; player?: boolean }) {
  if (booking.status === "cancelled") return <span className="status status-cancelled">ملغي</span>;
  if (player && booking.paymentMethod === "venue" && booking.clubPaidAmount === 0) return <span className="status status-neutral">الدفع في النادي</span>;
  const status = bookingPaymentStatus(booking);
  if (status === "paid") return <span className="status status-paid">مدفوع</span>;
  if (status === "partial") return <span className="status status-partial">مدفوع جزئي</span>;
  return <span className="status status-unpaid">مش مدفوع</span>;
}

export function CourtCard({ club, to }: { club: Club; to: string }) {
  return (
    <Link className="court-card" to={to}>
      <CourtArtwork type={club.artwork} />
      <span className="court-card-body">
        <span className="court-title-row"><strong>{club.name}</strong><span className="rating"><Icon name="star" size={13} /><span className="ltr">{club.rating}</span></span></span>
        <span className="court-meta">{club.area} · <span className="ltr">{club.distanceKm}</span> كم</span>
        <span className="court-price"><strong>{formatNumber(club.hourlyRate)} جنيه</strong> <small>/ للساعة</small></span>
      </span>
    </Link>
  );
}

export function OwnerBookingRow({ booking, court, to, showPrice = false }: { booking: Booking; court?: Court; to: string; showPrice?: boolean }) {
  return (
    <Link className="booking-row" to={to}>
      <span className="booking-time ltr">{booking.startTime}</span>
      <span className="booking-person"><strong>{booking.player.name}</strong>{court && <small>{court.name}</small>}<StatusBadge booking={booking} /></span>
      {showPrice && <strong className="booking-price">{formatNumber(booking.courtSubtotal)} جنيه</strong>}
    </Link>
  );
}

export function PlayerBookingCard({ booking, club }: { booking: Booking; club: Club }) {
  return (
    <article className={`player-booking-card ${booking.status === "cancelled" ? "is-cancelled" : ""}`}>
      <span className="booking-thumb"><CourtArtwork type={club.artwork} /></span>
      <span className="booking-card-copy">
        <strong>{club.name}</strong>
        <small>{formatShortDate(booking.date)} · <span className="ltr">{booking.startTime} – {booking.endTime}</span></small>
        <span className="booking-card-status"><StatusBadge booking={booking} player /><b>{formatNumber(booking.customerTotal)} جنيه</b></span>
      </span>
    </article>
  );
}
