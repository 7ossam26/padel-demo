import { Link, useLocation, useParams } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { BackButton } from "../../components/Common";
import { CourtArtwork } from "../../components/CourtArtwork";
import { Icon, type IconName } from "../../components/Icon";
import { MobileShell } from "../../components/MobileShell";
import { formatNumber } from "../../domain/dates";
import { NotFoundScreen } from "../shared/NotFoundScreen";

const amenityIcons: Record<string, IconName> = { "إضاءة": "light", "باركينج": "car", "دشّات": "drop", "مضارب": "racket", "كافيه": "cup", "مياه": "drop" };

export function CourtDetailScreen() {
  const { clubId } = useParams();
  const { state } = useDemo();
  const location = useLocation();
  const club = state.clubs.find((item) => item.id === clubId);
  if (!club) return <NotFoundScreen message="الملعب ده مش موجود" to="/player/courts" />;
  const query = location.search;
  return (
    <MobileShell className="court-detail-screen screen-column">
      <div className="detail-hero">
        <CourtArtwork type={club.artwork} />
        <div className="hero-back"><BackButton to={`/player/courts${query}`} /></div>
        <div className="carousel-dots"><span /><i /><i /></div>
      </div>
      <section className="detail-sheet">
        <div className="court-detail-title"><div><h1>{club.name}</h1><p>{club.area} · على بعد <span className="ltr">{club.distanceKm}</span> كم</p></div><span className="rating rating-large"><Icon name="star" size={13} /><span className="ltr">{club.rating}</span><small className="ltr">({club.reviewCount})</small></span></div>
        <div className="amenities">{club.amenities.map((item) => <div key={item}><span><Icon name={amenityIcons[item] ?? "racket"} size={21} /></span><small>{item}</small></div>)}</div>
        <p className="description">{club.description}</p>
      </section>
      <div className="detail-cta bottom-action">
        <div><strong>{formatNumber(club.hourlyRate)} جنيه</strong><small>للساعة</small></div>
        <Link className="button button-primary" to={`/player/courts/${club.id}/time`}>اختار الميعاد</Link>
      </div>
    </MobileShell>
  );
}
