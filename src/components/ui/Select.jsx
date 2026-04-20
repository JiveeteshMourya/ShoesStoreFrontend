export default function Select({ label, error, className = "", id, children, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-primary)]">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm text-[var(--color-primary)] outline-none transition-colors focus:border-[var(--color-primary)] ${error ? "border-[var(--color-error)]" : ""} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
