export const ORDER_STATUS_LABELS = {
  pending: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS = {
  pending: { bg: "bg-yellow-50", text: "text-yellow-700", border: "border-yellow-200" },
  confirmed: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  processing: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  shipped: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  out_for_delivery: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  delivered: { bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  cancelled: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
};

export const SELLER_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
};

export const ORDER_STATUS_STEPS = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "out_for_delivery",
  "delivered",
];

export const canBuyerCancel = status => status === "pending";
