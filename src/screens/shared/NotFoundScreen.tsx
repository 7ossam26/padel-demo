import { Link } from "react-router-dom";
import { MobileShell } from "../../components/MobileShell";

export function NotFoundScreen({ message = "الصفحة دي مش موجودة", to = "/" }: { message?: string; to?: string }) {
  return <MobileShell className="not-found"><div><span>404</span><h1>{message}</h1><p>ممكن ترجع وتكمّل التجربة من مكان آمن.</p><Link className="button button-primary" to={to}>ارجع</Link></div></MobileShell>;
}
