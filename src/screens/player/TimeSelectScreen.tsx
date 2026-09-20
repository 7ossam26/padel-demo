import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { BackButton } from "../../components/Common";
import { BottomAction } from "../../components/BottomAction";
import { MobileShell } from "../../components/MobileShell";
import { firstAvailableDate, getSlotOptions } from "../../domain/availability";
import { addDays, formatNumber, formatShortDate, parseLocalDate, shortWeekday, todayISO, weekday } from "../../domain/dates";
import { NotFoundScreen } from "../shared/NotFoundScreen";

export function TimeSelectScreen() {
  const { clubId } = useParams();
  const navigate = useNavigate();
  const { state } = useDemo();
  const club = state.clubs.find((item) => item.id === clubId);
  const dates = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(todayISO(), index)), []);
  const initialDate = club ? firstAvailableDate(state, club, dates) : dates[0];
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const slots = club ? getSlotOptions(state, club, selectedDate) : [];
  const [selectedTime, setSelectedTime] = useState("");
  const selectedSlot = slots.find((slot) => slot.time === selectedTime && slot.available);

  useEffect(() => {
    const preferred = slots.find((slot) => slot.time === "18:00" && slot.available) ?? slots.find((slot) => slot.available);
    setSelectedTime(preferred?.time ?? "");
  }, [selectedDate, clubId]);

  if (!club) return <NotFoundScreen message="الملعب ده مش موجود" to="/player/courts" />;
  const proceed = () => {
    if (!selectedSlot?.courtId) return;
    const params = new URLSearchParams({ clubId: club.id, courtId: selectedSlot.courtId, date: selectedDate, time: selectedSlot.time });
    navigate(`/player/checkout?${params.toString()}`);
  };

  return (
    <MobileShell className="screen-column">
      <div className="page-pad time-page">
        <BackButton to={`/player/courts/${club.id}`} />
        <h1 className="page-title">اختار الميعاد</h1>
        <p className="subheading">{club.name}</p>
        <div className="date-strip">
          {dates.map((date) => {
            const closed = !club.workingDays.includes(weekday(date));
            return <button key={date} type="button" className={selectedDate === date ? "selected" : ""} disabled={closed} aria-pressed={selectedDate === date} onClick={() => setSelectedDate(date)}><small>{shortWeekday(date)}</small><strong className="ltr">{parseLocalDate(date).getDate()}</strong>{closed && <em>مغلق</em>}</button>;
          })}
        </div>
        <div className="slot-legend"><span><i className="available" />متاح</span><span><i className="busy" />محجوز</span><span><i className="chosen" />اللي اخترته</span></div>
        <div className="slot-grid">
          {slots.map((slot) => <button key={slot.time} type="button" className={selectedTime === slot.time ? "selected" : ""} disabled={!slot.available} aria-pressed={selectedTime === slot.time} onClick={() => setSelectedTime(slot.time)}><span className="ltr">{slot.time}</span></button>)}
        </div>
        {!slots.some((slot) => slot.available) && <div className="inline-message">مفيش مواعيد متاحة في اليوم ده. اختار يوم تاني.</div>}
      </div>
      <BottomAction>
        <div className="selection-summary"><strong>{formatShortDate(selectedDate)} · <span className="ltr">{selectedSlot?.time ?? "--:--"} – {selectedSlot?.endTime ?? "--:--"}</span></strong><span>ساعة واحدة</span></div>
        <div className="total-row"><span>الإجمالي</span><strong>{formatNumber(club.hourlyRate)} جنيه</strong></div>
        <button className="button button-primary" type="button" disabled={!selectedSlot} onClick={proceed}>كمّل</button>
      </BottomAction>
    </MobileShell>
  );
}
