import type { ReactNode } from "react";

export function BottomAction({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bottom-action ${className}`.trim()}>{children}</div>;
}
