import { useEffect } from "react";
import { LuCheck, LuX, LuInfo, LuTriangleAlert } from "react-icons/lu";
import { useAppDispatch } from "../../../store/hooks";
import { removeToast } from "../../../store/slices/uiSlice";

const icons = {
  success: <LuCheck size={16} />,
  error: <LuX size={16} />,
  warning: <LuTriangleAlert size={16} />,
  info: <LuInfo size={16} />,
};

const styles = {
  success: "bg-[var(--color-success)] text-white",
  error: "bg-[var(--color-error)] text-white",
  warning: "bg-[var(--color-warning)] text-white",
  info: "bg-[var(--color-primary)] text-[var(--color-background)]",
};

export default function Toast({ id, type = "info", message, duration = 4000 }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const t = setTimeout(() => dispatch(removeToast(id)), duration);
    return () => clearTimeout(t);
  }, [dispatch, id, duration]);

  return (
    <div
      className={`flex items-center gap-3 rounded-[var(--radius-sm)] px-4 py-3 shadow-lg text-sm font-medium min-w-[260px] max-w-sm ${styles[type]}`}
    >
      <span className="shrink-0">{icons[type]}</span>
      <p className="flex-1">{message}</p>
      <button
        onClick={() => dispatch(removeToast(id))}
        className="shrink-0 opacity-70 hover:opacity-100 transition-opacity"
      >
        <LuX size={14} />
      </button>
    </div>
  );
}
