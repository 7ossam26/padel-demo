import { Link, useParams } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { BottomAction } from "../../components/BottomAction";
import { Icon } from "../../components/Icon";
import { MobileShell } from "../../components/MobileShell";
import { downloadBookingCalendar } from "../../domain/calendar";
import { findClub, findCourt } from "../../domain/bookings";
import { formatNumber, formatShortDate } from "../../domain/dates";
import { NotFoundScreen } from "../shared/NotFoundScreen";

export function ConfirmationScreen() {
  const { bookingId } = useParams();
  const { state, showToast } = useDemo();
  const booking = state.bookings.find((item) => item.id === bookingId);
  const club = booking ? findClub(state, booking.clubId) : undefined;
  const court = booking ? findCourt(state, booking.courtId) : undefined;
  if (!booking || !club || !court) return <NotFoundScreen message="الحجز ده مش موجود" to="/player/bookings" />;
  const addCalendar = () => {
    downloadBookingCalendar(booking, club, court);
    showToast("نزّلنا ملف التقويم");
  };
  return (
    <MobileShell className="confirmation-screen screen-column">
      <div className="confirmation-content">
        <span className="success-icon"><Icon name="check" size={46} /></span>
        <h1>تم تأكيد الحجز</h1>
        <p>{booking.paymentMethod === "card" ? "الدفع التجريبي تم بنجاح، والتفاصيل محفوظة عندك." : "الحجز اتسجل، والدفع هيكون في النادي."}</p>
        <section className="summary-card confirmation-card">
          <div><span>رقم الحجز</span><strong className="ltr">{booking.referenceCode}</strong></div><hr />
          <div><span>الملعب</span><strong>{club.name}</strong></div>
          <div><span>التاريخ</span><strong>{formatShortDate(booking.date, true)}</strong></div>
          <div><span>الميعاد</span><strong className="ltr">{booking.startTime} – {booking.endTime}</strong></div>
          <div><span>{booking.paymentMethod === "card" ? "المدفوع" : "المطلوب في النادي"}</span><strong className={booking.paymentMethod === "card" ? "success-text" : ""}>{formatNumber(booking.customerTotal)} جنيه</strong></div>
        </section>
      </div>
      <BottomAction><button className="calendar-action" type="button" onClick={addCalendar}><Icon name="calendar" size={18} />ضيفه على التقويم</button><Link className="button button-primary" to="/player/bookings">حجوزاتي</Link></BottomAction>
    </MobileShell>
  );
}
