import { Link } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { OwnerBookingRow } from "../../components/Common";
import { Icon } from "../../components/Icon";
import { MobileShell } from "../../components/MobileShell";
import { capacityForDate } from "../../domain/availability";
import { monthlyMetrics, ownerBookingsForTab } from "../../domain/bookings";
import { formatNumber, formatShortDate, todayISO } from "../../domain/dates";

export function OwnerDashboardScreen() {
  const { state } = useDemo();
  const club = state.clubs.find((item) => item.ownerId === state.owner.id)!;
  const today = todayISO();
  const todayBookings = ownerBookingsForTab(state, club.id, "today").filter((booking) => booking.status === "confirmed");
  const capacity = capacityForDate(state, club, today);
  const metrics = monthlyMetrics(state, club.id);
  return (
    <MobileShell>
      <div className="page-pad dashboard-page">
        <div className="dashboard-heading"><div><h1>صباح الخير يا {state.owner.name}</h1><p>{formatShortDate(today)}</p></div><Link className="icon-button" to="/" aria-label="تبديل الدور"><Icon name="home" /></Link></div>
        <div className="metric-grid">
          <article><span>حجوزات<br />النهاردة</span><strong>{formatNumber(todayBookings.length)}</strong><small>من {formatNumber(capacity)} معاد</small></article>
          <article><span>إيراد<br />الشهر</span><strong className="primary-text">{formatNumber(metrics.revenue)}</strong><small>جنيه</small></article>
          <article><span>مبالغ<br />مستحقة</span><strong className="danger-text">{formatNumber(metrics.outstanding)}</strong><small>جنيه</small></article>
        </div>
        <div className="section-heading"><h2>جدول النهاردة</h2><Link to="/owner/bookings?tab=today">شوف الكل</Link></div>
        <section className="booking-list-card">{todayBookings.slice(0, 5).map((booking) => <OwnerBookingRow key={booking.id} booking={booking} court={state.courts.find((court) => court.id === booking.courtId)} to={`/owner/bookings/${booking.id}`} />)}{!todayBookings.length && <p className="list-empty">مفيش حجوزات النهاردة.</p>}</section>
        <Link className="floating-action" to="/owner/availability/block"><Icon name="block" size={18} />اقفل مواعيد</Link>
      </div>
    </MobileShell>
  );
}
