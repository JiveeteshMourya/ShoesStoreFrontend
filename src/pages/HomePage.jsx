import { useEffect } from "react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuTruck, LuShield, LuRefreshCw } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchProductsThunk } from "../store/slices/productsSlice";
import { getImageUrl } from "../utils/imageUrl";
import Hero from "../components/Hero/Hero";
import ProductGrid from "../components/product/ProductGrid";
import SectionTitle from "../components/layout/SectionTitle";

const TICKER_ITEMS = [
  "Premium Quality",
  "Free Returns",
  "Authentic Brands",
  "New Arrivals Daily",
  "Curated Selection",
  "Secure Checkout",
];

function TickerStrip() {
  const repeated = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden bg-(--color-primary) py-3.5">
      <div className="flex whitespace-nowrap" style={{ animation: "marquee 22s linear infinite" }}>
        {repeated.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 px-6 text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60"
          >
            <span className="text-(--color-accent) text-sm">✦</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

const CATEGORY_IMAGES = {
  running:
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
  casual:
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=800&q=80",
  formal:
    "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
  sports:
    "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=800&q=80",
  "running-shoes":
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=800&q=80",
  sandals:
    "https://images.unsplash.com/photo-1562183241-840b8af0721e?auto=format&fit=crop&w=800&q=80",
  boots:
    "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=800&q=80",
};

function CategoryCard({ category, featured = false }) {
  const imageUrl = getImageUrl(category.image) || CATEGORY_IMAGES[category.slug];
  return (
    <Link
      to={`/products?category=${category.slug}`}
      className={`group relative overflow-hidden rounded-md bg-(--color-surface) block transition-all duration-300 ${
        featured ? "aspect-square lg:aspect-auto lg:row-span-2" : "aspect-4/3"
      }`}
      style={{ boxShadow: "var(--shadow-card)" }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "var(--shadow-hover)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "var(--shadow-card)")}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={category.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
        />
      ) : (
        <div className="h-full w-full bg-(--color-accent)/15 flex items-center justify-center">
          <span className="text-5xl opacity-30">👟</span>
        </div>
      )}
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
      {featured && (
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
            Featured
          </span>
        </div>
      )}
      <p className="absolute bottom-4 left-4 text-base font-semibold tracking-wide text-white transition-transform duration-300 group-hover:-translate-y-0.5">
        {category.name}
      </p>
    </Link>
  );
}

const FEATURES = [
  {
    icon: LuTruck,
    title: "Free Delivery",
    desc: "On all orders over ₹999",
  },
  {
    icon: LuShield,
    title: "100% Authentic",
    desc: "Every product verified",
  },
  {
    icon: LuRefreshCw,
    title: "Easy Returns",
    desc: "Hassle-free 30-day returns",
  },
];

function FeaturesStrip() {
  return (
    <section className="border-y border-(--color-border) bg-(--color-surface)">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-4 sm:flex-col sm:items-start sm:gap-3"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--color-accent)/10">
                <Icon size={18} className="text-(--color-accent)" />
              </div>
              <div>
                <p className="text-sm font-semibold text-(--color-primary)">{title}</p>
                <p className="mt-0.5 text-xs text-(--color-secondary)">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function EditorialBanner() {
  return (
    <section className="relative overflow-hidden bg-(--color-primary) py-20 sm:py-28">
      {/* Diagonal stripe texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, white 0px, white 1px, transparent 1px, transparent 36px)",
        }}
      />
      {/* Accent glow */}
      <div
        className="pointer-events-none absolute -bottom-20 right-0 h-80 w-80 rounded-full opacity-[0.08]"
        style={{ background: "var(--color-accent)", filter: "blur(80px)" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-8 sm:flex-row sm:items-end sm:justify-between sm:text-left">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-(--color-accent) mb-4">
              This Season
            </p>
            <h2
              className="text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: '"Playfair Display", serif', fontStyle: "italic" }}
            >
              Designed for those
              <br />
              who move with purpose.
            </h2>
          </div>
          <Link
            to="/products?sort=newest"
            className="inline-flex shrink-0 items-center gap-2 rounded-md border border-white/25 px-7 py-3.5 text-sm font-medium tracking-wide text-white transition-all hover:bg-white hover:text-(--color-primary) active:scale-95"
          >
            Shop New Arrivals <LuArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const dispatch = useAppDispatch();
  const { items: newArrivals, loading } = useAppSelector(s => s.products);
  const categories = useAppSelector(s => s.categories.items);

  useEffect(() => {
    dispatch(fetchProductsThunk({ sort: "newest", limit: 8 }));
  }, [dispatch]);

  const hasFeatured = categories.length >= 3;

  return (
    <>
      <Hero />

      {/* Scrolling ticker */}
      <TickerStrip />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionTitle title="Shop by Category" />
          <div
            className={`grid grid-cols-2 gap-4 ${hasFeatured ? "lg:grid-cols-3" : "sm:grid-cols-3 lg:grid-cols-4"}`}
          >
            {categories.map((c, i) => (
              <CategoryCard key={c._id} category={c} featured={hasFeatured && i === 0} />
            ))}
          </div>
        </section>
      )}

      {/* Features strip */}
      <FeaturesStrip />

      {/* Editorial banner */}
      <EditorialBanner />

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <SectionTitle title="New Arrivals" className="mb-0" />
          <Link
            to="/products?sort=newest"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-(--color-primary) hover:text-(--color-accent) transition-colors"
          >
            View all <LuArrowRight size={14} />
          </Link>
        </div>
        <ProductGrid products={newArrivals} loading={loading} />
      </section>
    </>
  );
}
