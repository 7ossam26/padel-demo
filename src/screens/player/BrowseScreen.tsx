import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { CourtCard } from "../../components/Common";
import { Icon } from "../../components/Icon";
import { MobileShell } from "../../components/MobileShell";
import { defaultFilters, filterClubs, filtersToParams, parseFilters, type CourtFilters } from "../../domain/filters";
import { todayISO } from "../../domain/dates";

function queryPath(path: string, filters: CourtFilters) {
  const query = filtersToParams(filters).toString();
  return `${path}?${query}`;
}

export function BrowseScreen() {
  const { state } = useDemo();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const today = todayISO();
  const filters = parseFilters(params, today);
  const clubs = filterClubs(state.clubs, filters);
  const update = (patch: Partial<CourtFilters>) => setParams(filtersToParams({ ...filters, ...patch }), { replace: true });
  const toggle = (patch: Partial<CourtFilters>, selected: boolean) => update(selected ? patch : defaultFilters(today));

  return (
    <MobileShell className="browse-screen">
      <div className="page-pad browse-content">
        <div className="browse-topbar">
          <button className="location-pill" type="button" onClick={() => navigate(queryPath("/player/filters", filters))}>
            <Icon name="pin" size={16} /><span>{filters.area || "التجمع الخامس"}</span><Icon name="chevron" size={15} />
          </button>
          <div className="top-actions">
            <Link className="small-icon-button" to="/player/bookings" aria-label="حجوزاتي"><Icon name="bookings" size={18} /></Link>
            <Link className="small-icon-button" to="/" aria-label="البداية"><Icon name="home" size={18} /></Link>
          </div>
        </div>
        <h1 className="page-title browse-title">دوّر على ملعب</h1>
        <label className="search-box">
          <Icon name="search" size={19} />
          <span className="visually-hidden">ابحث باسم الملعب أو المنطقة</span>
          <input type="search" value={filters.q} onChange={(event) => update({ q: event.target.value })} placeholder="ابحث باسم الملعب أو المنطقة" />
        </label>
        <div className="quick-filters">
          <button className={filters.date === today ? "active" : ""} type="button" onClick={() => update({ date: filters.date === today ? "" : today })}>النهاردة</button>
          <button className={filters.courtType === "indoor" ? "active" : ""} type="button" onClick={() => update({ courtType: filters.courtType === "indoor" ? "all" : "indoor" })}>مغطى</button>
          <button className={filters.courtType === "outdoor" ? "active" : ""} type="button" onClick={() => update({ courtType: filters.courtType === "outdoor" ? "all" : "outdoor" })}>مكشوف</button>
          <button className={filters.maxPrice === 400 ? "active" : ""} type="button" onClick={() => update({ maxPrice: filters.maxPrice === 400 ? 800 : 400 })}>أقل من 400</button>
        </div>
        <div className="court-list">
          {clubs.map((club) => <CourtCard key={club.id} club={club} to={queryPath(`/player/courts/${club.id}`, filters)} />)}
          {!clubs.length && (
            <div className="empty-state"><Icon name="search" size={28} /><h2>مفيش ملاعب بالاختيارات دي</h2><p>جرّب تمسح الفلاتر أو تغيّر السعر والمنطقة.</p><button className="button button-secondary" type="button" onClick={() => toggle({}, false)}>مسح الفلاتر</button></div>
          )}
        </div>
      </div>
    </MobileShell>
  );
}
