import { useNavigate } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { BackButton } from "../../components/Common";
import { BottomAction } from "../../components/BottomAction";
import { Icon } from "../../components/Icon";
import { MobileShell } from "../../components/MobileShell";
import { SegmentedControl } from "../../components/SegmentedControl";

export function OwnerSetupClubScreen() {
  const { state, updateDraft } = useDemo();
  const navigate = useNavigate();
  const draft = state.onboardingDraft;
  const areas = [...new Set(state.clubs.map((club) => club.area))];
  return (
    <MobileShell className="screen-column">
      <div className="page-pad setup-page">
        <BackButton to="/" />
        <div className="progress-bars"><span className="active" /><span /></div>
        <p className="step-label">الخطوة 1 من 2</p>
        <h1 className="page-title setup-title">كلّمنا عن ناديك</h1>
        <p className="lead compact">ده اللي اللاعبين هيشوفوه أول ما يفتحوا التطبيق.</p>
        <label className="field"><span>اسم الملعب</span><input className="text-input" type="text" value={draft.clubName} onChange={(event) => updateDraft({ clubName: event.target.value })} /></label>
        <label className="field"><span>المنطقة</span><span className="select-wrap"><Icon name="pin" size={18} /><select value={draft.area} onChange={(event) => updateDraft({ area: event.target.value })}>{areas.map((area) => <option key={area}>{area}</option>)}</select><Icon name="chevron" size={18} /></span></label>
        <div className="field"><span>نوع الملعب</span><SegmentedControl value={draft.courtType} onChange={(courtType) => updateDraft({ courtType })} options={[{ value: "indoor", label: "مغطى" }, { value: "outdoor", label: "مكشوف" }]} /></div>
        <div className="field"><span>عدد الملاعب</span><div className="counter-field"><strong>{draft.courtCount === 1 ? "ملعب واحد" : `${draft.courtCount} ملاعب`}</strong><span><button type="button" aria-label="قلّل عدد الملاعب" disabled={draft.courtCount <= 1} onClick={() => updateDraft({ courtCount: draft.courtCount - 1 })}><Icon name="minus" size={18} /></button><button type="button" className="primary-counter" aria-label="زوّد عدد الملاعب" disabled={draft.courtCount >= 6} onClick={() => updateDraft({ courtCount: draft.courtCount + 1 })}><Icon name="plus" size={18} /></button></span></div></div>
      </div>
      <BottomAction><button className="button button-primary" type="button" disabled={!draft.clubName.trim()} onClick={() => navigate("/owner/setup/schedule")}>كمّل</button></BottomAction>
    </MobileShell>
  );
}
