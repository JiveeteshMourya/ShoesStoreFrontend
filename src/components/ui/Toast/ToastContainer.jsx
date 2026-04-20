import { createPortal } from "react-dom";
import { useAppSelector } from "../../../store/hooks";
import Toast from "./Toast";

export default function ToastContainer() {
  const toasts = useAppSelector(state => state.ui.toasts);

  if (!toasts.length) return null;

  return createPortal(
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 items-end">
      {toasts.map(t => (
        <Toast key={t.id} {...t} />
      ))}
    </div>,
    document.body
  );
}
