export default function SectionTitle({ title, subtitle, className = "" }) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl font-semibold tracking-tight text-[var(--color-primary)]">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-[var(--color-secondary)]">{subtitle}</p>}
    </div>
  );
}
