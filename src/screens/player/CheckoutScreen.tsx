import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { BackButton } from "../../components/Common";
import { BottomAction } from "../../components/BottomAction";
import { CourtArtwork } from "../../components/CourtArtwork";
import { MobileShell } from "../../components/MobileShell";
import type { PaymentMethod } from "../../data/model";
import { addHour, formatNumber, formatShortDate } from "../../domain/dates";
import { calculatePrice } from "../../domain/pricing";
import { NotFoundScreen } from "../shared/NotFoundScreen";

export function CheckoutScreen() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { state, createBooking } = useDemo();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const club = state.clubs.find((item) => item.id === params.get("clubId"));
  const court = state.courts.find((item) => item.id === params.get("courtId"));
  const date = params.get("date") ?? "";
  const time = params.get("time") ?? "";
  if (!club || !court || !date || !time) return <NotFoundScreen message="تفاصيل الحجز ناقصة" to="/player/courts" />;
  const price = calculatePrice(club.hourlyRate);
  const confirm = () => {
    setError("");
    setSubmitting(true);
    window.setTimeout(() => {
      const result = createBooking({ clubId: club.id, courtId: court.id, date, startTime: time, paymentMethod });
      setSubmitting(false);
      if (result.error || !result.booking) {
        setError(result.error ?? "حصلت مشكلة. جرّب تاني.");
        return;
      }
      navigate(`/player/confirmation/${result.booking.id}`, { replace: true });
    }, paymentMethod === "card" ? 650 : 250);
  };

  return (
    <MobileShell className="screen-column">
      <div className="page-pad checkout-page">
        <BackButton to={`/player/courts/${club.id}/time`} />
        <h1 className="page-title">التأكيد والدفع</h1>
        <article className="summary-card booking-summary"><span className="summary-art"><CourtArtwork type={club.artwork} /></span><span><strong>{club.name}</strong><small>{formatShortDate(date)} · <span className="ltr">{time} – {addHour(time)}</span></small><small>ساعة واحدة · {court.name}</small></span></article>
        <section className="summary-card price-card"><div><span>سعر الملعب</span><strong>{formatNumber(price.courtSubtotal)} جنيه</strong></div><div><span>رسوم الخدمة</span><strong>{formatNumber(price.serviceFee)} جنيه</strong></div><hr /><div className="grand-total"><b>الإجمالي</b><strong>{formatNumber(price.customerTotal)} جنيه</strong></div></section>
        <h2 className="section-title">طريقة الدفع</h2>
        <section className="summary-card payment-card">
          <label><input type="radio" name="payment" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} /><span><strong>كارت</strong><small>فيزا أو ماستركارد أو ميزة — محاكاة</small></span></label>
          <label><input type="radio" name="payment" checked={paymentMethod === "venue"} onChange={() => setPaymentMethod("venue")} /><span><strong>ادفع في النادي</strong><small>تدفع في الاستقبال قبل ما تلعب</small></span></label>
        </section>
        <p className="policy-copy">الإلغاء مجاني لحد 6 ساعات قبل معادك.</p>
        {error && <div className="inline-error" role="alert">{error}</div>}
      </div>
      <BottomAction><button className="button button-primary" type="button" disabled={submitting} onClick={confirm}>{submitting ? "بنكمل الحجز…" : "أكّد الحجز"}</button></BottomAction>
    </MobileShell>
  );
}
