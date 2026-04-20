import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "../../utils/orderHelpers";

export default function OrderStatusBadge({ status }) {
  const label = ORDER_STATUS_LABELS[status] ?? status;
  const colors = ORDER_STATUS_COLORS[status] ?? {
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {label}
    </span>
  );
}
