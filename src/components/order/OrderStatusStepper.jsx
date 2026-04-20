import { ORDER_STATUS_STEPS, ORDER_STATUS_LABELS } from "../../utils/orderHelpers";
import { LuCheck } from "react-icons/lu";

export default function OrderStatusStepper({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3">
        <span className="text-sm font-medium text-red-700">Order Cancelled</span>
      </div>
    );
  }

  const currentIdx = ORDER_STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-0">
      {ORDER_STATUS_STEPS.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        return (
          <div key={step} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors ${
                  done
                    ? "border-[var(--color-success)] bg-[var(--color-success)] text-white"
                    : active
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-[var(--color-background)]"
                      : "border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-secondary)]"
                }`}
              >
                {done ? <LuCheck size={13} /> : idx + 1}
              </div>
              <p
                className={`mt-1 hidden text-center text-xs sm:block ${
                  active
                    ? "font-medium text-[var(--color-primary)]"
                    : "text-[var(--color-secondary)]"
                }`}
                style={{ maxWidth: 72 }}
              >
                {ORDER_STATUS_LABELS[step]}
              </p>
            </div>
            {idx < ORDER_STATUS_STEPS.length - 1 && (
              <div
                className={`h-0.5 flex-1 transition-colors ${
                  idx < currentIdx ? "bg-[var(--color-success)]" : "bg-[var(--color-border)]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
