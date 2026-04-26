export default function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  loading,
  type = "button",
  ...props
}) {
  const base =
    "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";

  const variants = {
    primary:
      "bg-[var(--color-primary)] text-[var(--color-background)] hover:opacity-85 rounded-[var(--radius-sm)]",
    ghost: "text-[var(--color-primary)] hover:bg-[var(--color-surface)] rounded-[var(--radius-sm)]",
    outline:
      "border border-[var(--color-border)] text-[var(--color-primary)] hover:border-[var(--color-primary)] rounded-[var(--radius-sm)]",
    accent:
      "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] rounded-[var(--radius-sm)]",
    danger: "bg-[var(--color-error)] text-white hover:opacity-90 rounded-[var(--radius-sm)]",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3 text-base gap-2",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
