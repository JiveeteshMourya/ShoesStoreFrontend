export default function Textarea({ label, error, className = "", id, rows = 4, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-[var(--color-primary)]">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2.5 text-sm text-[var(--color-primary)] placeholder:text-[var(--color-secondary)] outline-none transition-colors focus:border-[var(--color-primary)] resize-none ${error ? "border-[var(--color-error)]" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
    </div>
  );
}
