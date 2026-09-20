import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { BackButton } from "../../components/Common";
import { BottomAction } from "../../components/BottomAction";
import { Icon } from "../../components/Icon";
import { MobileShell } from "../../components/MobileShell";
import { timeToMinutes } from "../../domain/dates";

const DAYS = [{ value: 0, label: "ح", name: "الأحد" }, { value: 1, label: "ن", name: "الاثنين" }, { value: 2, label: "ت", name: "الثلاثاء" }, { value: 3, label: "ر", name: "الأربعاء" }, { value: 4, label: "خ", name: "الخميس" }, { value: 5, label: "ج", name: "الجمعة" }, { value: 6, label: "س", name: "السبت" }];
const HOURS = Array.from({ length: 19 }, (_, index) => `${String(index + 6).padStart(2, "0")}:00`);

export function OwnerSetupScheduleScreen() {
  const { state, updateDraft, commitOwnerSetup, showToast } = useDemo();
  const navigate = useNavigate();
  const draft = state.onboardingDraft;
  const [error, setError] = useState("");
  const toggleDay = (day: number) => updateDraft({ workingDays: draft.workingDays.includes(day) ? draft.workingDays.filter((item) => item !== day) : [...draft.workingDays, day] });
  const submit = () => {
    if (!draft.workingDays.length) return setError("اختار يوم شغل واحد على الأقل.");
    if (timeToMinutes(draft.closingTime) <= timeToMinutes(draft.openingTime)) return setError("ميعاد القفل لازم يكون بعد ميعاد الفتح.");
    commitOwnerSetup();
    showToast("اتحفظت بيانات النادي");
    navigate("/owner/dashboard");
  };
  return (
    <MobileShell className="screen-column">
      <div className="page-pad setup-page schedule-setup">
        <BackButton to="/owner/setup/club" />
        <div className="progress-bars"><span className="active" /><span className="active" /></div>
        <p className="step-label">الخطوة 2 من 2</p>
        <h1 className="page-title setup-title">الأسعار والمواعيد</h1>
        <p className="lead compact">تقدر تغيّرها في أي وقت بعدين.</p>
        <div className="field"><span>السعر للساعة</span><div className="price-counter"><button type="button" aria-label="قلّل السعر" disabled={draft.hourlyRate <= 150} onClick={() => updateDraft({ hourlyRate: draft.hourlyRate - 50 })}><Icon name="minus" size={18} /></button><span><strong className="ltr">{draft.hourlyRate}</strong><small>جنيه في الساعة</small></span><button type="button" className="primary-counter" aria-label="زوّد السعر" disabled={draft.hourlyRate >= 800} onClick={() => updateDraft({ hourlyRate: draft.hourlyRate + 50 })}><Icon name="plus" size={18} /></button></div></div>
        <div className="hours-row"><label className="field"><span>بيفتح</span><span className="input-icon-wrap"><Icon name="clock" size={17} /><select value={draft.openingTime} onChange={(event) => updateDraft({ openingTime: event.target.value })}>{HOURS.slice(0, -1).map((hour) => <option key={hour}>{hour}</option>)}</select></span></label><label className="field"><span>بيقفل</span><span className="input-icon-wrap"><Icon name="clock" size={17} /><select value={draft.closingTime} onChange={(event) => updateDraft({ closingTime: event.target.value })}>{HOURS.slice(1).map((hour) => <option key={hour}>{hour}</option>)}</select></span></label></div>
        <div className="field"><span>أيام الشغل</span><div className="day-picker">{DAYS.map((day) => <button key={day.value} type="button" title={day.name} aria-label={day.name} aria-pressed={draft.workingDays.includes(day.value)} className={draft.workingDays.includes(day.value) ? "selected" : ""} onClick={() => toggleDay(day.value)}>{day.label}</button>)}</div></div>
        {error && <div className="inline-error" role="alert">{error}</div>}
      </div>
      <BottomAction><button className="button button-primary" type="button" onClick={submit}>كمّل</button></BottomAction>
    </MobileShell>
  );
}
