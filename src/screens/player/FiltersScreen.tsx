import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { CourtArtwork } from "../../components/CourtArtwork";
import { Icon } from "../../components/Icon";
import { MobileShell } from "../../components/MobileShell";
import { SegmentedControl } from "../../components/SegmentedControl";
import { defaultFilters, filterClubs, filtersToParams, parseFilters } from "../../domain/filters";
import { formatNumber, formatShortDate, todayISO } from "../../domain/dates";

export function FiltersScreen() {
  const { state } = useDemo();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const today = todayISO();
  const original = parseFilters(params, today);
  const [draft, setDraft] = useState(original);
  const resultCount = filterClubs(state.clubs, draft).length;
  const clear = () => setDraft({ ...defaultFilters(today), q: original.q, date: "" });
  const apply = () => navigate(`/player/courts?${filtersToParams(draft).toString()}`);

  return (
    <MobileShell className="filter-route">
      <div className="filter-underlay page-pad" aria-hidden="true">
        <span className="location-pill"><Icon name="pin" size={16} />التجمع الخامس</span>
        <h1 className="page-title browse-title">دوّر على ملعب</h1>
        <div className="fake-search" />
        <div className="quick-filters"><span className="active">النهاردة</span><span>مغطى</span><span>مكشوف</span></div>
        <CourtArtwork type="outdoor" className="filter-preview-art" />
      </div>
      <div className="filter-scrim" onClick={() => navigate(-1)} />
      <section className="filter-sheet" aria-labelledby="filters-title">
        <div className="sheet-handle" />
        <header className="sheet-header"><h1 id="filters-title">الفلاتر</h1><button type="button" onClick={clear}>مسح الكل</button></header>
        <label className="field"><span>المنطقة</span><span className="select-wrap"><Icon name="pin" size={18} /><select value={draft.area} onChange={(event) => setDraft({ ...draft, area: event.target.value })}><option value="">كل المناطق</option>{[...new Set(state.clubs.map((club) => club.area))].map((area) => <option key={area}>{area}</option>)}</select><Icon name="chevron" size={18} /></span></label>
        <label className="field"><span>التاريخ</span><span className="input-icon-wrap"><Icon name="calendar" size={18} /><input type="date" min={today} value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></span>{draft.date && <small>{formatShortDate(draft.date)}</small>}</label>
        <div className="field price-filter">
          <span className="field-between"><span>السعر للساعة</span><strong><span className="ltr">{draft.minPrice} – {draft.maxPrice}</span> جنيه</strong></span>
          <div className="dual-range">
            <input aria-label="أقل سعر" dir="ltr" type="range" min="150" max="800" step="50" value={draft.minPrice} onChange={(event) => setDraft({ ...draft, minPrice: Math.min(Number(event.target.value), draft.maxPrice - 50) })} />
            <input aria-label="أعلى سعر" dir="ltr" type="range" min="150" max="800" step="50" value={draft.maxPrice} onChange={(event) => setDraft({ ...draft, maxPrice: Math.max(Number(event.target.value), draft.minPrice + 50) })} />
          </div>
          <span className="range-labels"><small>150 جنيه</small><small>800 جنيه</small></span>
        </div>
        <div className="field"><span>نوع الملعب</span><SegmentedControl label="نوع الملعب" value={draft.courtType} onChange={(courtType) => setDraft({ ...draft, courtType })} options={[{ value: "all", label: "الكل" }, { value: "indoor", label: "مغطى" }, { value: "outdoor", label: "مكشوف" }]} /></div>
        <button className="button button-primary sheet-submit" type="button" onClick={apply}>اعرض {formatNumber(resultCount)} {resultCount === 1 ? "ملعب" : "ملاعب"}</button>
      </section>
    </MobileShell>
  );
}
