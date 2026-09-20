import type { ReactNode } from "react";

export function Modal({
  open,
  title,
  children,
  confirmLabel,
  onConfirm,
  onClose,
  danger = false,
}: {
  open: boolean;
  title: string;
  children: ReactNode;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  danger?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="modal-layer" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}>
        <h2 id="modal-title">{title}</h2>
        <div className="modal-body">{children}</div>
        <div className="modal-actions">
          <button type="button" className="button button-secondary" onClick={onClose}>رجوع</button>
          <button type="button" className={`button ${danger ? "button-danger" : "button-primary"}`} onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </section>
    </div>
  );
}
