import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { BackButton, StatusBadge } from "../../components/Common";
import { BottomAction } from "../../components/BottomAction";
import { MobileShell } from "../../components/MobileShell";
import { Modal } from "../../components/Modal";
import { bookingPaymentStatus, findCourt } from "../../domain/bookings";
import { formatNumber, formatShortDate, isBookingPast, todayISO } from "../../domain/dates";
import { NotFoundScreen } from "../shared/NotFoundScreen";

export function OwnerBookingDetailScreen() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { state, markBookingPaid, cancelBooking, showToast } = useDemo();
  const [showCancel, setShowCancel] = useState(false);
  const booking = state.bookings.find((item) => item.id === bookingId);
  const court = booking ? findCourt(state, booking.courtId) : undefined;
  if (!booking || !court) return <NotFoundScreen message="الحجز ده مش موجود" to="/owner/bookings" />;
  const balance = Math.max(0, booking.courtSubtotal - booking.clubPaidAmount);
  const paymentStatus = bookingPaymentStatus(booking);
  const past = isBookingPast(booking.date, booking.endTime);
  const markPaid = () => {
    markBookingPaid(booking.id);
    showToast("اتسجل إن الحجز مدفوع");
  };
  const cancel = () => {
    cancelBooking(booking.id);
    setShowCancel(false);
    showToast("اتلغى الحجز والمعاد بقى متاح");
    navigate(`/owner/bookings?tab=${booking.date === todayISO() ? "today" : "upcoming"}`);
  };
  return (
    <MobileShell className="screen-column">
      <div className="page-pad booking-detail-page">
        <BackButton to="/owner/bookings" />
        <div className="title-row detail-title-row"><h1 className="page-title">تفاصيل الحجز</h1><StatusBadge booking={booking} /></div>
        <section className="summary-card person-card"><span>{booking.player.name.trim().charAt(0)}</span><div><strong>{booking.player.name}</strong><small className="ltr">{booking.player.phone}</small></div></section>
        <section className="summary-card detail-data-card"><div><span>التاريخ</span><strong>{formatShortDate(booking.date, true)}</strong></div><div><span>الميعاد</span><strong className="ltr">{booking.startTime} – {booking.endTime}</strong></div><div><span>الملعب</span><strong>{court.name}</strong></div></section>
        <section className="summary-card payment-detail-card"><div className="paid-balance"><div><span>المدفوع</span><strong className="success-text">{formatNumber(booking.clubPaidAmount)} جنيه</strong></div><i /><div><span>المتبقي</span><strong className="danger-text">{formatNumber(balance)} جنيه</strong></div></div><hr /><div className="detail-total"><span>الإجمالي</span><strong>{formatNumber(booking.courtSubtotal)} جنيه</strong></div></section>
        {booking.status === "cancelled" && <div className="inline-message danger-message">الحجز ده اتلغى والمعاد متاح للحجز من جديد.</div>}
      </div>
      <BottomAction>
        {booking.status === "confirmed" && !past && <button className="quiet-button" type="button" onClick={() => setShowCancel(true)}>إلغاء الحجز</button>}
        <button className="button button-primary" type="button" disabled={booking.status === "cancelled" || paymentStatus === "paid"} onClick={markPaid}>{paymentStatus === "paid" ? "الحجز مدفوع" : "سجّله مدفوع"}</button>
      </BottomAction>
      <Modal open={showCancel} title="إلغاء الحجز؟" confirmLabel="إلغاء الحجز" danger onClose={() => setShowCancel(false)} onConfirm={cancel}><p>الحجز هيفضل ظاهر كسجل ملغي، والمعاد هيرجع متاح للاعبين.</p></Modal>
    </MobileShell>
  );
}
