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
                New Season 2024
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

          {/* Geometric visual composition */}
          <div
            className="relative hidden lg:block"
            style={{ animation: "fadeInUp 0.8s ease 0.15s both" }}
          >
            <div className="relative aspect-square w-full max-w-lg mx-auto">
              {/* Base card */}
              <div className="absolute inset-0 rounded-lg bg-(--color-surface)" />

              {/* Large rotated accent rectangle */}
              <div
                className="absolute right-6 top-6 h-3/4 w-[55%] rounded-2xl bg-(--color-accent)/15"
                style={{ transform: "rotate(8deg)" }}
              />

              {/* Second accent shape */}
              <div
                className="absolute right-16 bottom-10 h-1/3 w-1/3 rounded-xl bg-(--color-accent)/25"
                style={{ transform: "rotate(-4deg)" }}
              />

              {/* Warm radial gradient overlay */}
              <div
                className="absolute inset-0 rounded-lg opacity-50"
                style={{
                  background:
                    "radial-gradient(ellipse at 70% 30%, var(--color-accent) 0%, transparent 55%)",
                }}
              />

              {/* Dark editorial panel */}
              <div className="absolute bottom-10 left-8 h-[42%] w-[44%] rounded-2xl bg-(--color-primary)" />

              {/* Decorative accent rules */}
              <div className="absolute bottom-32 right-12 h-px w-20 bg-(--color-accent)/70" />
              <div className="absolute bottom-36 right-12 h-px w-12 bg-(--color-accent)/40" />

              {/* Editorial text */}
              <div className="absolute bottom-18 left-14 text-left">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-(--color-accent)">
                  Premium
                </p>
                <p className="mt-1 text-xl font-bold leading-tight text-white">Footwear</p>
                <p className="mt-1 text-[11px] text-white/50 tracking-wide">Est. 2024</p>
              </div>

              {/* Floating stat — bottom left */}
              <div
                className="absolute -bottom-5 -left-5 rounded-md border border-(--color-border) bg-white px-5 py-3"
                style={{ boxShadow: "var(--shadow-hover)" }}
              >
                <p className="text-2xl font-bold text-(--color-primary)">2k+</p>
                <p className="text-xs text-(--color-secondary)">Products listed</p>
              </div>

              {/* Floating stat — top right */}
              <div
                className="absolute -right-5 top-10 rounded-md border border-(--color-border) bg-white px-5 py-3"
                style={{ boxShadow: "var(--shadow-hover)" }}
              >
                <p className="text-2xl font-bold text-(--color-primary)">4.8★</p>
                <p className="text-xs text-(--color-secondary)">Avg. rating</p>
              </div>

              {/* Floating tag — mid left */}
              <div
                className="absolute -left-5 top-[38%] rounded-full border border-(--color-accent)/30 bg-white px-4 py-2"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <p className="text-xs font-semibold text-(--color-accent) tracking-wide">
                  New Season
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
