export const formatPrice = n =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(n);

export const formatDate = iso =>
  new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const truncateText = (text, max = 80) =>
  text && text.length > max ? text.slice(0, max).trimEnd() + "…" : text;
