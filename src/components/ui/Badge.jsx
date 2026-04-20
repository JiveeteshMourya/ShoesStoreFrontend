export default function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-[var(--color-surface)] text-[var(--color-secondary)]",
    primary: "bg-[var(--color-primary)] text-[var(--color-background)]",
    accent: "bg-[var(--color-accent)] text-white",
    success: "bg-green-50 text-green-700",
    error: "bg-red-50 text-red-700",
    warning: "bg-yellow-50 text-yellow-700",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
