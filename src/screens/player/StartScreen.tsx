import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDemo } from "../../app/DemoProvider";
import { BrandMark } from "../../components/Common";
import { Icon } from "../../components/Icon";
import { MobileShell } from "../../components/MobileShell";
import { Modal } from "../../components/Modal";

export function StartScreen() {
  const [showReset, setShowReset] = useState(false);
  const { resetDemo, showToast } = useDemo();
  const navigate = useNavigate();
  const reset = () => {
    resetDemo();
    setShowReset(false);
    showToast("رجّعنا بيانات التجربة من الأول");
    navigate("/");
  };
  return (
    <MobileShell className="start-screen screen-column">
      <div className="start-content">
        <BrandMark />
        <h1 className="hero-title">احجز ملعب بادل<br />في أي مكان في مصر<br />في أقل من دقيقة.</h1>
        <p className="lead">اختار تحب تبدأ إزاي.</p>
        <div className="role-list">
          <Link className="role-card" to="/player/courts">
            <span className="role-icon"><Icon name="search" size={24} /></span>
            <span><strong>عايز أحجز ملعب</strong><small>دوّر على ملاعب قريبة منك واحجز معادك</small></span>
            <Icon name="back" />
          </Link>
          <Link className="role-card" to="/owner/setup/club">
            <span className="role-icon"><Icon name="racket" size={24} /></span>
            <span><strong>عندي ملاعب</strong><small>سجّل ناديك وتابع الحجوزات من موبايلك</small></span>
            <Icon name="back" />
          </Link>
          <button className="quiet-button" type="button" onClick={() => setShowReset(true)}>إعادة ضبط التجربة</button>
        </div>
      </div>
      <Modal open={showReset} title="إعادة ضبط التجربة؟" confirmLabel="إعادة الضبط" danger onClose={() => setShowReset(false)} onConfirm={reset}>
        <p>كل الحجوزات والتعديلات المحلية هتتمسح، وهنرجّع البيانات التجريبية بتاريخ النهاردة.</p>
      </Modal>
    </MobileShell>
  );
}
