import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-(--color-background)">
      {/* Ambient gradient orbs */}
      <div
        className="pointer-events-none absolute -top-40 -right-40 h-175 w-175 rounded-full opacity-[0.06]"
        style={{ background: "var(--color-accent)", filter: "blur(90px)" }}
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-32 h-125 w-125 rounded-full opacity-[0.04]"
        style={{ background: "var(--color-accent)", filter: "blur(100px)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 pt-10 pb-24 sm:px-6 sm:pt-14 sm:pb-32 lg:px-8 lg:pt-16 lg:pb-36">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* Copy */}
          <div style={{ animation: "fadeInUp 0.6s ease forwards" }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-(--color-accent)/40 bg-(--color-accent)/10 px-4 py-1.5 mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-(--color-accent)" />
              <span className="text-xs font-semibold uppercase tracking-widest text-(--color-accent)">
                New Season 2026
              </span>
            </div>
            <h1 className="mt-2 text-6xl font-bold leading-[1.05] text-(--color-primary) sm:text-7xl lg:text-8xl">
              Step into
              <br />
              <span className="text-(--color-accent) italic">your style.</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-(--color-secondary) leading-relaxed">
              Curated footwear from top brands and independent sellers. Find the perfect pair for
              every occasion.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-(--radius-sm) bg-(--color-primary) px-7 py-3.5 text-sm font-medium tracking-wide text-(--color-background) transition-all hover:opacity-85 active:scale-95"
              >
                Shop now <LuArrowRight size={15} />
              </Link>
              <Link
                to="/products?sort=rating"
                className="inline-flex items-center gap-2 rounded-(--radius-sm) border border-(--color-accent)/60 px-7 py-3.5 text-sm font-medium tracking-wide text-(--color-primary) transition-all hover:border-(--color-accent) hover:bg-(--color-accent)/8 active:scale-95"
              >
                Top rated
              </Link>
            </div>

            {/* Inline trust signals */}
            <div className="mt-10 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-(--color-primary)">2,000+</span>
                <span className="text-xs text-(--color-secondary)">products</span>
              </div>
              <div className="h-3.5 w-px bg-(--color-border)" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-(--color-primary)">4.8★</span>
                <span className="text-xs text-(--color-secondary)">avg. rating</span>
              </div>
              <div className="h-3.5 w-px bg-(--color-border)" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-(--color-primary)">Free</span>
                <span className="text-xs text-(--color-secondary)">returns</span>
              </div>
            </div>
          </div>

          {/* Product showcase card */}
          <div
            className="relative hidden lg:block"
            style={{ animation: "fadeInUp 0.8s ease 0.15s both" }}
          >
            <div className="relative mx-auto max-w-md">
              {/* Main card */}
              <div
                className="relative overflow-hidden rounded-3xl"
                style={{ aspectRatio: "3/4", boxShadow: "0 32px 64px -12px rgba(0,0,0,0.3)" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80"
                  alt="Featured shoe"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                {/* Bottom gradient */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />

                {/* New Drop badge */}
                <div className="absolute top-5 left-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-(--color-accent) px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white">
                    ✦ New Drop
                  </span>
                </div>

                {/* Bottom info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 mb-1">
                    Featured Collection
                  </p>
                  <p className="text-2xl font-bold text-white leading-tight">Premium Sneakers</p>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-yellow-400 text-sm">★★★★★</span>
                      <span className="text-white/60 text-xs">4.8 · 2,000+ sold</span>
                    </div>
                    <span className="text-sm font-semibold text-white">From ₹999</span>
                  </div>
                </div>
              </div>

              {/* Floating stat — top right */}
              <div
                className="absolute -right-6 top-8 rounded-2xl border border-(--color-border) bg-white/90 backdrop-blur-sm px-4 py-3"
                style={{ boxShadow: "var(--shadow-hover)" }}
              >
                <p className="text-xl font-bold text-(--color-primary)">4.8★</p>
                <p className="text-[11px] text-(--color-secondary)">Avg. rating</p>
              </div>

              {/* Floating stat — mid left */}
              <div
                className="absolute -left-6 top-1/2 -translate-y-1/2 rounded-2xl border border-(--color-border) bg-white/90 backdrop-blur-sm px-4 py-3"
                style={{ boxShadow: "var(--shadow-hover)" }}
              >
                <p className="text-xl font-bold text-(--color-primary)">2k+</p>
                <p className="text-[11px] text-(--color-secondary)">Products listed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
