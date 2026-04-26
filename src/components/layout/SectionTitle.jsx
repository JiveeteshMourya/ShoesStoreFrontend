export default function SectionTitle({ title, subtitle, className = "" }) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl font-semibold tracking-tight text-(--color-primary)">{title}</h2>
      <div className="mt-3 h-0.5 w-10 rounded-full bg-(--color-accent)" />
      {subtitle && <p className="mt-3 text-sm text-(--color-secondary)">{subtitle}</p>}
    </div>
  );
}
