import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="flex items-center justify-center gap-1">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <LuChevronLeft size={16} />
      </button>

      {visiblePages.map((p, idx) => {
        const prev = visiblePages[idx - 1];
        return (
          <span key={p} className="flex items-center gap-1">
            {prev && p - prev > 1 && <span className="px-1 text-[var(--color-secondary)]">…</span>}
            <button
              onClick={() => onPageChange(p)}
              className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] text-sm transition-colors ${
                p === page
                  ? "bg-[var(--color-primary)] text-[var(--color-background)]"
                  : "border border-[var(--color-border)] text-[var(--color-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              }`}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] border border-[var(--color-border)] text-[var(--color-secondary)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <LuChevronRight size={16} />
      </button>
    </div>
  );
}
