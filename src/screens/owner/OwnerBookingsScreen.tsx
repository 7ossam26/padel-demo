import { useSearchParams } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { BackButton, OwnerBookingRow } from "../../components/Common";
import { Icon } from "../../components/Icon";
import { MobileShell } from "../../components/MobileShell";
import { ownerBookingsForTab } from "../../domain/bookings";

type Tab = "today" | "upcoming" | "past";

export function OwnerBookingsScreen() {
  const { state } = useDemo();
  const [params, setParams] = useSearchParams();
  const requested = params.get("tab");
  const tab: Tab = requested === "upcoming" || requested === "past" ? requested : "today";
  const club = state.clubs.find((item) => item.ownerId === state.owner.id)!;
  const bookings = ownerBookingsForTab(state, club.id, tab);
  return (
    <MobileShell>
      <div className="page-pad owner-bookings-page">
        <BackButton to="/owner/dashboard" />
        <h1 className="page-title">الحجوزات</h1>
        <div className="tabs three-tabs">{([{ value: "today", label: "النهاردة" }, { value: "upcoming", label: "القادمة" }, { value: "past", label: "السابقة" }] as { value: Tab; label: string }[]).map((item) => <button key={item.value} type="button" className={tab === item.value ? "selected" : ""} aria-pressed={tab === item.value} onClick={() => setParams({ tab: item.value })}>{item.label}</button>)}</div>
        <section className="booking-list-card owner-booking-list">{bookings.map((booking) => <OwnerBookingRow key={booking.id} booking={booking} court={undefined} showPrice to={`/owner/bookings/${booking.id}`} />)}{!bookings.length && <div className="empty-state compact-empty"><Icon name="bookings" size={28} /><h2>مفيش حجوزات هنا</h2></div>}</section>
      </div>
    </MobileShell>
  );
}
