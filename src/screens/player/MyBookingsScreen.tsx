import { Link, useSearchParams } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { PlayerBookingCard } from "../../components/Common";
import { Icon } from "../../components/Icon";
import { MobileShell } from "../../components/MobileShell";
import { isUpcoming, playerBookings } from "../../domain/bookings";

export function MyBookingsScreen() {
  const { state } = useDemo();
  const [params, setParams] = useSearchParams();
  const tab = params.get("tab") === "past" ? "past" : "upcoming";
  const bookings = playerBookings(state).filter((booking) => tab === "upcoming" ? isUpcoming(booking) : !isUpcoming(booking));
  return (
    <MobileShell>
      <div className="page-pad bookings-page">
        <div className="title-row"><h1 className="page-title no-margin">حجوزاتي</h1><Link className="icon-button" to="/player/courts" aria-label="تصفح الملاعب"><Icon name="back" /></Link></div>
        <div className="tabs"><button type="button" className={tab === "upcoming" ? "selected" : ""} aria-pressed={tab === "upcoming"} onClick={() => setParams({ tab: "upcoming" })}>القادمة</button><button type="button" className={tab === "past" ? "selected" : ""} aria-pressed={tab === "past"} onClick={() => setParams({ tab: "past" })}>السابقة</button></div>
        <div className="player-booking-list">{bookings.map((booking) => { const club = state.clubs.find((item) => item.id === booking.clubId); return club ? <PlayerBookingCard key={booking.id} booking={booking} club={club} /> : null; })}</div>
        {!bookings.length && <div className="empty-state"><Icon name="bookings" size={30} /><h2>مفيش حجوزات هنا</h2><p>{tab === "upcoming" ? "لما تحجز ملعب هتلاقيه هنا." : "حجوزاتك القديمة هتظهر هنا."}</p><Link className="button button-primary" to="/player/courts">دوّر على ملعب</Link></div>}
      </div>
    </MobileShell>
  );
}
