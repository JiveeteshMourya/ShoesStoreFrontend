import { useAppSelector } from "../../store/hooks";
import { LuSlidersHorizontal, LuX } from "react-icons/lu";
import { useState } from "react";

const SIZES = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47];
const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function FilterPanel({ params, onChange }) {
  const categories = useAppSelector(s => s.categories.items);

  return (
    <div className="flex flex-col gap-6">
      {/* Sort */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-(--color-secondary)">
          Sort by
        </p>
        <div className="flex flex-col gap-1">
          {SORT_OPTIONS.map(o => (
            <button
              key={o.value}
              onClick={() => onChange("sort", o.value)}
              className={`text-left px-2 py-1.5 rounded-(--radius-sm) text-sm transition-colors ${
                (params.get("sort") || "newest") === o.value
                  ? "bg-(--color-primary) text-(--color-background)"
                  : "text-(--color-secondary) hover:bg-(--color-surface)"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      {categories.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-(--color-secondary)">
            Category
          </p>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => onChange("category", "")}
              className={`text-left px-2 py-1.5 rounded-(--radius-sm) text-sm transition-colors ${
                !params.get("category")
                  ? "bg-(--color-primary) text-(--color-background)"
                  : "text-(--color-secondary) hover:bg-(--color-surface)"
              }`}
            >
              All
            </button>
            {categories.map(c => (
              <button
                key={c._id}
                onClick={() => onChange("category", c.slug)}
                className={`text-left px-2 py-1.5 rounded-(--radius-sm) text-sm transition-colors ${
                  params.get("category") === c.slug
                    ? "bg-(--color-primary) text-(--color-background)"
                    : "text-(--color-secondary) hover:bg-(--color-surface)"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-(--color-secondary)">
          Size (EU)
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map(s => {
            const active = params.get("size") === String(s);
            return (
              <button
                key={s}
                onClick={() => onChange("size", active ? "" : String(s))}
                className={`flex h-8 w-10 items-center justify-center rounded-(--radius-sm) border text-xs font-medium transition-colors ${
                  active
                    ? "border-(--color-primary) bg-(--color-primary) text-(--color-background)"
                    : "border-(--color-border) text-(--color-secondary) hover:border-(--color-primary)"
                }`}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price range */}
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-(--color-secondary)">
          Price range
        </p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={params.get("minPrice") || ""}
            onChange={e => onChange("minPrice", e.target.value)}
            className="w-full rounded-(--radius-sm) border border-(--color-border) bg-(--color-background) px-2 py-1.5 text-sm outline-none focus:border-(--color-primary)"
          />
          <span className="text-(--color-secondary)">–</span>
          <input
            type="number"
            placeholder="Max"
            value={params.get("maxPrice") || ""}
            onChange={e => onChange("maxPrice", e.target.value)}
            className="w-full rounded-(--radius-sm) border border-(--color-border) bg-(--color-background) px-2 py-1.5 text-sm outline-none focus:border-(--color-primary)"
          />
        </div>
      </div>

      {/* Clear */}
      <button
        onClick={() => onChange("__clear__", "")}
        className="text-xs text-(--color-secondary) underline hover:text-(--color-primary) transition-colors text-left"
      >
        Clear all filters
      </button>
    </div>
  );
}

export default function ProductFilters({ params, onChange }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <div className="lg:hidden">
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex items-center gap-2 rounded-(--radius-sm) border border-(--color-border) px-4 py-2 text-sm text-(--color-primary) hover:border-(--color-primary) transition-colors"
        >
          <LuSlidersHorizontal size={15} /> Filters
        </button>

        {drawerOpen && (
          <div className="fixed inset-0 z-50 flex" onClick={() => setDrawerOpen(false)}>
            <div className="absolute inset-0 bg-black/30" />
            <div
              className="relative ml-auto h-full w-72 overflow-y-auto bg-(--color-background) p-6 shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <p className="font-semibold text-(--color-primary)">Filters</p>
                <button onClick={() => setDrawerOpen(false)}>
                  <LuX size={18} className="text-(--color-secondary)" />
                </button>
              </div>
              <FilterPanel
                params={params}
                onChange={(...a) => {
                  onChange(...a);
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-52 shrink-0">
        <FilterPanel params={params} onChange={onChange} />
      </div>
    </>
  );
}
