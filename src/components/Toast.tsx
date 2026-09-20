import { useDemo } from "../app/DemoProvider";

export function Toast() {
  const { toast } = useDemo();
  return toast ? <div className="toast" role="status">{toast}</div> : null;
}
