import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { BackButton } from "../../components/Common";
import { BottomAction } from "../../components/BottomAction";
import { Icon } from "../../components/Icon";
import { MobileShell } from "../../components/MobileShell";
import { SegmentedControl } from "../../components/SegmentedControl";
import { addDays, dateRangeLabel, timeToMinutes, todayISO } from "../../domain/dates";

export function OwnerBlockScreen() {
  const { state, addAvailabilityBlock, showToast } = useDemo();
  const navigate = useNavigate();
  const club = state.clubs.find((item) => item.ownerId === state.owner.id)!;
  const activeCourts = state.courts.filter((court) => court.clubId === club.id && court.active);
  const initialCourt = activeCourts.at(-1)?.id ?? activeCourts[0]?.id ?? "";
  const minDate = todayISO();
  const [courtId, setCourtId] = useState(initialCourt);
  const [startDate, setStartDate] = useState(addDays(minDate, 1));
  const [endDate, setEndDate] = useState(addDays(minDate, 2));
  const [duration, setDuration] = useState<"full" | "hours">("full");
  const [startTime, setStartTime] = useState("18:00");
  const [endTime, setEndTime] = useState("20:00");
  const [reason, setReason] = useState("تغيير لوح زجاج");
  const [error, setError] = useState("");
  const selectedCourt = activeCourts.find((court) => court.id === courtId);
  const summary = useMemo(() => `${selectedCourt?.name ?? "الملعب"} هيكون مقفول ${dateRangeLabel(startDate, endDate)}${duration === "hours" ? ` من ${startTime} لـ ${endTime}` : " طول اليوم"}.`, [selectedCourt, startDate, endDate, duration, startTime, endTime]);
  const submit = () => {
    if (!courtId) return setError("اختار ملعب.");
    if (endDate < startDate) return setError("تاريخ النهاية لازم يكون بعد البداية.");
    if (duration === "hours" && timeToMinutes(endTime) <= timeToMinutes(startTime)) return setError("وقت النهاية لازم يكون بعد البداية.");
    addAvailabilityBlock({ courtId, startDate, endDate, allDay: duration === "full", ...(duration === "hours" ? { startTime, endTime } : {}), reason: reason.trim() || undefined });
    showToast("اتقفلت المواعيد المطلوبة");
    navigate("/owner/dashboard");
  };
  return (
    <MobileShell className="screen-column">
      <div className="page-pad block-page">
        <BackButton to="/owner/dashboard" />
        <h1 className="page-title">اقفل مواعيد</h1>
        <p className="lead compact">اللاعبين مش هيقدروا يحجزوا المواعيد دي.</p>
        <label className="field"><span>الملعب</span><span className="select-wrap"><Icon name="block" size={18} /><select value={courtId} onChange={(event) => setCourtId(event.target.value)}>{activeCourts.map((court) => <option key={court.id} value={court.id}>{court.name}</option>)}</select><Icon name="chevron" size={18} /></span></label>
        <div className="date-fields"><label className="field"><span>من</span><span className="input-icon-wrap"><Icon name="calendar" size={18} /><input type="date" min={minDate} value={startDate} onChange={(event) => { setStartDate(event.target.value); if (event.target.value > endDate) setEndDate(event.target.value); }} /></span></label><label className="field"><span>لـ</span><span className="input-icon-wrap"><Icon name="calendar" size={18} /><input type="date" min={startDate} value={endDate} onChange={(event) => setEndDate(event.target.value)} /></span></label></div>
        <div className="field"><span>المدة</span><SegmentedControl value={duration} onChange={setDuration} options={[{ value: "full", label: "يوم كامل" }, { value: "hours", label: "وقت محدد" }]} /></div>
        {duration === "hours" && <div className="date-fields time-fields"><label className="field"><span>من الساعة</span><input className="text-input ltr" type="time" step="3600" value={startTime} onChange={(event) => setStartTime(event.target.value)} /></label><label className="field"><span>للساعة</span><input className="text-input ltr" type="time" step="3600" value={endTime} onChange={(event) => setEndTime(event.target.value)} /></label></div>}
        <label className="field"><span>السبب (اختياري)</span><input className="text-input" type="text" value={reason} onChange={(event) => setReason(event.target.value)} /></label>
        <div className="info-box"><Icon name="info" size={19} /><p>{summary}</p></div>
        {error && <div className="inline-error" role="alert">{error}</div>}
      </div>
      <BottomAction><button className="button button-primary" type="button" onClick={submit}>اقفل المواعيد دي</button></BottomAction>
    </MobileShell>
  );
}
