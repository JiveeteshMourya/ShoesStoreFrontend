import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-(--color-background)">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-(--color-accent)">
              New Season
            </p>
            <h1 className="mt-3 text-5xl font-semibold leading-tight tracking-tight text-(--color-primary) sm:text-6xl">
              Step into
              <br />
              <span className="text-(--color-accent)">your style.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-(--color-secondary) leading-relaxed">
              Curated footwear from top brands and independent sellers. Find the perfect pair for
              every occasion.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-(--radius-sm) bg-(--color-primary) px-6 py-3 text-sm font-medium text-(--color-background) transition-colors hover:bg-(--color-secondary)"
              >
                Shop now <LuArrowRight size={15} />
              </Link>
              <Link
                to="/products?sort=rating"
                className="inline-flex items-center gap-2 rounded-(--radius-sm) border border-(--color-border) px-6 py-3 text-sm font-medium text-(--color-primary) transition-colors hover:border-(--color-primary)"
              >
                Top rated
              </Link>
            </div>
          </div>

          {/* Visual placeholder */}
          <div className="relative hidden lg:block">
            <div className="aspect-square w-full max-w-lg rounded-(--radius-lg) bg-(--color-surface) flex items-center justify-center overflow-hidden">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background:
                    "radial-gradient(ellipse at 60% 40%, var(--color-accent) 0%, transparent 65%)",
                }}
              />
              <span className="relative text-[160px] select-none">👟</span>
            </div>
            {/* Floating stat cards */}
            <div className="absolute -bottom-4 -left-4 rounded-(--radius-md) border border-(--color-border) bg-(--color-background) px-5 py-3 shadow-sm">
              <p className="text-2xl font-semibold text-(--color-primary)">2k+</p>
              <p className="text-xs text-(--color-secondary)">Products listed</p>
            </div>
            <div className="absolute -right-4 top-8 rounded-(--radius-md) border border-(--color-border) bg-(--color-background) px-5 py-3 shadow-sm">
              <p className="text-2xl font-semibold text-(--color-primary)">4.8★</p>
              <p className="text-xs text-(--color-secondary)">Avg. rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
